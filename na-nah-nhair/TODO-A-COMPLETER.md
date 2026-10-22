# TODO-A-COMPLETER.md

Toutes les informations manquantes. Chacune apparaît sur le site sous forme d'emplacement visible « À COMPLÉTER : … ».

## Textes

- [ ] Valider les textes que j'ai écrits (liste dans `TEXTES-A-VALIDER.md`)

## Produits

- [x] Fabulous, Miraculous et Luxurious : mode d'emploi, précautions et illustrations (fournis le 20/10/2026)
- [ ] Validation des allégations avant mise en ligne (en particulier Miraculous et le pack : pousse, chute)
- [ ] FAQ de chaque produit : questions et réponses
- [ ] FAQ générale : frais de retour, procédure en cas de produit défectueux (mode d'emploi, précautions et contact commande : fournis le 21/10/2026)

## Visuels et identité


- [ ] Couleurs des flacons (provisoires, `lib/design-tokens.ts`, `app/globals.css` et `lib/palette.ts`) : Pantone exacts de Fabulous (cadre #B2DCCB ; nom ton sur ton #1D5A3C validé le 21/10/2026), Miraculous (cadre #B9A5E2, couleur du nom À COMPLÉTER), Luxurious (cadre #EBC4DE, couleur du nom À COMPLÉTER)

- [ ] Police du logo (nom ou fichier) : en attendant, logo vectorisé (SVG)
- [ ] Police Bebas Kai (fichier) : en attendant, Bebas Neue

- [ ] Lien Drive : logo, polices
- [x] `assets/images/fabulous.jpg`, `miraculous.jpg`, `luxurious.jpg` : fournies le 21/10/2026 (versions web : `scripts/preparer-photos.py`)
- [x] `assets/images/pack.jpg` : fournie le 21/10/2026
- [x] `assets/images/fabulous.png`, `miraculous.png`, `luxurious.png` : photos détourées fournies le 22/10/2026 (versions web : `scripts/preparer-detoures.py`)
- [ ] 4 choix de style à valider (A ou B) : section « Les 4 choix à valider » de `/guide-de-style`
- [x] `assets/logo/` : logo fourni le 19/10/2026 (utilisé dans l'en-tête et comme titre de l'accueil)
- [ ] Logo en version vectorielle (SVG) ou police du logo, pour un rendu encore plus net
- [ ] `assets/fonts/` : polices des flacons (remplacement provisoire : Bebas Neue + Montserrat)
- [ ] Hex exact du Pantone 15-3817 TCX Lavender (valeur actuelle `#AAA1C8`, à valider visuellement)
- [ ] Icône d'onglet (favicon) à faire à partir du logo

## Code NNH27

- [ ] Date de fin (pays : France)

## Livraison

- [ ] Tarifs Colissimo et Mondial Relay (utiles si la livraison redevient payante)
- [ ] Compte Mondial Relay pour le choix du point relais

## Retours

- [ ] Qui paie le retour en cas de rétractation
- [ ] Validation de la politique de retours
- [ ] CGV définitives (relecture juridique)

## Informations légales

- [ ] Médiateur de la consommation (CGV)
- [ ] Droit applicable et juridiction (CGV)
- [ ] Durée de conservation des messages et des commandes (confidentialité)
- [ ] Modèle de formulaire de rétractation, procédure et adresse de retour
- [ ] Relecture juridique de toutes les pages légales

- [ ] Statut de l'entreprise
- [ ] Numéro de TVA / statut fiscal (mention sur les factures)
- [ ] Hébergeur : Netlify (décidé). Coordonnées légales à confirmer pour les mentions légales
- [ ] Responsable de publication
- [ ] Lien Instagram de la marque

## Boutique

- [x] Égalité Fabulous / Luxurious au quiz : résultat Luxurious (21/10/2026) ; bloc Miraculous gardé sur tous les résultats
- [ ] Images story du quiz (`assets/story/`) : adresse du site et identifiant Instagram à ajouter, puis relancer `node scripts/generer-stories.mjs`
- [ ] Stock initial de chaque sérum (à saisir dans le back-office ; vide = stock non suivi)

## Technique

- [ ] Email d'accusé de réception du formulaire de contact (service d'envoi d'emails à choisir)
- [ ] Activer l'indexation Google (`NNH_INDEXABLE=1`) au moment de la mise en ligne officielle

- [ ] Nom de domaine
- [ ] Comptes Supabase et Stripe (plus tard)
- [ ] Service d'envoi des emails (Resend non retenu pour l'instant)
- [ ] Compte Mondial Relay
- [ ] Adresse(s) email des administrateurs du back-office
