# TODO-A-COMPLETER.md

Toutes les informations manquantes. Chacune apparaît sur le site sous forme d'emplacement visible « À COMPLÉTER : … ».

## Textes

- [ ] Valider les textes que j'ai écrits (liste dans `TEXTES-A-VALIDER.md`)

## Produits

- [x] Fabulous, Miraculous et Luxurious : mode d'emploi, précautions et illustrations (fournis le 20/10/2026)
- [ ] Validation des allégations avant mise en ligne (en particulier Miraculous et le pack : pousse, chute)
- [ ] FAQ de chaque produit : questions et réponses
- [x] FAQ générale : retours et produit défectueux (fournis le 24/10/2026)

## Visuels et identité


- [ ] Couleurs des flacons (provisoires, `lib/design-tokens.ts`, `app/globals.css` et `lib/palette.ts`) : Pantone exacts de Fabulous (cadre #B2DCCB ; nom ton sur ton #1D5A3C validé le 21/10/2026), Miraculous (cadre #B9A5E2, couleur du nom À COMPLÉTER), Luxurious (cadre #EBC4DE, couleur du nom À COMPLÉTER)

- [ ] Police du logo (nom ou fichier) : en attendant, logo vectorisé (SVG)
- [ ] Police Bebas Kai (fichier) : en attendant, Bebas Neue

- [ ] Lien Drive : logo, polices
- [x] `assets/images/fabulous.jpg`, `miraculous.jpg`, `luxurious.jpg` : fournies le 21/10/2026 (versions web : `scripts/preparer-photos.py`)
- [x] `assets/images/pack.jpg` : fournie le 21/10/2026
- [x] `assets/images/fabulous.png`, `miraculous.png`, `luxurious.png` : photos détourées fournies le 22/10/2026 (versions web : `scripts/preparer-detoures.py`)
- [ ] Détourage manuel des flacons (mêmes noms de fichiers) : la version 2 du 26/10/2026 est propre en bas mais garde de petites encoches sur les bords (Luxurious à gauche et à droite, Miraculous à gauche)
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

## Pages juridiques (modification 39) — textes fournis le 23/10/2026, à faire relire

Le build de **production** est bloqué tant qu'un de ces points reste dans les pages légales, les emails ou le pied de page
(`npm run verifier:mise-en-ligne` affiche la liste exacte). Après chaque changement : `npm run pdf:juridique` (PDF des CGV et du formulaire).

- [x] Frais de retour en cas de rétractation : à la charge de la cliente (CGV et page Rétractation)
- [x] Forme juridique, capital, RCS : BIOTYVIE, SARL à associé unique, 1 000 €, RCS Paris 922 151 170 (26/10/2026)
- [x] Directrice de la publication : la gérante (26/10/2026)
- [x] TVA : franchise en base, « TVA non applicable, article 293 B du CGI » ; plus aucun « TTC » sur le site (26/10/2026)
- [ ] **Hébergeur** : Netlify, Inc. renseigné dans les mentions légales ; à confirmer (hébergement final, téléphone de l'hébergeur demandé par la loi, non publié par Netlify : à faire valider)
- [ ] **Médiateur de la consommation** : nom, adresse, site (mentions légales, CGV)
- [ ] **Zone de livraison** : France métropolitaine seulement, ou Corse et DOM-TOM (CGV)
- [ ] **Délai de livraison** à confirmer avec les transporteurs (CGV)
- [ ] **Frais de livraison** : « livraison offerte » ou grille de tarifs (CGV)
- [ ] **Plateforme européenne de règlement des litiges** si vente dans d'autres pays de l'UE (CGV)
- [ ] **Sceau de garantie** sur les flacons : activer ou retirer l'option « produits descellés » (CGV, Rétractation)
- [ ] Option « dépréciation du produit » : à valider par un professionnel (CGV, Rétractation)
- [ ] **Dates de mise à jour** des CGV, de la confidentialité et des cookies
- [ ] **Téléphone** demandé à la commande ou non (confidentialité ; aujourd'hui le formulaire de commande ne le demande pas)
- [ ] **Durées de conservation** des données à valider (confidentialité)
- [ ] **Prestataires** et transferts hors UE à vérifier (Stripe, Supabase, Resend, transporteurs, hébergeur) (confidentialité)
- [ ] Cookie de session du **paiement** : à décrire quand Stripe sera activé (cookies)
- [ ] Phrase « aucun outil de mesure ni de publicité » à confirmer / mettre à jour (cookies)
- [ ] Mentions « Projet de texte à faire relire avant publication » à retirer après relecture
- [ ] Factures : modèle prêt (`lib/invoices/invoice.ts`), à produire automatiquement quand le paiement sera activé
- [ ] **Relecture professionnelle** : CGV, rétractation, mentions légales, confidentialité, cookies ; conformité cosmétique (étiquetage, INCI, allégations pousse / repousse / chute)
- [ ] **Envoi des emails** : service d'envoi à choisir ; l'email de confirmation est prêt (`lib/emails/confirmation.ts`, CGV et formulaire en PDF joints)

## Boutique

- [x] Égalité Fabulous / Luxurious au quiz : résultat Luxurious (21/10/2026) ; bloc Miraculous gardé sur tous les résultats
- [ ] Images story du quiz (`assets/story/`) : adresse du site à ajouter (Instagram @na.nah.nhair fait le 24/10/2026), puis relancer `node scripts/generer-stories.mjs`
- [ ] Stock initial de chaque sérum (à saisir dans le back-office ; vide = stock non suivi)

## Technique

- [ ] Email d'accusé de réception du formulaire de contact (service d'envoi d'emails à choisir)
- [ ] Activer l'indexation Google (`NNH_INDEXABLE=1`) au moment de la mise en ligne officielle

- [ ] Nom de domaine
- [ ] Comptes Supabase et Stripe (plus tard)
- [ ] Service d'envoi des emails (Resend non retenu pour l'instant)
- [ ] Compte Mondial Relay
- [ ] Adresse(s) email des administrateurs du back-office
