# DEMARRAGE.md — Consignes de lancement du projet

Message de la propriétaire de la marque, à garder comme référence pour toute la durée du projet.

## Fichiers du projet

1. `BRIEF.md` : le cahier des charges complet (design, pages, fonctionnalités e-commerce, tests, phases de validation).
2. `INFOS.md` : toutes les infos de la marque (produits, prix, parfums, INCI, textes, quiz, livraison, retours, infos légales).
3. Photos des flacons, logo et polices : lien Drive `À COMPLÉTER`.

**IMPORTANT : en cas de contradiction entre les deux fichiers, INFOS.md prime sur BRIEF.md.**

## Organisation des fichiers

- `BRIEF.md` et `INFOS.md` à la racine du projet.
- Fichiers de la marque dans `assets/images/`, `assets/fonts/` et `assets/logo/`.
- Photos nommées `fabulous.jpg`, `miraculous.jpg`, `luxurious.jpg` et `pack.jpg` (les photos du pack arriveront plus tard).

## Premier message à Claude Code

> Lis BRIEF.md, INFOS.md et le dossier assets/. En cas de contradiction, INFOS.md prime. Ne code rien encore : fais-moi un plan écrit (architecture, modèle de données, étapes) et liste ce qui manque ou te paraît ambigu. Attends ma validation.

## Trois règles importantes

1. Chaque phase du brief doit être montrée pour validation avant de passer à la suivante.
2. Stripe reste en mode test jusqu'à la recette finale. Jamais de clé secrète dans le code ni dans le chat (fichier `.env` uniquement).
3. Ce qui est marqué « À COMPLÉTER » (mode d'emploi, tarifs de livraison, statut de l'entreprise, TVA, hébergeur, Instagram) arrive plus tard : c'est normal, laisser un emplacement visible.

## Décision pour la refonte (octobre 2026)

On repart de zéro sur ce dépôt. On garde uniquement **les couleurs et la typographie** du site existant ; tout le reste suit `BRIEF.md` et `INFOS.md` mot pour mot.
