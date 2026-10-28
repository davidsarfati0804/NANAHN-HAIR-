# Recette : pages publiques, rendu, navigation, accessibilité, SEO

Date : 28/10/2026. Serveur de production local : http://localhost:3200 (build `next start`, `NNH_INDEXABLE` absent, `SITE_URL` absent).
Outils : Playwright/Chromium 1194, axe-core 4.10 (depuis node_modules), règles WCAG 2.0/2.1 A/AA et bonnes pratiques.
Scripts et données brutes : `/tmp/claude-0/-home-user-nanahn-hair-/cbc784ff-bc8e-5b19-b2fe-76bd78d2564a/scratchpad/recette/agent-pages/` (crawl.js, crawl.json, parcours.js, overlap.js, imgs.js, todo.js). Captures : `.../agent-pages/shots/` (une capture pleine page par page et par largeur, nom `<chemin>-<largeur>.png`, plus des captures `x-*.png` pour les parcours).

**Constaté** = observé dans le navigateur ou le code. **Supposé** = déduit du code, non vérifiable ici (site en ligne inaccessible, Netlify absent).

Pages testées (24) à 320, 375, 390, 768 et 1280 px (120 rendus) : `/`, `/soins`, `/soins/fabulous`, `/soins/miraculous`, `/soins/luxurious`, `/pack`, `/boutique`, `/quiz`, `/quiz/resultat/{fabulous,miraculous,luxurious}`, `/mon-histoire`, `/faq`, `/contact`, `/mentions-legales`, `/cgv`, `/retractation`, `/confidentialite`, `/cookies`, `/panier`, `/commande`, `/guide-de-style`, `/guide-de-style/story/fabulous`, une URL inexistante (404). Back-office `/admin` hors périmètre.

---

## Ce qui fonctionne (constaté)

- **Aucun débordement horizontal** (scrollWidth = clientWidth) sur les 120 rendus.
- **Aucune erreur JavaScript ni erreur console** sur toutes les pages. Les seuls « échecs réseau » relevés sont des préchargements RSC interrompus à la fermeture de l'onglet (sans effet pour l'utilisatrice).
- **Tous les liens internes répondent 200** (17 pages, 3 images story, 2 PDF). Toutes les ancres (`#trio`, sommaire CGV `#1-objet…` à `#15-…`, FAQ `#livraison`, etc.) pointent vers un id existant ; l'ancre FAQ n'est pas masquée par l'en-tête collant.
- **Aucune image cassée** : les images « 0 px » détectées au premier passage étaient des images en chargement différé ; avec un défilement lent, toutes se chargent. Images WebP responsives correctes (≥ 2x) partout sauf un cas (voir 🟢).
- **lang="fr"**, un seul **h1** par page (sauf le modèle story caché), toutes les images ont un `alt` (vide pour les décoratives), lien d'évitement « Aller au contenu » fonctionnel, **focus visible** (outline) sur tous les éléments parcourus au clavier, ordre de tabulation globalement logique.
- **Menu mobile** : ouverture, focus sur le 1er lien, `aria-expanded` correct, Échap ferme, la navigation referme le menu.
- **Quiz** : les 3 résultats sont atteignables par l'interface, bouton Retour fonctionnel (réponse précédente conservée), navigation clavier (flèches + Espace) et focus sur la question suivante, bouton story (« Télécharger l'image » sans Web Share ; PNG servi). Captures : `shots/x-quiz-resultat-*-390.png`.
- **Sélecteur « Quel soin est le tien ? »** : 3 cartes, `aria-pressed`, panneau `aria-live` avec prix et lien correct, re-clic désélectionne.
- **Carrousels** (« Les trois soins », « Mon histoire ») : points de navigation fonctionnels, la page ne défile pas horizontalement, liste focusable au clavier.
- **FAQ** : 13 accordéons `<details>` ouvrables à la souris et au clavier.
- **Formulaire de contact** : validation serveur (email, longueur du message), valeurs conservées en cas d'erreur, message de succès annoncé (`role=status`), formulaire vidé après envoi, anti-robot (champ piège + délai 3 s), limitation 5 messages/heure/IP. Le message est bien enregistré (vérifié dans le stockage local de test `recette/data/contact-messages`).
- **Bandeau cookies** : s'affiche sans choix, boutons Refuser/Accepter, choix mémorisé, « Gérer mes cookies » (page /cookies et pied de page) le fait réapparaître. Capture : `shots/x-bandeau-cookies-375.png`.
- **SEO technique en mode test** : `robots.txt` = `Disallow: /`, meta `noindex, nofollow` sur toutes les pages, en-tête `X-Robots-Tag` sur `/guide-de-style` et `/admin`. `/guide-de-style` n'est lié nulle part et absent du sitemap. Titres uniques sur toutes les pages publiques ; canonical présents sur les pages indexables (sauf accueil, voir 🟢). Données structurées **Product** présentes sur les 3 fiches et le pack (prix 19,90 / 39,90 / 29,90 / 69,90 €, `InStock`, devise EUR), **Organization** sur l'accueil. Open Graph avec image 1200×1500 existante sur les fiches et le pack.
- **Sécurité/en-têtes** : CSP stricte, HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy.
- **Performance** (local, indicatif) : 270 à 620 Ko transférés par page (préchargements des pages liées compris), chargement complet 0,7 à 2 s. HTML de l'accueil compressé : 49 Ko (188 Ko brut). Plus gros fichiers : chunk JS 70 Ko, police woff2 35 Ko (2 polices préchargées), photos détourées WebP 28 à 50 Ko. Rien d'alarmant.

