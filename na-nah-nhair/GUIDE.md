# GUIDE.md — Lancer, tester et modifier le site

Le nouveau site est dans le dossier `na-nah-nhair/`. Le premier site (à la racine du dépôt) n'est pas touché.

## Lancer le site sur un ordinateur

1. Installer Node.js 20 ou plus récent.
2. Ouvrir un terminal dans le dossier `na-nah-nhair/`.
3. `npm install` (une seule fois).
4. `npm run dev`, puis ouvrir http://localhost:3000.

## Tester

- `npm test` : tests automatiques (contrastes des couleurs, textes conformes à INFOS.md).
- `npm run build` puis `npm run test:e2e` : tests dans un navigateur (affichage en 375 px, tablette et ordinateur, liens, menu). Les captures d'écran sont enregistrées dans `captures/`.

## Modifier

| Je veux changer… | Fichier |
|---|---|
| un texte (produit, accueil, bandeau, pack, histoire, infos légales) | `content/site.ts` |
| une couleur | `lib/design-tokens.ts` **et** `app/globals.css` (mêmes valeurs ; un test vérifie qu'elles sont identiques) |
| une police | `app/layout.tsx` (polices de remplacement) et `app/globals.css` |

## Ajouter les photos

1. Déposer la photo dans `assets/images/` (ex. `fabulous.jpg`) et la copier dans `public/images/`.
2. Dans `content/site.ts`, passer `available: false` à `available: true` pour cette photo.

## Publier sur Netlify (deuxième site)

À faire seulement après validation. Créer un **nouveau** site Netlify relié au même dépôt GitHub, avec « Base directory » = `na-nah-nhair`. Le premier site Netlify reste inchangé.
