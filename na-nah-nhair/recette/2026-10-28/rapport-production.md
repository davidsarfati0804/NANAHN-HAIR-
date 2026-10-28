# Recette avant mise en ligne : plan de mise en production

NA NAH N'HAIR · rapport du 28/10/2026 · dépôt `davidsarfati0804/NANAHN-HAIR-`, branche `site-2` au commit `1a9d702` (identique à `origin/site-2`, arbre de travail propre).

Méthode : lecture du code, `npm run verifier:mise-en-ligne`, essais sur le serveur local `http://localhost:3200`, lecture des 36 derniers runs du workflow `verifier-site-2` (annotations). Rien n'a été modifié, poussé ni déclenché.
Notes brutes : `/tmp/claude-0/-home-user-nanahn-hair-/cbc784ff-bc8e-5b19-b2fe-76bd78d2564a/scratchpad/recette/agent-prod/` (sortie du vérificateur, annotations JSON).

Légende : **[constaté]** = vu dans le code, en local ou dans un run ; **[supposé]** = déduit, à confirmer ; **À VÉRIFIER** = impossible à vérifier d'ici (Netlify, registraire, DNS : les requêtes DNS publiques sont bloquées par le proxy du conteneur).

---

## 1. Prêt

- 🟢 **Garde-fou de production** [constaté] : `netlify.toml:16-17` (racine) et `na-nah-nhair/netlify.toml:10-11` lancent `npm run verifier:mise-en-ligne && npm run build` en contexte production. Tant qu'il reste des « À COMPLÉTER », le build de production échoue et Netlify garde le site déjà publié (l'ancien). C'est un filet de sécurité utile pour la bascule.
- 🟢 **Non-indexation par défaut** [constaté] : `lib/site-url.ts:12-13` (`NNH_INDEXABLE === "1"`), `app/layout.tsx:23`. En local : `robots.txt` = `Disallow: /`, `<meta name="robots" content="noindex, nofollow">`. Admin, panier, commande et quiz/résultat sont toujours en noindex.
- 🟢 **En-têtes de sécurité** [constaté] : `next.config.ts:9-31` (CSP, HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy), `poweredByHeader: false`. Redirection 301/308 `/retours` → `/retractation` (`next.config.ts:45-46`), constatée en local.
- 🟢 **Stockage Netlify Blobs opérationnel sur site-2** [constaté, run 40473472417 du 27/10 08:26] : `/api/sante?detail=1` : écriture 25 ms, lecture 13 ms, clé absente 6 ms, `ok:true`.
- 🟢 **Pages principales en ligne** [constaté, même run] : 14 pages en 200, de 0,08 à 0,2 s ; 34 contrôles de contenu OK, 0 ABSENT, sur le commit `1a9d702` (= tête de site-2).
- 🟢 **Node** [constaté] : `netlify.toml:8-9` fixe `NODE_VERSION = "22"` ; site-2 tourne en v22.23.4, le local en v22.22.0.
- 🟢 **Poids du build** [constaté] : `.next` 23 Mo (serveur 20 Mo, statique 1,1 Mo), `public/` 5,2 Mo. 22 routes pré-rendues (pages légales, FAQ, contact, quiz…) ; accueil, boutique, soins, pack passent par la fonction serveur (lecture du catalogue dans Blobs).
- 🟢 **Fusion simple** [constaté] : `main` (`7dfa7d3`, 14/05/2026) est l'ancêtre commun ; `site-2` a 50 commits d'avance et 0 de retard. La fusion de site-2 dans main serait une avance rapide (fast-forward), sans conflit.

---

## 2. Bloquant / à corriger

### 🔴 Bloquants pour ouvrir une vraie boutique

1. **Le vérificateur de mise en ligne refuse le build : 8 points** [constaté, `npm run verifier:mise-en-ligne`, code de sortie 1]
   - `content/juridique/cgv-v1.md:3` : « Projet de texte à faire relire… Dernière mise à jour : [À COMPLÉTER : date] »
   - `content/juridique/cgv-v1.md:107` : médiateur de la consommation [À COMPLÉTER : nom, adresse, site]
   - `content/juridique/confidentialite.md:3` : mention « projet » + date À COMPLÉTER
   - `content/juridique/cookies.md:3` : mention « projet » + date À COMPLÉTER
   - `content/juridique/mentions-legales.md:3` : mention « projet »
   - `content/juridique/mentions-legales.md:36` : médiateur À COMPLÉTER
   - `content/juridique/retractation.md:3` : mention « projet »
   - `content/juridique/textes-boutique.md:3` : « Projets à faire relire »

   L'adhésion à un médiateur est obligatoire (la marque doit choisir et souscrire). Ensuite : relecture, dates, suppression des mentions « projet », puis `npm run pdf:juridique` (le PDF des CGV est joint à l'email de confirmation).
   **Qui** : la marque (médiateur, relecture), puis le développeur (intégration). **Effort** : médiateur de quelques jours à 2 semaines (adhésion) ; intégration 1 h.

