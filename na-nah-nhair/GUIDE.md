# GUIDE.md — Lancer, tester et modifier le site

Le nouveau site est dans le dossier `na-nah-nhair/`. Le premier site (à la racine du dépôt) n'est pas touché.

## Lancer le site sur un ordinateur

1. Installer Node.js 20 ou plus récent.
2. Ouvrir un terminal dans le dossier `na-nah-nhair/`.
3. `npm install` (une seule fois).
4. `npm run dev`, puis ouvrir http://localhost:3000.

## Tester

- `npm test` : tests automatiques (contrastes, textes conformes à INFOS.md, quiz : les 243 combinaisons, prix, panier, stock, sécurité).
- `npm run build` puis `npm run test:e2e` : tests dans un navigateur (quiz, panier, commande, back-office, accessibilité, affichage en 375 px / tablette / ordinateur). Les captures d'écran sont enregistrées dans `captures/`.

## Modifier

| Je veux changer… | Fichier |
|---|---|
| un texte (produit, accueil, bandeau, pack, histoire, infos légales) | `content/site.ts` |
| une couleur | `lib/design-tokens.ts` **et** `app/globals.css` (mêmes valeurs ; un test vérifie qu'elles sont identiques) |
| une police | `app/layout.tsx` (polices de remplacement) et `app/globals.css` |

## Ajouter les photos

Le plus simple : depuis le back-office, **Produits et stocks** > Photo.

Ou dans le code : déposer la photo dans `assets/images/` (ex. `fabulous.jpg`), la copier dans `public/images/`, puis dans `content/site.ts` passer `available: false` à `available: true` pour cette photo.

## Back-office (`/admin`)

1. Choisir un mot de passe d'au moins 12 caractères, puis lancer :
   `npm run admin:setup -- "mon mot de passe"`
2. La commande affiche trois lignes `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET` et `ADMIN_TOTP_SECRET`.
   - En local : les copier dans un fichier `.env.local` (jamais envoyé sur GitHub).
   - En ligne : les ajouter dans Netlify > Site configuration > Environment variables.
3. Ajouter la clé `ADMIN_TOTP_SECRET` dans une application d'authentification (Google Authenticator, Authy…) : elle donne le code à 6 chiffres demandé à chaque connexion.
4. Se connecter sur `/admin/connexion`.

Le mot de passe n'est jamais enregistré, seule son empreinte (hash) l'est. Pour le changer, relancer `npm run admin:setup` et remplacer les variables.

Dans le back-office :

- **Produits et stocks** : prix, stock (vide = non suivi), disponibilité, photo de chaque produit. Le pack n'a pas de stock propre.
- **Livraison** : seuil de livraison offerte (0 = toujours offerte) et tarifs Colissimo / Mondial Relay.
- **Journal** : historique des modifications et des erreurs.

## Où sont les données ?

En attendant Supabase, les prix, stocks, réglages et photos envoyées sont enregistrés :

- en ligne : dans **Netlify Blobs** (inclus dans Netlify, rien à créer) ;
- en local : dans le dossier `.data/` (ignoré par Git).

## Publier sur Netlify (deuxième site)

À faire seulement après validation. Créer un **nouveau** site Netlify relié au même dépôt GitHub, avec « Base directory » = `na-nah-nhair`. Le premier site Netlify reste inchangé.
