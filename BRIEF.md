# BRIEF.md — NA NAH N'HAIR

Cahier des charges du site. En cas de contradiction avec `INFOS.md`, **INFOS.md prime**.

---

## 0. Rôle et règles de travail

Tu agis comme directeur artistique cosmétique, expert UX/UI, développeur full-stack et spécialiste e-commerce. Tu construis un vrai site de vente en ligne sur mesure, aussi fonctionnel qu'une boutique Shopify : pas une maquette.

### Méthode obligatoire

- Commence par un plan écrit (architecture, arborescence, modèle de données, liste des tâches). Attends ma validation.
- Travaille phase par phase (section 9). À la fin de chaque phase : tests, rapport, puis attends ma validation avant de continuer.
- Ne devine jamais une information manquante : crée un emplacement clairement identifiable (À COMPLÉTER : …) et liste-le dans `TODO-A-COMPLETER.md`.
- Explique-moi en français simple comment lancer, tester, modifier et publier le site.
- Ne simule jamais de vrais paiements. Tout reste en mode test tant que je n'ai pas validé la mise en production.

### Interdits

- Inventer ingrédients, résultats, certifications, avis clients ou bénéfices non confirmés.
- Promettre un résultat garanti ou présenter les produits comme des traitements médicaux (pas de promesse de pousse des cheveux).
- Créer de faux visuels de mes flacons : prévoir des emplacements pour mes vraies photos.
- Installer du suivi publicitaire ou des cookies non essentiels sans consentement.
- Écrire une clé secrète dans le code (variables d'environnement uniquement).

---

## 1. Identité de la marque

- **Nom** : NA NAH N'HAIR
- **Signature officielle** : « Révèle ton Na Nah N'Hair. »
- **Concept marketing** : « Quel Na Nah N'Hair es-tu ? »
- **Ton** : féminin, dynamique, créatif, accessible, sensoriel, audacieux. Pas froid, pas médical, pas « comme toutes les autres huiles capillaires ».
- **Réaction visée** : « Waouh, c'est quoi cette marque ? »

---

## 2. Le concept des trois femmes

Chaque femme a plusieurs facettes. Les trois soins sont trois personnalités d'une même famille, jamais des catégories exclusives.

| Soin | Prix | Personnalité | Univers | Sa phrase |
|---|---|---|---|---|
| FABULOUS | 19,90 € | Fraîche, naturelle, spontanée | Vert, frais, positif, pétillant | « Simplement moi, simplement Fabulous. » |
| MIRACULOUS | 39,90 € | Déterminée, ambitieuse, audacieuse. Produit fondateur | Violet, confiance, force, transformation | « Je crois en mon objectif. » |
| LUXURIOUS | 29,90 € | Féminine, élégante, sensorielle | Rose, beauté, plaisir, douceur | « Parce que je mérite ce petit luxe. » |

**Pack des trois soins** : 69,90 €.

**Concept émotionnel central** : « Je ne suis pas qu'une seule femme. Je suis Fabulous. Je suis Miraculous. Je suis Luxurious. Je suis les trois. »

---

## 3. Mon histoire

À raconter de façon authentique, émotionnelle et professionnelle.

> Je suis naturopathe et diplômée en aromathérapie. En première année de naturopathie, lors d'un stage en clinique, j'accompagnais une femme qui souhaitait prendre soin de ses cheveux et favoriser leur longueur. J'ai relevé le défi en préparant une synergie personnalisée pour elle. Cette expérience m'a donné envie d'aider d'autres personnes et de créer mes propres soins capillaires. J'ai commencé mes préparations dans ma chambre, sur mon bureau. J'aime aider les autres, me rendre utile et savoir qu'une petite action de ma part peut apporter de la satisfaction à quelqu'un. C'est ainsi qu'est née l'idée de NA NAH N'HAIR : trois soins, trois univers, une même envie de permettre aux femmes de prendre soin de leurs cheveux tout en révélant différentes facettes de leur personnalité.

Aucune promesse de résultat garanti.

---

## 4. Produits

Trois soins capillaires en flacons de 30 ml, plus le pack. Chaque fiche produit contient :

- grande photo du flacon (emplacement pour ma vraie photo) ;
- nom, prix, univers et personnalité ;
- bénéfices cosmétiques vérifiés (À COMPLÉTER) ;
- parfum (À COMPLÉTER tant que non confirmé) ;
- composition INCI (À COMPLÉTER) ;
- mode d'utilisation (À COMPLÉTER) ;
- précautions d'emploi pertinentes (À COMPLÉTER, relues par moi) ;
- bouton « Ajouter au panier » ;
- FAQ du produit.

---

## 5. Direction artistique

- **Style** : POP LUXURY + FASHION GIRL : très visuel, féminin, contemporain, audacieux sans être surchargé, élégant mais accessible, adapté à Instagram, reconnaissable dès la première visite.
- **Couleurs** : vert (Fabulous), violet (Miraculous), rose (Luxurious) + une neutre commune (crème / blanc cassé, ou touche de jaune). Définis-les en variables de design (tokens) dans un seul fichier.
- **Typographie** : titres forts + texte élégant et très lisible. Mes polices de flacons seront fournies dans `/assets/fonts/` ; en attendant, mets des polices de remplacement et signale-le.
- **Inspirations** : compositions éditoriales, gros titres, portraits de femmes, beaux éclairages, gros plans flacons, effets graphiques subtils.
- Les trois produits sont les vedettes du site.
- **Photos** : emplacements prévus dans `/assets/images/` avec textes alternatifs.

---

## 6. Pages à créer

### Accueil

- Hero : NA NAH N'HAIR, « Révèle ton Na Nah N'Hair. », « Trois soins. Trois personnalités. Une seule question : lequel est le tien ? »
- Bouton principal : « Je découvre mon Na Nah N'Hair » (vers le quiz). Bouton secondaire : « Découvrir les trois soins ».
- Les trois flacons côte à côte avec leurs couleurs et personnalités.
- Section « Je ne suis pas qu'une seule femme. Je suis les trois. »
- Produits, pack, histoire, raisons de découvrir la marque.
- Appel à l'action final vers la boutique.

### Quiz « Quel Na Nah N'Hair es-tu ? »

- 5 questions courtes (rituel idéal, ce qu'elle aime dans un soin, expérience recherchée, priorités capillaires).
- Système de points vers Fabulous / Luxurious / Miraculous, réellement fonctionnel.
- Résultat personnalisé avec présentation du produit correspondant.
- Égalité : proposer le pack (ou les deux soins à égalité).
- Message final : « Et si tu étais les trois ? Découvre toute la collection. »

### Les trois soins

Mise en page esthétique, prix, liens vers les fiches.

### Boutique

Trois soins + pack à 69,90 €, panier et commande réels (voir section 7).

### Mon histoire

Page éditoriale, émotionnelle, beaux espaces, texte de la section 3.

### FAQ

Utilisation, composition, précautions, livraison, retours, commandes. Livraison et retours : À COMPLÉTER, ne rien inventer.

### Contact

Formulaire fonctionnel, validation, message de confirmation, liens Instagram.

### Pages juridiques

À créer, contenu À COMPLÉTER / à faire relire : mentions légales, CGV, politique de confidentialité, politique cookies, retours et droit de rétractation.

---

## 7. Stack technique et fonctionnalités e-commerce

### Stack imposée

- Next.js + TypeScript + Tailwind CSS
- Base de données PostgreSQL (Supabase) pour produits, stocks, commandes, codes promo
- Stripe Checkout (carte, Apple Pay, Google Pay), mode test
- Resend pour les emails transactionnels
- Hébergement Vercel, nom de domaine À COMPLÉTER
- Site en français uniquement, prix TTC en euros

### Fonctionnalités niveau boutique professionnelle

- Panier persistant (ajout, retrait, quantités, total correct, pack à 69,90 €).
- Paiement sécurisé via Stripe ; une commande n'est validée que lorsque le webhook Stripe confirme le paiement côté serveur.
- Stock décrémenté automatiquement ; produit « épuisé » géré.
- Back-office admin protégé (authentification forte, mots de passe hashés) : produits, prix, photos, stocks, commandes, codes promo.
- Commandes : statuts (payée, préparée, expédiée, livrée), numéro de suivi, export.
- Emails automatiques : confirmation de commande, expédition, accusé du formulaire de contact.
- Livraison : zones et tarifs configurables, seuil de livraison offerte (À COMPLÉTER).
- Codes promo.
- Factures PDF avec mentions obligatoires et TVA (À COMPLÉTER : statut fiscal, numéro).
- Sauvegardes de la base et journal des erreurs.

### Sécurité et conformité

- HTTPS, validation côté serveur de tous les formulaires, anti-spam sur le contact, protection contre les failles courantes (injection, XSS, CSRF), limitation de débit.
- Les prix sont toujours recalculés côté serveur (jamais pris du navigateur).
- RGPD : bandeau de consentement, aucun cookie non essentiel avant accord, droit d'accès et de suppression des données.
- Réglementation cosmétique : pas d'allégation médicale, INCI affichée, précautions d'emploi.
- Instagram : liens, partage et préparation à l'intégration (sans suivi sans consentement).

### Qualité

- Pensé mobile d'abord, parfaitement responsive, chargement rapide (images optimisées, chargement différé).
- SEO : balises title/description, sitemap, robots, données structurées produit, URL propres.
- Accessibilité : textes alternatifs, contrastes suffisants, navigation clavier.

---

## 8. Phase de test (obligatoire à chaque phase)

- Tests automatisés : calcul des prix et du pack, panier, logique du quiz (les 3 résultats atteignables + égalité), validation du formulaire.
- Parcours complet de commande avec les cartes de test Stripe : paiement réussi, refusé, abandonné ; vérifier le webhook, l'email, la baisse de stock et la création de la commande.
- Back-office : un visiteur non connecté ne doit jamais y accéder ; tester chaque action admin.
- Formulaire de contact : champs vides, email invalide, spam, message de confirmation.
- Responsive : 375 px, tablette, ordinateur.
- Accessibilité et performance : Lighthouse supérieur à 90 (performance, accessibilité, SEO, bonnes pratiques).
- Sécurité : aucune clé secrète dans le dépôt, routes protégées, pas de modification de prix côté client.
- Rapport : tests réussis, tests échoués, points à corriger, À COMPLÉTER restants.

---

## 9. Phases de livraison (validation après chacune)

1. **Plan** : architecture, modèle de données, arborescence, liste des À COMPLÉTER.
2. **Design system** : couleurs, typographies, composants, accueil (version visuelle).
3. **Pages vitrine** : trois soins, fiches produits, histoire, FAQ.
4. **Quiz** fonctionnel et testé.
5. **Boutique** : produits en base, panier, back-office produits et stocks.
6. **Paiement et commandes** : Stripe en mode test, webhooks, emails, statuts, factures.
7. **Contact, pages juridiques, RGPD, SEO.**
8. **Recette finale** : tous les tests de la section 8 et correctifs.
9. **Mise en ligne** : guide pas à pas (domaine, variables d'environnement, passage de Stripe en production), uniquement après ma validation.

---

## 10. Ce que je te fournirai

- Photos des flacons, logo, polices (`/assets/`).
- INCI, parfums, bénéfices vérifiés, mode d'emploi, précautions.
- Politique de livraison et de retours, informations légales de l'entreprise.
- Comptes Stripe, Supabase, Resend, Vercel (je te guiderai pour les créer si besoin : indique-moi les étapes).

---

## 11. Définition du « terminé »

- Toutes les pages existent et sont responsives.
- Quiz, panier, commande de test, back-office et formulaire fonctionnent.
- Tous les tests de la section 8 sont passés et le rapport est livré.
- Aucun contenu inventé ; tous les À COMPLÉTER sont listés dans `TODO-A-COMPLETER.md`.
- Aucune clé secrète dans le code ; consentement cookies en place.
- Un guide en français explique comment lancer, tester, modifier et publier le site.
- La mise en production n'est faite qu'avec mon accord explicite.
