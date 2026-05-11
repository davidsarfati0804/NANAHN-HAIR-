# Na Nah N’hair - V1 e-commerce

Site Next.js responsive pour une marque capillaire. Cette V1 est indépendante du projet `assistantsmedicauxwix` et prête à être connectée à un vrai panier e-commerce.

## Lancer le projet

```bash
npm run dev
```

Ouvrir `http://localhost:3000`.

## Modifier les produits

Les produits sont dans `data/products.ts`.

Chaque produit contient :

- `name` : nom affiché
- `price` : prix affiché
- `scent` : odeur
- `description` : texte de carte
- `accent` : petit label de positionnement

Le pack est dans le même fichier via `pack`.

## Modifier les textes

Les textes de navigation, hero, avantages du pack, avant/après, avis, valeurs et FAQ sont dans `data/site.ts`.

Les avis sont fictifs pour la V1 et marqués en commentaire TODO. Remplacer ces contenus par des avis vérifiés avant publication.

## Modifier les couleurs

Les couleurs principales sont dans `app/globals.css` et centralisées aussi dans `lib/theme.ts`.

La couleur principale Lavender est `#AAA1C8`, utilisée pour les boutons, cartes, encadrés et accents. Le violet foncé est `#35205F`.

## Modifier la typographie

La variable CSS principale est dans `app/globals.css` :

```css
--font-brand: "Work Sans", Arial, sans-serif;
```

Remplacer cette valeur quand la typographie exacte de la cliente sera fournie.

## Remplacer les images

Les placeholders sont dans les composants :

- `components/ecommerce/HeroSection.tsx` : photo horizontale des 3 flacons
- `components/ecommerce/ProductSections.tsx` : photos produit et pack spa à Maurice
- `components/ecommerce/BeforeAfterSlider.tsx` : photos avant/après

Les TODO indiquent les emplacements à remplacer.

## À connecter ensuite

- Boutons “Ajouter au panier”
- Tunnel de paiement
- Pages CGV, mentions légales, confidentialité
- Politique de livraison et retours
- Avis vérifiés
- Compositions INCI et fiches produit complètes
