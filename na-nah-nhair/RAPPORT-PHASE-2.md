# Rapport — Phase 2 : design system et accueil

## Livré

- **Tokens de design** dans un seul fichier (`lib/design-tokens.ts`, repris dans `app/globals.css`) : couleurs du premier site, plus les nouvelles couleurs produits.
  - Fabulous : vert `#8FD3AE` (texte `#1D5A3C`)
  - Miraculous : violet `#C7B2EC` (texte `#35205F`)
  - Luxurious : rose `#F5A9C6` (texte `#8A2453`)
  - Fond blanc, encadrés Lavender `#AAA1C8` avec texte foncé
- **Typographie** du premier site : Bebas Neue (titres, en attendant Bebas Kai / les polices des flacons) et Montserrat (texte), chargées par Next.js (sans requête vers Google côté visiteur).
- **Composants** : bandeau d'annonce, en-tête avec menu mobile, pied de page (coordonnées, liens légaux, Instagram À COMPLÉTER), boutons, encadré Lavender, emplacement photo, étiquette « À COMPLÉTER ».
- **Accueil complet** (BRIEF §6) : hero, trois soins côte à côte, « Je ne suis pas qu'une seule femme. », les trois soins (points clés, odeur, contenance), pack, extrait de mon histoire, raisons de découvrir la marque, appel final vers la boutique.
- **Contenu** : tous les textes dans `content/site.ts`, repris d'INFOS.md mot pour mot (INCI comprises).
- Les autres pages existent déjà sous forme « Cette page arrive bientôt » pour que les liens ne cassent pas.

## Tests

| Test | Résultat |
|---|---|
| Contrastes WCAG AA des 18 paires texte/fond utilisées | ✅ 18/18 |
| Blanc sur Lavender bien exclu | ✅ |
| Couleurs CSS identiques aux tokens | ✅ |
| Produits, pack, bandeau, accueil, concept, infos légales identiques à INFOS.md (INCI exactes) | ✅ 9/9 |
| Accueil sans défilement horizontal en 375 px, 768 px et 1280 px | ✅ 3/3 |
| Bandeau → quiz, boutons du hero | ✅ |
| Aucun lien interne cassé depuis l'accueil | ✅ |
| 4 photos signalées « À COMPLÉTER », aucune image inventée | ✅ |
| Menu mobile au clavier | ✅ |
| TypeScript, ESLint, build de production | ✅ |

Pas encore mesuré : Lighthouse (prévu en recette, phase 8).

## À valider par vous

1. Les teintes vert, violet et rose des trois soins.
2. La mise en page de l'accueil (captures dans `captures/` après `npm run test:e2e`).
3. Le titre de marque est écrit en police Bebas en attendant le vrai logo (`assets/logo/`).
4. L'icône d'onglet du navigateur (rond violet et Lavender) est provisoire, en attendant le logo.

## À COMPLÉTER restants

Voir `TODO-A-COMPLETER.md`.
