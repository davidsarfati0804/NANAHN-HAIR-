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
- [ ] **Médiateur de la consommation** : adhésion obligatoire, à choisir avant l'ouverture (pistes à vérifier : CM2C, AME Conso ; liste officielle www.economie.gouv.fr/mediation-conso) ; puis remplacer les deux emplacements (CGV article 14, mentions légales)
- [x] Zone de livraison : France métropolitaine, Corse comprise (DOM-TOM exclus) ; le formulaire de commande refuse les codes postaux 97/98 (27/10/2026)
- [ ] FAQ « Où livrez-vous ? » répond encore « France uniquement » : texte à aligner sur la zone des CGV si tu le souhaites
- [x] Délai de livraison : « 3 jours ouvrés, préparation incluse » (à tenir en pratique, sinon le modifier partout)
- [x] Frais de livraison : offerts (CGV) ; grille Colissimo / Mondial Relay seulement si la livraison redevient payante
- [x] Plateforme européenne de règlement des litiges : ligne retirée des CGV (27/10/2026)
- [x] Sceau de garantie : pas de sceau, paragraphe retiré (CGV, Rétractation) ; texte gardé dans `content/juridique/option-sceau-a-activer-plus-tard.txt`, à ajouter seulement si un sceau est mis en place
- [ ] Paragraphe « dépréciation du produit » : actif, à faire valider par un professionnel (CGV, Rétractation)
- [ ] **Dates de mise à jour** des CGV, de la confidentialité et des cookies
- [x] Téléphone : champ « Téléphone (facultatif) » ajouté au formulaire de commande, pour qu'il corresponde à la politique de confidentialité (27/10/2026)
- [ ] Durées de conservation : 10 ans (commandes, factures), 3 ans (messages de contact), pas de newsletter ; à faire valider par un professionnel
- [ ] **Emails par Gmail** (choix du 28/10/2026) : la politique de confidentialité cite Resend ; à remplacer par Google (Gmail / Google Workspace) après relecture
- [ ] **Prestataires** listés dans la confidentialité : Stripe, Supabase, Resend, Colissimo, Mondial Relay, Netlify. À CONFIRMER : aujourd'hui le site n'utilise **ni Supabase ni Resend** (données sur Netlify Blobs, service d'emails pas encore choisi) ; Stripe pas encore branché. Ajuster le tableau ou les choix techniques avant l'ouverture
- [x] Cookies : paragraphe Stripe ajouté ; tableau complété d'après le code (« nnh-panier-v1 » panier, « nnh-consentement » 6 mois, « nnh_admin » 8 heures) (27/10/2026)
- [ ] Phrase « aucun outil de mesure ni de publicité » à confirmer / mettre à jour (cookies)
- [ ] Mentions « Projet de texte à faire relire avant publication » à retirer après relecture
- [ ] Factures : modèle prêt (`lib/invoices/invoice.ts`), à produire automatiquement quand le paiement sera activé
- [ ] **Relecture professionnelle** : CGV, rétractation, mentions légales, confidentialité, cookies ; conformité cosmétique (étiquetage, INCI, allégations pousse / repousse / chute)
- [ ] **Envoi des emails** : service d'envoi à choisir ; l'email de confirmation est prêt (`lib/emails/confirmation.ts`, CGV et formulaire en PDF joints)

## Vente en ligne (28/10/2026)

- [ ] Compte **Stripe** : créer, puis clés de test dans Netlify (GUIDE.md, « Paiement en ligne ») ; validation du compte (identité, IBAN) avant les vrais paiements
- [ ] **Gmail** : mot de passe d'application dans Netlify (GUIDE.md, « Emails »)
- [ ] **Stock de départ** de chaque sérum (back-office > Produits et stocks)
- [ ] **FAQ des trois fiches produit** (questions et réponses) : `content/site.ts`, champ `faq` de chaque soin ; sinon dire si le bloc doit être retiré
- [ ] **Adresse du site** sur les images story du quiz : `quiz.story.siteAddress`, puis `node scripts/generer-stories.mjs`
- [ ] Mondial Relay : compte et choix du point relais (désactivé à l'ouverture)
- [ ] Propositions d'alignement FAQ / email avec les CGV : TEXTES-A-VALIDER.md §6

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
