# Recette : sécurité et back-office (NA NAH N'HAIR, branche site-2)

Date : 28/10/2026. Cible : serveur de production local `http://localhost:3200` (`next start`, Next 16.2.5, stockage fichiers dans `recette/data`, `NNH_INSECURE_COOKIES=1`).
Scripts rejouables : `/tmp/claude-0/-home-user-nanahn-hair-/cbc784ff-bc8e-5b19-b2fe-76bd78d2564a/scratchpad/recette/agent-securite/` (`lib.mjs` = connexion + appel direct des server actions, `t1` à `t8`).
Légende : **[constaté]** = reproduit sur localhost:3200 ou lu dans le code ; **[supposé]** = déduit (comportement Netlify non testable d'ici).

Remise en état faite après les tests : prix, stock et livraison remis aux valeurs initiales, photo de test supprimée, les 7 messages de contact de test supprimés. Le test de déconnexion a invalidé **toutes** les sessions admin ouvertes (c'est le comportement voulu) : les autres agents devront se reconnecter. Il reste dans les données de test : un enregistrement CGV `NNH-20261028-DAB6D6`, des lignes de journal et des compteurs de tentatives (IP fictives 10.x, expirent au bout de 15 min / 1 h).

---

## Ce qui est solide

- **Accès sans session refusé partout [constaté]** : `/admin`, `/admin/produits`, `/admin/livraison`, `/admin/messages`, `/admin/journal` → 307 vers `/admin/connexion`, y compris en requête RSC (`RSC: 1`) : aucune donnée admin dans la réponse. `/admin/messages-export` → 401. Chaque page appelle `requireAdmin()` (pas seulement le layout) ; il n'y a pas de middleware, donc les contournements de middleware connus de Next ne s'appliquent pas.
- **Server actions appelées directement sans cookie [constaté]** (`updateProduct`, `updateShipping`, `removeMessage`) : redirection vers la connexion, rien n'est modifié.
- **Jeton de session [constaté]** : HMAC-SHA256 vérifié en temps constant. Payload modifié, signature vide ou absente, signé avec un autre secret, JSON invalide, jeton expiré (émis il y a 8 h 01) : tous refusés. Contenu limité à `{v, exp, n}`.
- **Cookie [constaté]** : `nnh_admin`, `HttpOnly`, `SameSite=Strict`, `Max-Age=28800` (8 h), `Path=/`. Par défaut `Secure` en production (`lib/auth.ts:40`, désactivé uniquement si `NNH_INSECURE_COOKIES=1`).
- **Déconnexion [constaté]** : cookie effacé et « epoch » serveur, donc le cookie rejoué est refusé, et une 2ᵉ session ouverte sur un autre appareil aussi.
- **CSRF [constaté]** : une action avec `Origin: https://evil.example` est rejetée par Next (500, rien n'est modifié). En plus, `SameSite=Strict`.
- **Mot de passe** : scrypt (N=32768) avec sel, comparaison en temps constant, longueur maximale 200 ; 5 échecs par IP et par 15 min [constaté : le 6ᵉ essai, même avec les bons identifiants, est bloqué ; une autre IP passe].
- **Échec sûr si une variable manque [constaté dans le code]** : sans `ADMIN_PASSWORD_HASH` (préfixe `scrypt$`) ou sans `ADMIN_SESSION_SECRET` d'au moins 32 caractères, le back-office est fermé (« non configuré ») et toute session est refusée. Si le stockage ne répond pas, la session est refusée.
- **Validation back-office [constaté]** : prix `-5`, `abc`, `0`, `1e3`, `100000`, `19,999`, HTML → refusés ; stock `-1`, `1.5`, `999999`, `abc` → refusés ; id `../catalog` → refusé. Photos : HTML ou SVG déclarés image → refusés (vérification des octets de signature) ; plus de 4 Mo → refusé ; plus de 5 Mo → 400. Photo servie avec `nosniff` + CSP.
- **Modifications reflétées sur la boutique [constaté]** : prix 12,34 € visible tout de suite sur `/soins/fabulous`, `/boutique` et `/api/catalog`. Stock 2 → devis de 3 refusé (`insufficient-stock`), y compris pour le pack. Désactivation → « Épuisé » + `unavailable` au devis. Livraison (seuil 50 €, Colissimo 5,90 €) → devis 29,90 + 5,90 ; livraison offerte à 59,80 €. Règles de cohérence (au moins un transporteur ; tarif obligatoire si le seuil est > 0) appliquées.
- **API publiques [constaté]** : le prix envoyé par le client est ignoré (le calcul se fait toujours sur la base) ; quantités contrôlées (au-delà de 99 → ramenées à 99, négatives → refusées, `__proto__`/`constructor` → produit inconnu) ; corps limité (8 Ko pour la commande, 5 Ko pour le devis), même en envoi fragmenté sans Content-Length → 413 ; JSON invalide → 400 générique ; GET/PUT → 405 ; adresse : DOM-TOM, champ de plus de 120 caractères, email invalide → refusés. Les messages d'erreur ne révèlent rien du fonctionnement interne.
- **XSS stocké [constaté]** : `<script>` et `<img onerror>` envoyés par le formulaire de contact sont échappés dans `/admin/messages`. Dans l'export CSV, les cellules commençant par `= + - @` sont neutralisées (les espaces de début sont supprimés avant le contrôle).
- **En-têtes [constaté]** sur toutes les routes (pages, API, media) : CSP (`frame-ancestors 'none'`, `object-src 'none'`, `base-uri`, `form-action`), HSTS 2 ans + includeSubDomains, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, pas de `X-Powered-By`. Admin : `noindex` + `no-store`. `robots.txt` : `Disallow: /` tant que `NNH_INDEXABLE` ≠ 1.
- **Secrets [constaté]** : aucun secret dans `git ls-files` ni dans l'historique (`git log --all -p` sur `sk_live_`, `sk_test_`, `whsec_`, `ADMIN_*=`, `scrypt$…`, clés privées, `ghp_`, `NETLIFY_AUTH_TOKEN`, chaînes base32 de 32 caractères). `.env*` et `.data` sont exclus par `.gitignore`. `.env.example` est vide de valeurs. Seuls des identifiants **de test** figurent dans `playwright.config.ts` (normal).

---

## Failles et défauts

### 🔴 Bloquant

**1. Next.js 16.2.5 : alerte critique `npm audit` [constaté]**
- `package.json:20` (`"next": "16.2.5"`, version figée). `npm audit --omit=dev` : 3 vulnérabilités (1 critique, 2 élevées : `next`, `postcss` et `sharp` embarqués). Plusieurs concernent directement ce site, qui utilise les server actions : déni de service sur les server actions (GHSA-m99w-x7hq-7vfj, GHSA-p3m5-59mp-jv5r), confusion de cache des réponses pour les requêtes avec corps (GHSA-68g3-v927-f742, GHSA-4633-3j49-mh5q), divulgation des points d'entrée des server functions (GHSA-955p-x3mx-jcvp). Les failles de l'optimiseur d'images et du middleware ne s'appliquent pas ici (`images.unoptimized: true`, pas de middleware).
- Correctif : passer `next` et `eslint-config-next` en **≥ 16.4.3**, puis relancer les tests unitaires et e2e, `npm audit --omit=dev` et un build Netlify. React 19.2.4 : pas d'alerte.

**2. Pas de commande ni de paiement réels [constaté, fonctionnel]**
- `/api/commande` répond `paymentAvailable: false` et n'enregistre que la preuve d'acceptation des CGV. Le back-office ne contient pas de page Commandes (l'accueil admin affiche « Commandes, codes promo et factures : phase 6 (avec Stripe) »). Une ouverture « e-commerce » sans paiement ni suivi des commandes n'est pas possible : bloquant si l'ouverture inclut la vente en ligne (à confirmer avec le périmètre prévu).

### 🟠 Important

**3. Un code TOTP peut être rejoué, et il est valable environ 90 s [constaté]**
- `lib/auth-core.ts:89-97` et `app/admin/actions.ts:42` : rien ne mémorise le dernier code utilisé. Les codes des périodes −1, 0 et +1 sont acceptés.
- Reproduction (`t1-login.mjs`) : connexion avec le code C → session ; nouvelle connexion avec le **même** code C → 2ᵉ session obtenue. Le code de la période −1 et celui de la période +1 sont acceptés aussi, celui de la période −2 est refusé.
- Impact : la double authentification ne protège pas contre un code intercepté (hameçonnage en direct, épaule, enregistrement d'écran) pendant environ 90 s. Correctif : enregistrer le dernier compteur TOTP accepté dans le stockage et refuser tout compteur inférieur ou égal.

**4. N'importe qui peut bloquer la connexion admin (limite globale) [constaté dans le code, limite par IP constatée]**
- `app/admin/actions.ts:26` et `:37` : 50 échecs, toutes IP confondues, bloquent pour tout le monde pendant 15 min, **y compris avec le bon mot de passe et le bon code**. Il suffit de 10 IP × 5 essais toutes les 15 min pour empêcher la gérante de se connecter, indéfiniment. Ces essais remplissent aussi le journal (« connexion refusée », 500 entrées au maximum) : en environ 2 h 30, les vraies actions disparaissent du journal.
- Correctif : ne pas appliquer la limite globale (ou une limite beaucoup plus haute) quand le mot de passe est juste, ou remplacer le blocage global par un ralentissement progressif. Prévoir une alerte. Ne journaliser qu'un résumé des échecs.

**5. Écritures concurrentes perdues ou en erreur (limiteurs, messages, journal) [constaté en local, supposé sur Netlify]**
- `lib/store/index.ts:90` (`appendAudit`), `:138` (`appendContactMessage`), login-attempts et contact-attempts : chaque écriture lit toute la liste, la modifie puis la réécrit, sans verrou. Sur Netlify Blobs en cohérence « éventuelle » (`lib/store/netlify-store.ts:19`), une lecture peut en plus renvoyer une valeur ancienne (jusqu'à environ 60 s selon la documentation Netlify, **supposé**).
- Reproduction (`t6-limites.mjs`) :
  - 12 mauvais mots de passe envoyés en même temps depuis une IP neuve → **9 ont été vérifiés** alors que la limite est 5, et le compteur n'a enregistré que 2 échecs. Le compteur global est aussi sous-estimé (15 enregistrés pour plus de 20 échecs réels).
  - 10 messages de contact envoyés en même temps → 1 enregistré, **9 en erreur** (« Le message n'a pas pu être envoyé »). En local, la cause est une collision de nom de fichier temporaire (`lib/store/file-store.ts:10`, `pid.Date.now()`, visible dans le journal des erreurs). Sur Blobs il n'y aurait pas cette erreur, mais **une perte silencieuse** : deux clientes qui écrivent à quelques secondes d'intervalle, et l'un des deux messages est écrasé (**supposé**).
  - Même mécanisme pour la déconnexion (`getSessionEpoch`, `:117`) : en cohérence éventuelle, un cookie volé pourrait rester accepté quelques secondes après « Se déconnecter » (**supposé**).
- Impact : messages clients perdus sans que personne ne le sache, limitation des tentatives contournable, journal incomplet. Correctif : une clé par message et par entrée de journal (`contact/<id>`, lister avec `list({prefix})`), lectures `consistency: "strong"` pour l'epoch, les compteurs et les messages, et un vrai stockage (Supabase, déjà prévu) avant le volume.

**6. `/api/sante?detail=1` est public et écrit dans Netlify Blobs à chaque appel [constaté dans le code]**
- `app/api/sante/route.ts:8,25` et `lib/store/index.ts:203` : sans authentification, chaque appel fait un `setJSON("diagnostic")` sur la boutique de production, avec des délais pouvant atteindre 3 s × 3. Même sans `detail`, la réponse publique indique la version de Node (`v22.22.0`), la branche, le contexte, la présence du back-office, le type de stockage et le texte brut des erreurs de stockage.
- Reproduction : `curl https://<site>/api/sante?detail=1` en boucle → écritures Blobs et temps de fonction consommés, sans limite.
- Impact : consommation de quotas et de crédits, et renseignements utiles à un attaquant. Le workflow GitHub `verifier-site-2.yml` s'en sert. Correctif : réserver `detail=1` (et idéalement toute la route, sauf `{ok}`) à une session admin ou à un jeton, ou le désactiver en contexte `production`.

**7. Anti-robot du formulaire de contact contournable par script [constaté]**
- `app/contact/actions.ts:12-18` : le champ piège et le délai minimal reposent sur `debut`, une valeur envoyée par le navigateur. Un script qui envoie `debut = maintenant − 10 s` et un `site_web` vide passe (`t5-contact.mjs` : accepté). La seule vraie barrière est 5 messages par heure et par IP (`:33`, constaté : le 6ᵉ est refusé), contournable aussi par envois simultanés (point 5).
- Impact : avec plusieurs IP, un spammeur remplit la liste, qui est **limitée aux 1 000 derniers messages** (`lib/store/index.ts:141`) : les vrais messages sont alors supprimés sans avertissement. Aucune alerte email n'est envoyée à la boutique pour un nouveau message (constaté : les messages sont seulement stockés), il faut donc penser à consulter le back-office.
- Correctif : `debut` signé côté serveur (HMAC) ou un captcha respectueux de la vie privée (Turnstile, Friendly Captcha ; à ajouter à la CSP et au bandeau cookies si nécessaire), une alerte email, et pas de purge silencieuse.

**8. Double authentification désactivée sans avertissement si `ADMIN_TOTP_SECRET` manque [constaté dans le code]**
- `lib/auth.ts:13` + `app/admin/actions.ts:42` (`totpOk = !config.totpSecret || …`) : si la variable est oubliée ou vide sur Netlify, le back-office s'ouvre avec le mot de passe seul, sans message. `/api/sante` (`backOfficeConfigure`) ne vérifie pas non plus la présence du TOTP.
- Correctif : en contexte Netlify `production` (et branch-deploy), considérer le back-office comme « non configuré » sans TOTP, ou au minimum afficher un avertissement dans l'admin.

**9. Les déploiements de branche et les aperçus partagent les données de production [supposé, lu dans le code et le workflow]**
- `site-2` est publié en *branch deploy* du **même** site Netlify que `main` (même identifiant de badge dans `.github/workflows/verifier-site-2.yml`, `https://site-2--nanahnhair.netlify.app`). `getStore({ name: "na-nah-nhair" })` (`lib/store/netlify-store.ts`) est un stockage **à l'échelle du site**, donc partagé entre production, branch deploys et deploy previews.
- Impact : les prix, stocks, messages et sessions de recette passeront tels quels en production. Un deploy preview de PR (code non relu) aurait accès aux vraies données et à l'epoch de session si les variables `ADMIN_*` sont aussi définies pour ce contexte. Correctif : nettoyer les données avant l'ouverture, un nom de stockage par contexte (`na-nah-nhair-${process.env.CONTEXT}`) ou `getDeployStore` pour les aperçus, et ne pas donner les variables `ADMIN_*` au contexte « Deploy previews » (ou désactiver les aperçus).

### 🟢 Confort

10. **Cookie `Secure` désactivable par variable [constaté]** (`lib/auth.ts:40`) : si `NNH_INSECURE_COOKIES=1` était copié par erreur sur Netlify, le cookie partirait sans `Secure` (HSTS limite le risque). Ignorer cette variable quand `process.env.CONTEXT` est défini (Netlify), ou la faire refuser par `verifier:mise-en-ligne`.
11. **CSP avec `script-src 'unsafe-inline'` [constaté]** (`next.config.ts:12`) : la CSP ne bloquerait pas un script injecté. React échappe déjà les données (point vérifié), mais un nonce, via `proxy.ts`, renforcerait la défense. À revoir de toute façon avec Stripe (`js.stripe.com`, `frame-src`, `connect-src`).
12. **Server action sans en-tête `Origin` acceptée [constaté]** (comportement de Next) : sans risque depuis un navigateur (qui envoie toujours `Origin` sur un POST, et `SameSite=Strict`). À noter seulement.
13. **`/api/commande` sans limite [constaté]** : chaque appel valide crée un enregistrement `cgv-acceptations/<n°>` (écriture Blobs). On peut donc en créer un nombre illimité par script. Ajouter une limite par IP, comme pour le contact.
14. **`/api/catalog` publie le stock exact [constaté]** (`stock: 2`, `available`) : la concurrence voit les volumes. Publier seulement `available` plafonné (par exemple « plus de 10 ») si cela gêne.
15. **Journal** : la déconnexion n'y figure pas [constaté] ; il conserve les IP sans durée limitée (donnée personnelle, à mentionner dans la politique de confidentialité ou à purger). Les erreurs y apparaissent avec des chemins serveur (visible par l'admin seulement).
16. **IP par défaut `ip-inconnue` [constaté]** (`lib/auth.ts:56`) : si l'en-tête `x-nf-client-connection-ip` manque, tous les visiteurs partagent le même compteur (5 échecs bloquent tout le monde). En local, cet en-tête se falsifie librement ; sur Netlify, il est posé par l'edge (**supposé** non falsifiable).
17. **Deux `netlify.toml` [constaté]** : la racine (branche `site-2`) fixe `base = "na-nah-nhair"` et `NODE_VERSION = "22"`, tandis que `na-nah-nhair/netlify.toml` n'a pas `NODE_VERSION`. Netlify lit d'abord le fichier du dossier de base (**supposé**) : dans ce cas, `NODE_VERSION` serait ignoré. Garder les deux fichiers identiques (ou en supprimer un). Le garde-fou `verifier:mise-en-ligne` ne s'exécute qu'en contexte `production`, ce qui est voulu ; il ne contrôle pas les variables d'environnement.
18. **HSTS `includeSubDomains`** : sur le domaine définitif, vérifier qu'aucun sous-domaine n'est encore en HTTP (sous-domaine mail, ancien site) avant d'activer.
19. **Media `Cache-Control: immutable` 1 an** : une photo retirée reste en cache CDN sous son ancienne URL. Pas grave, les clés sont aléatoires.

### Le site `main` (premier site)
- [constaté] `main:netlify.toml` est l'ancien fichier (build simple, sans `base`). Les branch deploys de `site-2` ne touchent pas la production `main`. **Attention** : fusionner `site-2` dans `main` remplacerait le `netlify.toml` racine, donc publierait le nouveau site en production. Le garde-fou bloquerait alors le build tant qu'il reste des « À COMPLÉTER » (Netlify laisse en ligne le déploiement précédent : l'ancien site ne serait pas cassé, seulement pas mis à jour).

---

## À mettre en place avant l'ouverture

1. **Mettre Next à jour en ≥ 16.4.3** (+ `eslint-config-next`), puis relancer les tests et `npm audit --omit=dev`.
2. **Variables Netlify, contexte Production** (le GUIDE ne parle que de « Branch deploys », `GUIDE.md:65`) :
   - `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET` (au moins 32 caractères, générée par `npm run admin:setup`), `ADMIN_TOTP_SECRET` : **nouvelles valeurs** pour la production, différentes de celles de recette ; mot de passe d'au moins 12 caractères, longue phrase de passe recommandée.
   - `SITE_URL` (domaine définitif), `NNH_INDEXABLE=1` (sinon `robots.txt` interdit tout le site).
   - Stripe, plus tard : `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (contexte Production uniquement ; des clés test pour les branch deploys), plus la CSP à élargir.
   - **Ne pas** définir `NNH_INSECURE_COOKIES` ni `NNH_DATA_DIR` sur Netlify. Ne pas donner les variables `ADMIN_*` au contexte « Deploy previews ».
   - Après le déploiement, vérifier : `/api/sante` → `backOfficeConfigure: true`, `stockage: netlify-blobs`, et la connexion admin qui **demande bien le code TOTP**.
3. **Données** : vider le stockage `na-nah-nhair` (prix, stocks, messages, journal, cgv-acceptations de recette) ou séparer les stockages par contexte (point 9).
4. **Corriger avant l'ouverture (🟠)** : refus du rejeu TOTP (3), blocage global de la connexion (4), perte d'écritures sur les messages (5, au minimum une clé par message), protection de `/api/sante?detail=1` (6), anti-spam signé ou captcha + alerte email pour les nouveaux messages (7), TOTP obligatoire en production (8).
5. **Netlify** : désactiver les deploy previews ou leur couper l'accès aux données ; aligner les deux `netlify.toml` ; ne fusionner `site-2` dans `main` qu'au moment de la bascule.
6. **Après la mise en ligne** : `curl -I https://<domaine>/` pour contrôler les en-têtes (HSTS, CSP), cookie `Secure` visible dans les outils du navigateur, test de déconnexion, test du formulaire de contact.
