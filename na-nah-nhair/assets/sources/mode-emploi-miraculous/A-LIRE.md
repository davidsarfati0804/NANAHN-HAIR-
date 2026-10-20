# Mode d'emploi Miraculous – intégration

Fiche produit Miraculous : remplacer le contenu du bloc « Mode d'emploi » (l'encadré « À COMPLÉTER ») par le contenu de `mode-emploi-miraculous.html`. Garder le titre « Mode d'emploi » et le cadre existants.

1. Copier le dossier `images/mode-emploi/` dans le dossier d'images du site (adapter les chemins `src` si besoin).
2. Ajouter `mode-emploi.css` à la feuille de styles du site.
3. Polices : Montserrat pour les textes, Bebas Kai pour « Étape 1 / Étape 2 » (Bebas Neue en secours). Couleur de texte = violet foncé du site (`--me-encre`, à aligner sur la variable existante du site).
4. Fond des encadrés : couleur du flacon Miraculous (lavande, valeur provisoire `#E6DDF2`, à remplacer par la valeur du site). Texte foncé sur lavande, jamais blanc.
5. Réutilisable pour Fabulous et Luxurious : même code avec la classe `mode-emploi--fabulous` ou `mode-emploi--luxurious` (couleurs déjà prévues). Les textes de ces deux soins seront fournis plus tard ; leurs blocs restent « À COMPLÉTER » en attendant.
6. Tester sur mobile (étapes l'une sous l'autre, illustration à gauche) et sur ordinateur (2 étapes côte à côte).