2. **Le paiement n'existe pas : aucune vente n'est possible** [constaté]
   `app/api/commande/route.ts:14-16` et `:42` : la commande renvoie `paymentAvailable: false`, rien n'est encaissé et seule la preuve d'acceptation des CGV est enregistrée (pas la commande elle-même : ni client, ni adresse, ni lignes). `content/site.ts:792` affiche « Le paiement en ligne… arrive bientôt ». Stripe n'est pas dans `package.json`, pas de `STRIPE_*` dans le code, et la CSP (`next.config.ts:9-20`) bloquerait Stripe.
   Il faut décider : ouvrir en **vitrine** (le site actuel est publiable tel quel, sans vente) ou attendre la **phase 6** (Stripe Checkout + webhook + enregistrement des commandes + email de confirmation).
   **Qui** : la marque (compte Stripe vérifié, IBAN, KYC) et le développeur (intégration). **Effort** : 3 à 5 jours de développement et de tests, plus le délai de validation du compte Stripe.

3. **Aucun email de confirmation n'est envoyé** [constaté] : `lib/emails/confirmation.ts:1-3` (« Aucun service d'envoi n'est encore branché »). Or les CGV (`cgv-v1.md`, article 4) promettent un email avec les CGV et le formulaire de rétractation : c'est une obligation légale (confirmation du contrat sur support durable). Ce point est lié au 🔴2.
   **Qui** : le développeur (service d'envoi, Resend d'après la politique de confidentialité), la marque (accès DNS). **Effort** : 1 jour, plus la propagation DNS.

4. **Le back-office n'est pas configuré en ligne** [constaté, runs du 27/10 : `"backOfficeConfigure": false` sur site-2]. Les variables `ADMIN_PASSWORD_HASH` et `ADMIN_SESSION_SECRET` ne sont pas visibles par les fonctions de site-2. Sans elles, la marque ne peut gérer ni les prix, ni les stocks, ni les messages en production.
   **À VÉRIFIER dans Netlify** : les variables existent-elles, avec quel périmètre (Builds / Functions) et quel contexte ?
   **Qui** : le développeur (`npm run admin:setup -- "mot de passe"`) avec la marque (mot de passe, application TOTP). **Effort** : 30 min.

5. **Les données de recette seront les données de production (Netlify Blobs partagé)** [constaté dans le code, comportement Netlify à confirmer]
   `lib/store/index.ts:19` utilise `createNetlifyStore("na-nah-nhair")`, c'est-à-dire `getStore({ name })`, un magasin **à l'échelle du site Netlify**. Il est commun à tous les déploiements du même site : production, branche site-2, aperçus de PR. site-2 (`site-2--nanahnhair.netlify.app`) est un déploiement de branche du **même** site Netlify que la production `nanahnhair.netlify.app` (même identifiant de badge `1c82ca70-…` dans le workflow) [constaté].
   Conséquences :
   - (a) tout ce qui a été saisi pendant la recette (catalogue, réglages, messages de contact, preuves CGV de commandes de test, journal, tentatives de connexion, clé `diagnostic`) sera en production ;
   - (b) après la bascule, une modification faite dans le back-office d'un aperçu ou de site-2 modifiera **la boutique réelle**.

   À corriger avant le jour J : nom du magasin par contexte, via une variable posée dans Netlify par contexte. `CONTEXT` n'est pas disponible à l'exécution : `/api/sante` renvoie `"contexte":"local"` sur site-2 [constaté]. Autre possibilité : désactiver les déploiements de branche et les aperçus après la bascule. Il faut aussi faire une purge ou une revue des clés de test.
   **Qui** : le développeur. **Effort** : 2 h.

### 🟠 À corriger avant ou juste après la bascule