---

## Ce qui ne fonctionne pas

### 🔴 Bloquant

1. **Images story du quiz : « À COMPLÉTER : adresse du site » imprimé dans l'image partagée** (constaté). Les trois fichiers `public/story/{fabulous,miraculous,luxurious}.png` (servis par le bouton « Télécharger l'image » / « Partager en story » de chaque page résultat) contiennent en clair « Fais le quiz sur À COMPLÉTER : adresse du site ». Toute cliente qui partage son résultat sur Instagram publiera ce texte.
   - Source : `content/site.ts:722` (`quiz.story.siteTodo`), rendu par `app/guide-de-style/story/[result]/page.tsx:48`, images générées par `scripts/generer-stories.mjs`.
   - Preuve : `public/story/fabulous.png` ; `shots/_guide-de-style_story_fabulous-1280.png`.
   - Le garde-fou `scripts/verifier-mise-en-ligne.mjs` **ne contrôle pas** ces images ni `quiz.story` : le build de production passera quand même.

2. **Fiches produit : bloc « À COMPLÉTER : FAQ Fabulous / Miraculous / Luxurious (questions et réponses) » visible** sur `/soins/fabulous`, `/soins/miraculous`, `/soins/luxurious` (toutes largeurs ; constaté).
   - Source : `app/soins/[slug]/page.tsx:154` (`<ToComplete label={`FAQ ${p.shortName} …`} />`).
   - Le garde-fou de mise en ligne ne scanne que `content/juridique/*.md`, `lib/emails/*.ts` et le bloc `footer` de `content/site.ts` : **ce texte ne bloquera pas le build de production** (constaté en lisant le script).
   - Preuve : `shots/_soins_miraculous-320.png` (section « Questions fréquentes »).

3. **Pages légales incomplètes** (constaté, mais ici le garde-fou de production les bloque bien) :
   - `/mentions-legales` et `/cgv` (article 14) : « À COMPLÉTER : nom, adresse postale et site internet du médiateur ».
   - `/cgv`, `/confidentialite`, `/cookies` : « À COMPLÉTER : date » (date de mise à jour).
   - Le PDF téléchargeable `public/documents/cgv-v1.pdf` contient les deux mêmes mentions (lignes 4 et 158 du texte extrait) : il faudra le régénérer (`npm run pdf:juridique`) après avoir complété. Le garde-fou ne vérifie pas les PDF.
   - Source : `content/juridique/*.md`. Médiateur de la consommation = obligation légale pour la vente aux particuliers.

### 🟠 Important

4. **Bouton principal de l'accueil coupé sur ordinateur** : « JE DÉCOUVRE MON Na Nah N'hair » s'affiche « JE DÉCOUVRE MON Na Nah » (le nom de la marque déborde du bouton, en blanc sur fond blanc) **de 1024 px à 1920 px** ; correct jusqu'à 1023 px (constaté : contenu 280 px dans un bouton de 208 à 229 px).
   - Source : `app/page.tsx:81` (`ButtonLink … sm:whitespace-nowrap` + `<BrandText>`) ; le SVG du nom (`components/BrandName.tsx`, `max-width:100%`) n'est pas pris en compte dans la largeur du bouton à partir du breakpoint `lg`.
   - Preuve : `shots/x-hero-1280.png`, `shots/_-1280.png`.

