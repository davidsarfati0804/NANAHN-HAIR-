# Rapport — Phase 3 : pages vitrine

## Livré

| Page | Adresse | Contenu |
|---|---|---|
| Les trois soins | `/soins` | trois cartes (photo, personnalité, univers, phrase, prix, lien vers la fiche), encart pack, bouton vers le quiz |
| Fiche Fabulous | `/soins/fabulous` | voir ci-dessous |
| Fiche Miraculous | `/soins/miraculous` | idem + badge « Mon produit fondateur » |
| Fiche Luxurious | `/soins/luxurious` | voir ci-dessous |
| Pack des 3 soins | `/pack` | photo (À COMPLÉTER), 69,90 €, contenu du pack, mode d'emploi du pack, « Ajouter au panier » |
| Mon histoire | `/mon-histoire` | texte de BRIEF §3 mot pour mot, mis en page en éditorial, encart Miraculous produit fondateur |
| FAQ | `/faq` | 6 rubriques : utilisation, composition, précautions, livraison, retours, commandes |

**Chaque fiche produit** (BRIEF §4) contient :

- grande photo (emplacement À COMPLÉTER) ;
- nom, prix, phrase, personnalité, univers, odeur, contenance ;
- points clés en encadrés couleur ;
- « Ajouter au panier » : présent mais désactivé jusqu'à la phase 5 ;
- description complète dans un encadré Lavender, titres en gras ;
- INCI exacte, avec les notes * et ** ;
- mode d'emploi, précautions d'emploi et FAQ du produit : À COMPLÉTER ;
- « Découvre aussi » : les deux autres soins et le pack.

**FAQ** : seules les réponses présentes dans INFOS.md sont affichées, avec la formulation d'INFOS. Le reste est À COMPLÉTER (mode d'emploi, précautions, préparation incluse dans le délai, frais de retour, procédure produit défectueux).

**Correction** : les titres en Montserrat gras (« Description », « Points clés »…) s'affichaient en Bebas. Corrigé.

## Tests

| Test | Résultat |
|---|---|
| Tests automatiques (contrastes, textes = INFOS.md, FAQ = INFOS.md, histoire = BRIEF.md mot pour mot) | ✅ 32/32 |
| 7 nouvelles pages sans défilement horizontal en 375, 768 et 1280 px | ✅ 7/7 |
| Aucun lien interne cassé sur ces pages | ✅ |
| Fiche Miraculous : prix, badge, odeur, INCI exacte, À COMPLÉTER, bouton panier désactivé | ✅ |
| Prix sur les fiches : 19,90 € / 39,90 € / 29,90 €, pack 69,90 € | ✅ |
| FAQ : ouverture des questions, réponses et À COMPLÉTER | ✅ |
| Accueil (tests de la phase 2) | ✅ 8/8 |
| TypeScript, ESLint, build | ✅ |

## À valider par vous

1. Mise en page des fiches produits, du pack, de « Mon histoire » et de la FAQ (captures dans `captures/`).
2. Les intitulés des questions de la FAQ (les réponses viennent d'INFOS ; les questions sont une proposition de formulation).
3. Sur « Mon histoire », la première phrase sert de grand titre et la dernière est mise en avant dans un encadré violet. Le texte n'est pas modifié.
