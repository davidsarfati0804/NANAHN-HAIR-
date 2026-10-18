# Rapport — Phase 7 : contact, pages juridiques, RGPD, SEO

## Livré

- **Contact** (`/contact`) : formulaire (nom, email, sujet, message) avec validation côté serveur, erreurs affichées sous chaque champ, message de confirmation ; anti-spam (champ piège invisible + délai minimal de remplissage) ; 5 messages par heure et par IP ; coordonnées ; Instagram « À COMPLÉTER ».
- **Back-office > Messages** : lecture des messages reçus, suppression définitive (droit à l'effacement), export CSV (protégé, cellules neutralisées contre l'injection de formules).
- **Pages juridiques** (`/mentions-legales`, `/cgv`, `/confidentialite`, `/cookies`, `/retours`) : uniquement les faits d'INFOS.md, le reste en « À COMPLÉTER » ; chaque page porte un avertissement « à faire relire » ; les CGV sont présentées comme un **projet** (INFOS §11).
- **RGPD** : bandeau cookies à la première visite (Accepter / Refuser), choix mémorisé et modifiable depuis la politique cookies. Le site ne dépose **aucun cookie** chez les visiteuses (le panier est dans le stockage du navigateur) ; tout futur outil devra vérifier le consentement (`lib/consent.ts`).
- **SEO** : titre et description par page, adresses canoniques, `sitemap.xml`, `robots.txt`, données structurées Produit (prix, disponibilité) et Organisation. **Non indexé tant que la mise en ligne officielle n'est pas validée** (variable `NNH_INDEXABLE=1` à activer à ce moment-là), pour ne pas concurrencer le premier site.
- **Instagram** : bouton « Partager mon résultat » sur les résultats du quiz (menu de partage du téléphone, sinon copie du lien), sans aucun suivi.

## Tests

| Suite | Résultat |
|---|---|
| Tests automatiques : validation du contact, pages juridiques = INFOS §11, + toutes les suites précédentes | ✅ 82/82 |
| Navigateur : contact (champs vides, email invalide, robot, envoi, back-office, suppression, export protégé), bandeau cookies (affichage, mémorisation, modification, aucun cookie déposé), pages juridiques, sitemap / robots / données produit / noindex, partage, + toutes les suites précédentes | ✅ 88/88 |
| Accessibilité WCAG AA (axe) : 21 pages + bandeau cookies affiché | ✅ |

## À COMPLÉTER ajoutés

- Email d'accusé de réception du formulaire de contact : nécessite un service d'envoi d'emails (Resend non retenu pour l'instant).
- Coordonnées complètes de l'hébergeur, médiateur de la consommation, droit applicable, durée de conservation des données, modèle de formulaire de rétractation.