5. **Page 404 en anglais et sans habillage** : « 404 | This page could not be found. » (page Next.js par défaut), aucun lien de retour dans le contenu, titre identique à celui de l'accueil. Aucun fichier `app/not-found.tsx` (constaté). Preuve : `shots/crop_page-inexistante-xyz-375.png`. Texte à fournir par la marque.

6. **Menu mobile : le focus est perdu après Échap** (retombe sur `<body>` au lieu du bouton « Menu ») ; un utilisateur clavier/lecteur d'écran repart du haut de la page (constaté). `components/SiteHeader.tsx:16-21`.

7. **Formulaire de contact : message trompeur si l'envoi est fait en moins de 3 s** après l'affichage (ex. remplissage automatique du navigateur, ou clic sur Envoyer sur un formulaire vide) : « Message refusé. Réessaie dans quelques instants. » au lieu des erreurs de champs (constaté). Le contrôle anti-robot passe avant la validation : `app/contact/actions.ts:17-19`. Preuve : `shots/x-contact-vide-375.png`.

8. **Que devient un message de contact ?** Il est seulement enregistré (Netlify Blobs en ligne) et consultable dans le back-office `/admin/messages` ; **aucune notification email** n'est envoyée à la marque (constaté dans `app/contact/actions.ts`, `lib/emails/` ne contient que la confirmation de commande). Risque : messages non lus si personne ne consulte le back-office. À confirmer avec la marque que c'est voulu.

9. **Partage réseaux sociaux de l'accueil et des pages hors fiches sans image** : pas de `og:image` sur `/`, `/soins`, `/boutique`, `/quiz`, `/quiz/resultat/*`, `/mon-histoire`, `/faq`… (`twitter:card` = `summary`). Un lien du site collé dans WhatsApp/Instagram/Facebook n'aura pas de visuel. Source : `app/layout.tsx:27` (`openGraph` sans `images`), pas de `app/opengraph-image.*`.