6. **Anciennes URL en 404 : redirections 301 à créer** [constaté sur `localhost:3200`]. Les pages de l'ancien site (lues depuis `origin/main`, sans checkout) et leur équivalent proposé :

   | Ancienne URL (main) | Nouveau site | En local aujourd'hui |
   |---|---|---|
   | `/` | `/` | 200 |
   | `/boutique` | `/boutique` | 200 |
   | `/contact`, `/faq`, `/cgv`, `/mentions-legales`, `/panier` | identiques | 200 |
   | `/a-propos` | `/mon-histoire` | **404** |
   | `/produits/fabulous`, `/produits/miraculous`, `/produits/luxurious` | `/soins/fabulous`, `/soins/miraculous`, `/soins/luxurious` | **404** |
   | `/produits/pack-zero-prise-de-tete` (id dans `origin/main:data/products.ts`) | `/pack` | **404** |
   | `/produits/:id` (autre) | `/soins` | **404** |
   | `/politique-confidentialite` | `/confidentialite` | **404** |
   | `/livraison-retours` | `/cgv` (ou `/faq`) [choix à valider par la marque] | **404** |
   | `/routines` | `/soins` (ou `/quiz`) [choix à valider] | **404** |
   | `/resultats` | `/` (pas d'équivalent) [choix à valider] | **404** |

   Les ajouter dans `next.config.ts:45-46` (`redirects()`, même mécanisme que `/retours`). **Qui** : le développeur. **Effort** : 30 min.

7. **Pas de page 404 ni de page d'erreur en français** [constaté] : il n'existe ni `app/not-found.tsx`, ni `app/error.tsx`, ni `app/global-error.tsx`. En local, `/page-inexistante` affiche la page par défaut de Next.js « 404: This page could not be found. », en anglais et sans charte. Ce sera visible dès la bascule, à cause des anciennes URL. **Effort** : 1 h.

8. **`SITE_URL` doit être défini en production** [constaté + supposé]. `lib/site-url.ts:3-8` : sans `SITE_URL`, le code s'appuie sur `CONTEXT`/`URL`, or `CONTEXT` est absent à l'exécution [constaté]. L'adresse servirait aux liens de l'email de confirmation et à `metadataBase` (`app/layout.tsx:22`) ; elle pourrait tomber sur `URL` (variable non vérifiée à l'exécution) ou sur `http://localhost:3000` [supposé]. Le `sitemap.xml` est pré-rendu au build [constaté, `prerender-manifest`] : il faut donc **redéployer après** avoir choisi le domaine principal.

9. **`NNH_INDEXABLE=1` doit être présent au build ET à l'exécution, en production uniquement** [constaté] : les pages légales sont pré-rendues (la balise meta robots est figée au build), alors que `robots.txt` est dynamique (`app/robots.ts:4`). Dans Netlify, il faut donc le périmètre « Builds + Functions » et le contexte « Production » seul, jamais pour les déploiements de branche.

10. **La politique de confidentialité ne correspond pas aux prestataires réels** [constaté] : `content/juridique/confidentialite.md:27,29` cite Supabase et Resend (et Stripe), mais les données sont aujourd'hui dans Netlify Blobs et aucun service d'email n'existe. À aligner sur le choix final. **Qui** : la marque et le développeur.

11. **Messages du formulaire de contact : aucune notification** [constaté] : ils sont stockés seulement dans Blobs (`lib/store/index.ts`, `appendContactMessage`) et consultables dans `/admin/messages`. La marque doit le savoir (prévoir une consultation quotidienne), ou bien il faut brancher un email de notification avec le service d'envoi.

12. **Pas de sauvegarde des données** [constaté : il n'existe que l'export des messages, `/admin/messages-export`]. Clés à sauvegarder : `catalog`, `settings`, `media-*` (photos envoyées), `contact-messages`, `cgv-acceptations/*`, `audit-log`, `error-log`. À prévoir : un script développeur via `@netlify/blobs` ou la CLI Netlify (`netlify blobs:list/get`), une sauvegarde juste avant la bascule, puis une sauvegarde hebdomadaire. **À VÉRIFIER dans Netlify** : l'absence de sauvegarde automatique des Blobs. **Effort** : 2 h.

13. **Le workflow `verifier-site-2` ne peut pas échouer** [constaté] : 36 runs sur 36 sont en « success », mais le fichier ne contient aucune sortie en erreur (`exit 1` ou `::error`), seulement des `::notice`. Le vert ne prouve donc rien : il faut lire l'annotation « Résumé site-2 » (dernier run : 34 OK / 0 ABSENT). De plus, les lignes « statut Netlify » `site-2 :` / `main :` sont vides dans tous les runs lus : l'analyse du badge ne fonctionne pas. Il contrôle seulement `site-2--nanahnhair.netlify.app`, et aucun contrôle n'existe pour le futur domaine.

14. **Surveillance** : `/api/sante` (`app/api/sante/route.ts`) convient à un moniteur externe (UptimeRobot, Better Stack…) qui vérifie `"ok":true` toutes les 5 min. Deux remarques : `/api/sante?detail=1` est public et **écrit** la clé `diagnostic` dans le magasin de production à chaque appel (`lib/store/index.ts`, `storeDeepCheck`) ; la page expose aussi la version de Node et l'état du back-office. Il faudrait réserver `detail=1` à l'admin. **Effort** : 30 min.

### 🟢 Remarques mineures

15. **Commentaire trompeur** : `na-nah-nhair/netlify.toml:1` parle d'un « Site Netlify n°2 » avec base directory à régler dans l'interface, alors que site-2 est un déploiement de branche du site `nanahnhair` [constaté]. La racine `netlify.toml:4` fixe `base = "na-nah-nhair"`. **À VÉRIFIER dans le journal de build Netlify** : quel `netlify.toml` est réellement lu (racine ou sous-dossier) et quelle « Base directory » est saisie dans l'interface. Seule la racine fixe `NODE_VERSION` ; il n'y a ni `.nvmrc` ni `engines` dans `package.json`.
16. **HSTS** `max-age=63072000; includeSubDomains` (`next.config.ts:25`) : sur le domaine définitif, tous les sous-domaines devront être en HTTPS. Ne pas demander le « preload » au début.
17. **CSP** à élargir pour Stripe (js.stripe.com, frames de paiement) lors de la phase 6.
18. **Performance** : accueil, boutique, soins et pack sont rendus par la fonction à chaque visite, ce qui compte dans le quota d'invocations de fonctions. **À VÉRIFIER dans Netlify** : l'offre et les quotas du compte.
19. **FAQ « Où livrez-vous ? »** répond encore « France uniquement », alors que les CGV disent France métropolitaine, Corse comprise (`TODO-A-COMPLETER.md`).

---

## 3. Plan de bascule et checklist jour J

### 3.1 Situation actuelle

- [constaté] Un seul site Netlify, `nanahnhair`. La branche de production est `main` (ancien site, à la racine du dépôt, `origin/main:netlify.toml` sans `base`). site-2 est publié en déploiement de branche (`site-2--nanahnhair.netlify.app`), avec `netlify.toml` racine `base = "na-nah-nhair"`.
- [constaté] Le dossier racine de site-2 contient toujours aussi l'ancien site (`app/`, `components/`… à la racine) : il est ignoré au build grâce à `base`.
- **À VÉRIFIER dans Netlify** : la « Base directory » saisie dans l'interface (probablement vide), la branche de production, l'activation des déploiements de branche et des aperçus, les domaines personnalisés déjà rattachés.
- **À VÉRIFIER chez le registraire** : qui détient `nanahnhair.com` [supposé d'après l'adresse Contact@nanahnhair.com], où sont les serveurs DNS, qui héberge la messagerie (enregistrements MX) et si le domaine pointe déjà vers l'ancien site.

### 3.2 Les trois options (aucune n'a été exécutée)

| | **A. Fusionner site-2 dans main (recommandée)** | **B. Changer la branche de production en site-2** | **C. Nouveau site Netlify (base `na-nah-nhair`)** |
|---|---|---|---|
| Action | Poser un tag `ancien-site` sur `7dfa7d3`, puis fusionner site-2 dans main en avance rapide | Netlify > Build & deploy > Branches : production = `site-2` | Créer un site Netlify (même dépôt, base `na-nah-nhair`), puis y déplacer le domaine |
| netlify.toml lu | La racine de site-2 devient celle de main : `base = "na-nah-nhair"`, Node 22, garde-fou de production | Idem (racine de site-2) | Celui du sous-dossier `na-nah-nhair/netlify.toml` si la base est saisie dans l'interface [supposé, À VÉRIFIER] : pas de `NODE_VERSION` |
| Données Blobs | Conservées (même site) : recette incluse, à purger | Conservées, à purger | Magasin **neuf et vide** : catalogue et photos du back-office à ressaisir ou migrer |
| Variables d'env. | Déjà sur le site, à compléter par contexte | Idem | Toutes à recréer |
| Garde-fou | S'applique : tant que le 🔴1 n'est pas réglé, le build de prod échoue et l'ancien site reste en ligne | Idem | Idem |
| Risques | Une fusion qui casse est visible tout de suite ; le dépôt garde l'ancien site à la racine (inoffensif) | « main » n'est plus la production : source de confusion et de futures erreurs | Domaine à déplacer entre deux sites : coupure HTTPS de quelques minutes à 1 h, le temps de générer le certificat |
| Retour arrière | Immédiat : Netlify > Deploys > ancien déploiement de production > « Publish deploy ». Ensuite `git revert`, ou remettre main sur le tag | Remettre la branche de production sur `main` et republier l'ancien déploiement | Remettre le domaine sur l'ancien site |

**Recommandation** : l'option A, une fois le 🔴5 corrigé (magasin par contexte). Le retour arrière par « Publish deploy » prend une minute et ne touche pas Git. Le jour J, le développeur ne pousse sur main **qu'avec l'accord explicite** de la marque.

### 3.3 Domaine, HTTPS, emails (rien n'a pu être vérifié d'ici)

- **À VÉRIFIER chez le registraire** : la propriété du domaine, sa date d'expiration et le renouvellement automatique, les DNS actuels (A, CNAME, MX, TXT).
- **DNS** : conserver le DNS du registraire (plus sûr pour la messagerie). Apex `nanahnhair.com` → enregistrement A vers le load balancer Netlify, ou ALIAS/ANAME ; `www` → CNAME `nanahnhair.netlify.app`. Le **domaine principal** est à choisir (`www` ou apex), et l'autre redirige en 301 (Netlify le fait automatiquement une fois les deux rattachés) [supposé, À VÉRIFIER]. Si la zone passe sous Netlify DNS, il faut **recopier MX, SPF et DKIM avant** de changer les serveurs de noms, sinon la boîte Contact@ cesse de recevoir.
- **HTTPS** : certificat Let's Encrypt émis par Netlify une fois le DNS propagé, à contrôler dans Domain management > HTTPS. Les redirections de `*.netlify.app` vers le domaine principal sont à vérifier après la bascule.
- **Emails transactionnels** : service à choisir (Resend est cité dans la politique). Adresse expéditrice proposée : `commandes@nanahnhair.com` ou `ne-pas-repondre@…`, avec `Reply-To: Contact@nanahnhair.com` [à décider par la marque].
  - **SPF** : un seul TXT `v=spf1 include:<fournisseur boîte> include:<service d'envoi> ~all`, en fusionnant avec l'existant.
  - **DKIM** : les CNAME ou TXT fournis par le service.
  - **DMARC** : `_dmarc` TXT `v=DMARC1; p=none; rua=mailto:…`, à durcir en `quarantine` après 2 à 4 semaines.
  - Variables à créer : `RESEND_API_KEY` (ou équivalent) et l'adresse expéditrice.

### 3.4 Variables d'environnement de production (Netlify, contexte « Production »)

| Variable | Périmètre | Valeur / remarque | Constaté dans le code |
|---|---|---|---|
| `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET`, `ADMIN_TOTP_SECRET` | Functions | `npm run admin:setup`, valeurs propres à la production | `.env.example`, `lib/auth*.ts` |
| `SITE_URL` | Builds + Functions | `https://www.nanahnhair.com` (ou l'apex), sans `/` final | `lib/site-url.ts:4` |
| `NNH_INDEXABLE` | Builds + Functions | `1`, **production seulement** | `lib/site-url.ts:13` |
| Nom du magasin Blobs (à créer, 🔴5) | Functions | différent par contexte | `lib/store/index.ts:19` |
| `NNH_INSECURE_COOKIES` | — | **ne jamais définir** | `lib/auth.ts:40` |
| `NNH_DATA_DIR` | — | inutile sur Netlify | `lib/store/index.ts:20` |
| Stripe (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`), email | Functions | phase 6 | `.env.example` (commentés) |

### 3.5 Checklist jour J

**Avant (J-15 à J-1)**

| # | Action | Qui | Effort |
|---|---|---|---|
| 1 | Choisir et souscrire un médiateur ; relire et dater les textes juridiques ; valider les allégations (Miraculous, pack) | Marque | 1 à 2 sem. (délais externes) |
| 2 | Intégrer les textes, supprimer les mentions « projet », `npm run pdf:juridique` ; vérifier que `npm run verifier:mise-en-ligne` sort en 0 | Développeur | 1 h |
| 3 | Décider : ouverture en vitrine ou vente. Pour la vente : compte Stripe vérifié (marque), puis intégration Stripe, enregistrement des commandes, email de confirmation et CSP (développeur) | Marque + développeur | 3 à 5 j |
| 4 | Choisir le service d'email, l'adresse expéditrice, et poser SPF / DKIM / DMARC | Développeur + marque (accès DNS) | 2 h + propagation |
| 5 | Corriger le 🔴5 (magasin Blobs par contexte), ajouter les redirections 301 (🟠6), les pages 404/500 en français (🟠7), protéger `?detail=1` (🟠14), aligner la politique de confidentialité (🟠10) | Développeur | 1 j |
| 6 | Créer les variables de production (§3.4) | Développeur | 30 min |
| 7 | Inventaire DNS et MX actuels chez le registraire ; décider entre www et apex ; baisser le TTL à 300 s, 48 h avant | Marque (accès) + développeur | 1 h |
| 8 | Recette finale sur site-2 ; tester une commande de bout en bout en mode test Stripe et vérifier la réception de l'email (Gmail, Outlook, hors spam) | Marque + développeur | 2 h |
| 9 | Sauvegarder les Blobs ; purger les données de test (messages, preuves CGV de test, journal, tentatives) ; vérifier le catalogue (prix, stocks) | Développeur + marque | 1 h |
| 10 | Noter l'identifiant du dernier déploiement de production de l'ancien site (pour le retour arrière) ; poser le tag `ancien-site` sur `7dfa7d3` | Développeur | 10 min |

**Pendant (créneau creux, environ 1 h)**

| # | Action | Qui |
|---|---|---|
| 11 | Accord explicite de la marque, puis fusion de site-2 dans main en avance rapide | Développeur |
| 12 | Suivre le build de production : le garde-fou doit passer et le build réussir. En cas d'échec, l'ancien site reste en ligne : analyser, sans rien forcer | Développeur |
| 13 | Rattacher ou confirmer le domaine et `www`, définir le domaine principal, attendre le certificat HTTPS | Développeur (Netlify) + marque (registraire si DNS à changer) |
| 14 | Redéployer après le choix du domaine (sitemap pré-rendu avec la bonne adresse) | Développeur |
| 15 | Contrôles : `/api/sante` (`ok:true`, `backOfficeConfigure:true`), `/robots.txt` (Allow + sitemap), pas de `noindex` sur l'accueil, 301 des anciennes URL, page 404 en français, connexion au back-office avec TOTP, commande test (puis remboursement) | Développeur + marque |
| 16 | Si un problème bloquant apparaît : Deploys > ancien déploiement > « Publish deploy » (1 min) | Développeur |

**Après (J+1 à J+30)**

| # | Action | Qui | Effort |
|---|---|---|---|
| 17 | Google Search Console : valider le domaine, soumettre `sitemap.xml`, surveiller les 404 | Marque (compte) + développeur | 1 h |
| 18 | Moniteur externe sur `/api/sante`, avec alerte par email ou SMS à la marque | Développeur | 30 min |
| 19 | Désactiver ou isoler les déploiements de branche et les aperçus (s'ils ne sont pas isolés par 🔴5) ; adapter le workflow de vérification au domaine et le faire échouer réellement en cas d'ABSENT | Développeur | 1 h |
| 20 | Sauvegarde hebdomadaire des Blobs ; consulter quotidiennement `/admin/messages` et `/admin/journal` | Développeur / marque | récurrent |
| 21 | DMARC : passer de `p=none` à `quarantine` après lecture des rapports ; remonter le TTL DNS | Développeur | 15 min |
| 22 | Supprimer l'ancien site du dépôt (racine) quand le retour arrière n'est plus nécessaire (J+30) | Développeur | 30 min |

---

## Récapitulatif des points À VÉRIFIER (Netlify / registraire)

- **Netlify** :
  - base directory saisie dans l'interface, branche de production, `netlify.toml` réellement lu (journal de build) ;
  - variables existantes et leurs périmètres (`backOfficeConfigure:false` sur site-2) ;
  - déploiements de branche et aperçus actifs ;
  - domaines rattachés, certificat ;
  - offre et quotas (fonctions, Blobs) ; absence de sauvegarde automatique des Blobs ;
  - redirection automatique de `*.netlify.app` vers le domaine principal.
- **Registraire** : propriétaire et expiration de `nanahnhair.com`, serveurs DNS, MX et fournisseur de la boîte Contact@, SPF, DKIM et DMARC existants, pointage actuel du domaine (ancien site ?).