10. **Accessibilité (axe, sérieux)** :
    - `label-content-name-mismatch` sur toutes les pages : le lien Instagram affiche « @na.nah.nhair » mais son `aria-label` (« Instagram de Na Nah N'hair (s'ouvre… ») ne contient pas ce texte visible (gêne la commande vocale). `components/SiteFooter.tsx:41`, `app/contact/page.tsx:42`.
    - `scrollable-region-focusable` sur `/confidentialite` et `/cookies` à 375 px : les tableaux défilants ne sont pas atteignables au clavier. `components/legal/LegalMarkdown.tsx:155` (ajouter `tabIndex={0}` + nom accessible).
    - (Le contraste insuffisant 4,06:1 n'existe que sur `/guide-de-style`, page cachée.)

### 🟢 Confort

11. **Résultat Miraculous redondant** : la page `/quiz/resultat/miraculous` affiche « Découvre aussi Miraculous, mon produit fondateur / Voir Miraculous » juste sous « Je suis Miraculous » (constaté). `app/quiz/resultat/[result]/page.tsx:46-51`. À arbitrer par la marque (texte non modifié).
12. **Répartition des résultats du quiz (information, choix de la marque)** : sur les 243 combinaisons de réponses, Miraculous sort 137 fois (56 %), Luxurious 62 (26 %), Fabulous 44 (18 %) — dû aux 2 points sur les questions 4 et 5 et aux règles d'égalité (Fabulous ne gagne jamais une égalité). Ce n'est pas un bug ; à confirmer que c'est voulu.
13. **Photo du pack un peu floue sur tablette** : `/boutique` à 768 px, `pack-400.webp` (400 px) affiché en 324 px sur écran 2x (besoin 648 px) ; `/soins` à 768 px idem (253 px affichés). L'attribut `sizes="(max-width: 640px) 50vw, 25vw"` ne correspond pas à la mise en page réelle entre 641 et 1023 px. `app/boutique/page.tsx:35,49`, `app/soins/page.tsx:41`.
14. **Méta descriptions dupliquées** : `/`, `/soins`, `/quiz/resultat/*`, `/panier`, `/commande`, 404 et pages cachées reprennent toutes « Trois soins. Trois personnalités… ». Seule `/soins` compte pour le SEO (les autres sont noindex) : `app/soins/page.tsx` sans `description` propre.
15. **Pas de canonical sur l'accueil** (les autres pages publiques en ont un). `app/page.tsx` (metadata).
16. **Icônes** : seulement `app/icon.svg`. `/favicon.ico` et `/apple-touch-icon.png` répondent 404 (constaté) : pas d'icône sur l'écran d'accueil iPhone ni pour certains outils qui cherchent `/favicon.ico`. Ajouter `app/apple-icon.png` (180×180) et `app/favicon.ico`.
17. **Données structurées Product sans `image`** (constaté sur les 4 produits : `p.shop.photoUrl` absent dans le JSON-LD) ni `sku` : Google signale l'image comme recommandée pour les fiches marchandes. `lib/structured-data.ts:13`.
18. **Barre d'achat collante à 320 px** : le nom est tronqué « Miracul… » (`components/product/StickyBuyBar.tsx`), acceptable mais à vérifier visuellement. Preuve : `shots/_soins_miraculous-320.png`.
19. **Ordre de tabulation de l'accueil (≥ 1024 px)** : les deux boutons du hero sont atteints avant les trois flacons, placés au-dessus visuellement (mineur).
20. **Email affiché avec une majuscule** « Contact@nanahnhair.com » (pied de page, contact, JSON-LD) : incohérence typographique à signaler à la marque (fonctionne quand même).
21. **Région hors repère (axe, modéré)** : le bandeau d'annonce jaune (`components/AnnouncementBar.tsx`) est hors de `<header>`/`<main>`.
22. **`/guide-de-style` accessible publiquement** (noindex, non lié) et affiche « 4 choix en attente de ta réponse » + un « À COMPLÉTER » : contenu interne visible par qui connaît l'URL. À supprimer ou protéger à l'ouverture si souhaité.

---

## À mettre en place avant l'ouverture

1. **Indexation** (Netlify, contexte *Production uniquement*) :
   - `SITE_URL=https://<domaine définitif>` (aujourd'hui « À COMPLÉTER » ; sans lui, canonical, `og:image`, sitemap et JSON-LD utilisent l'URL Netlify ; en local ils affichent `http://localhost:3000`).
   - `NNH_INDEXABLE=1` **uniquement dans le contexte production** (pas « All deploy contexts »), sinon les deploy previews deviennent indexables (`lib/site-url.ts:13`).
   - Effet attendu : `robots.txt` passe à `Allow: /` avec `Disallow: /admin /api /panier /commande /quiz/resultat` + lien sitemap ; les meta `noindex` disparaissent sauf panier/commande/résultats quiz/guide de style.
   - Le sitemap (`app/sitemap.ts`) est **pré-généré au build** : redéployer après avoir défini `SITE_URL`. Puis vérifier `https://<domaine>/robots.txt`, `/sitemap.xml` et déclarer le sitemap dans Google Search Console.
2. **Compléter et retirer tous les « À COMPLÉTER »** : médiateur (mentions légales + CGV), dates (CGV, confidentialité, cookies), FAQ des 3 fiches produit, adresse du site dans les stories puis **régénérer** `public/story/*.png` (`scripts/generer-stories.mjs`) et `public/documents/cgv-v1.pdf` (`npm run pdf:juridique`).
3. **Élargir le garde-fou** `scripts/verifier-mise-en-ligne.mjs` (ou faire une vérification manuelle) : aujourd'hui il ignore `app/**`, `components/**`, le reste de `content/site.ts`, les images story et les PDF — il laisserait passer les points 🔴 1 et 2.
4. Corriger le bouton coupé de l'accueil (🟠 4) et créer une page 404 en français (🟠 5).
5. Ajouter une image de partage par défaut (`og:image` globale) et les icônes `favicon.ico` / `apple-icon.png`.
6. Décider du circuit des messages de contact (notification email ou consultation régulière du back-office).
7. Après mise en ligne, contrôles à faire sur le vrai domaine (non vérifiables ici) : HTTPS + HSTS, compression Brotli/gzip servie par Netlify, temps de chargement réel sur mobile 4G (PageSpeed Insights), aperçu de partage (Facebook Sharing Debugger), test des résultats enrichis Google (Rich Results Test) sur une fiche produit, partage story réel sur iPhone/Android (Web Share API non testable en Chromium headless).
