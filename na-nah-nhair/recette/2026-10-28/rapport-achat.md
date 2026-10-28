# Recette : parcours d'achat (NA NAH N'HAIR)

Date : 28/10/2026. Testé en local sur le build de production (`next start`, port 3200). Les tests de stock ont été faits sur une 2e instance que j'ai lancée sur le port 3300 avec son propre dossier de données (`agent-achat/data3300`), pour ne pas toucher aux données partagées ; je l'ai arrêtée à la fin. Aucun fichier du projet n'a été modifié.

Preuves (scripts, journaux, captures) : `/tmp/claude-0/-home-user-nanahn-hair-/cbc784ff-bc8e-5b19-b2fe-76bd78d2564a/scratchpad/recette/agent-achat/`
- `api-tests.sh` → `api-tests.log` (tests curl de /api/quote et /api/commande)
- `parcours.js` → `parcours.log` + `shots/*-375.png`, `*-390.png`, `*-1280.png` (parcours complet aux 3 largeurs)
- `stock.js` → `stock.log` + `shots/stock-*.png` (rupture, stock bas, localStorage manipulé)
- `banniere.js` → `shots/banniere-cookies-sur-barre-390.png`

Légende : **[constaté]** = reproduit en test ; **[code]** = vérifié en lisant le code ; **[supposé]** = déduction non testée.

---

## 1. Ce qui fonctionne

- **Prix** [constaté] : Fabulous 19,90 €, Miraculous 39,90 €, Luxurious 29,90 €, Pack 69,90 €. Ils sont lus côté serveur sur les fiches, la boutique et le panier. « TVA non applicable, article 293 B du CGI » est affiché au panier et au récapitulatif.
- **Le serveur ne fait pas confiance au prix envoyé par le navigateur** [constaté + code] : les champs `priceCents`, `unitCents` et `totalCents` injectés dans /api/quote, /api/commande ou dans le localStorage sont ignorés. Le total est recalculé à partir du catalogue (`lib/pricing.ts` `computeQuote`).
- **Données invalides refusées** [constaté] : produit inconnu, `__proto__`, quantité 0, négative, décimale ou en texte, JSON cassé (400), corps de plus de 5 Ko ou 8 Ko (413, y compris en envoi « chunked »), GET (405), transporteur inconnu, CGV absentes ou `"true"` en texte, champs d'adresse qui ne sont pas du texte ou trop longs (121 caractères et plus).
- **Ajout au panier** [constaté, 375, 390 et 1280 px] : champ quantité borné entre 1 et 99 (une saisie de 0 ou -5 donne 1, 500 donne 99), message « Ajouté au panier · Voir le panier », compteur « PANIER (n) » dans l'en-tête.
- **Barre d'achat fixe** [constaté] : elle apparaît sur mobile quand on a fait défiler la page au-delà du bouton, sur les 3 fiches sérum. Elle est masquée à partir de 768 px.
- **Panier** [constaté] : boutons + et −, « Retirer », passer à 0 supprime la ligne, panier conservé après rechargement (`nnh-panier-v1`), livraison « Offerte », total juste.
- **localStorage manipulé** [constaté] : produit inconnu → ignoré ; quantité 0, négative ou en texte → ignorée ; JSON cassé ou objet → panier vide, sans plantage ; quantité 1 000 000 → ramenée à 99.
- **Stock** [constaté, instance 3300] : stock 0 → « Épuisé » et pas de bouton (fiche, boutique) ; pack « Épuisé » si un des sérums est à 0 ; « Plus que 2 en stock » ; quantité limitée au stock ; panier bloqué (« Stock insuffisant », bouton Commander désactivé) ; /api/commande renvoie 409 au-delà du stock ou pour un pack indisponible.
- **Page /commande** [constaté] : case CGV non cochée par défaut et message d'erreur si elle n'est pas cochée ; bouton « Commander et payer » désactivé tant qu'aucun transporteur n'est choisi ; téléphone facultatif ; codes postaux 97xxx et 98xxx refusés (y compris par le serveur) ; Corse (20000, 20090, 20200) acceptée ; choix Colissimo ou Mondial Relay ; récapitulatif (adresse, délai de 3 jours ouvrés) ; information sur la rétractation avec liens vers les CGV et la page Rétractation.
- **Mise en page** [constaté] : aucun défilement horizontal à 375, 390 et 1280 px (fiche, pack, panier, commande).
- **Preuve d'acceptation des CGV** enregistrée (numéro, date, version v1) [constaté : fichiers `cgv-acceptations_NNH-…` dans le dossier de données].

---

## 2. Ce qui ne fonctionne pas

> Rappel : l'absence de paiement est voulue (`paymentAvailable:false`). Les points ci-dessous qui en découlent sont classés comme bloquants pour **l'ouverture**, pas comme des bugs du code actuel.

### 🔴 B1. Aucune commande n'est réellement enregistrée : l'adresse, le panier et le total sont perdus
- **Fichier** : `app/api/commande/route.ts:40-42`, `lib/store/index.ts:157-162`
- **Reproduire** : remplir /commande puis cliquer sur « Commander et payer ». Le message « Commande n° NNH-20261028-xxxx : conditions générales de vente acceptées » s'affiche.
- **Preuve** [constaté] : la seule chose écrite dans le dossier de données est `cgv-acceptations_NNH-…` = `{orderNumber, acceptedAt, cgvVersion}`. Il n'y a ni produits, ni montant, ni email, ni adresse. Le back-office n'a aucune page Commandes (`app/admin/(protege)/page.tsx:41` : « Commandes, codes promo et factures : phase 6 (avec Stripe) »).
- **Conséquence** : aujourd'hui, une cliente qui « commande » ne laisse aucune trace exploitable par la marque.

### 🔴 B2. Pas de paiement, pas d'email de confirmation, pas de facture, pas de baisse du stock
- **Fichiers** : `lib/emails/confirmation.ts` et `lib/invoices/invoice.ts` ne sont appelés nulle part en dehors des tests unitaires [code : grep]. Aucun service d'envoi d'emails n'est branché.
- **Stock** [constaté, instance 3300] : Luxurious en stock 5, deux commandes de 5 acceptées (200) → le stock reste à 5.
- **Après la commande** [constaté] : le panier n'est pas vidé et l'adresse reste sur /commande. Une nouvelle commande est possible en rechargeant la page.
- Voir la section 3 pour ce qu'il faut mettre en place.

### 🔴 B3. Mondial Relay : la commande est acceptée sans point relais
- **Fichiers** : `components/cart/Checkout.tsx:393-398` (emplacement « À COMPLÉTER : sélection du point relais ») ; `app/api/commande/route.ts:34` (accepte `mondial-relay` sans identifiant de point relais).
- **Reproduire** : sur /commande, choisir Mondial Relay, remplir l'adresse, cocher les CGV, valider → 200 et un numéro de commande [constaté, 375, 390 et 1280 px, capture `shots/commande-envoyee-375.png`].
- **Avant l'ouverture** : soit brancher le widget Mondial Relay (compte À COMPLÉTER), soit masquer ce transporteur.

### 🟠 I1. La barre d'achat fixe ne tient pas compte du stock
- **Fichier** : `components/product/StickyBuyBar.tsx:52-55` (`add(id, 1)` sans vérifier le stock disponible avec `maxAddable`, contrairement à `AddToCart.tsx:627-631`).
- **Reproduire** [constaté, instance 3300] : Fabulous en stock 2 ; ajouter 2 avec le bouton principal (qui se désactive alors), faire défiler la page, cliquer 2 fois sur la barre fixe → panier `[{"id":"fabulous","quantity":4}]`.
- **Effet** : le panier affiche ensuite « Stock insuffisant » et bloque la commande. Il n'y a donc pas de survente, mais l'expérience est trompeuse. Autre défaut : le libellé reste « Ajouté au panier » après le premier clic, sans retour à l'état initial.

### 🟠 I2. /api/commande sans limite de débit ni contrôle d'origine
- **Fichier** : `app/api/commande/route.ts` (pas de limitation, contrairement au formulaire de contact qui a `contact-attempts`).
- **Preuve** [constaté] : requêtes acceptées (200) avec `Content-Type: text/plain` et `Origin: https://evil.example`. Chaque appel crée un fichier ou une entrée Netlify Blobs. Quelqu'un peut donc remplir le stockage avec de fausses « acceptations de CGV ».
- **À traiter** en même temps que l'enregistrement des vraies commandes (limite par IP, vérification de l'en-tête Origin).

### 🟠 I3. Code NNH27 absent
- [code] : il n'y a aucun champ « code promo » dans le panier ni sur /commande, et aucune logique dans `lib/pricing.ts`. Les règles sont dans `INFOS.md` §1 (livraison offerte sur la première commande, une seule fois par email, France). La date de fin est **À COMPLÉTER**.
- Selon `INFOS.md` §11, le code « n'a plus d'effet tant que la livraison est offerte à tous ». Ce n'est donc pas bloquant tant que le seuil reste à 0 €. Il faudra le développer avant de rendre la livraison payante.

### 🟠 I4. Tarifs des transporteurs vides
- [constaté] /api/catalog : `colissimo.priceCents: null`, `mondial-relay.priceCents: null`. Sans effet tant que la livraison est offerte (seuil 0). Si la marque relève le seuil, aucun transporteur ne sera proposé (« Aucun mode de livraison n'est disponible ») tant que les tarifs ne sont pas saisis [code : `Checkout.tsx:347`]. Tarifs **À COMPLÉTER** (marque).

### 🟢 C1. Codes postaux impossibles acceptés
- `lib/order.ts:123` : 00000 et 99999 sont acceptés [constaté, 200]. Suggestion : départements 01 à 95, plus 20 pour la Corse.

### 🟢 C2. Message d'erreur d'adresse peu précis
- [constaté] Avec un code postal 97200, le message est « Vérifie ton adresse de livraison : les champs signalés sont **incomplets**. Nous livrons en France métropolitaine… ». Le champ n'est pas incomplet, il est hors zone. Seule la bordure du champ change (`aria-invalid`), sans message propre à chaque champ.

### 🟢 C3. Quantité énorme ramenée à 99 sans le dire
- [constaté] Les quantités de 100 à 1 000 000 envoyées à l'API ou mises dans le localStorage sont ramenées silencieusement à 99, et la commande est acceptée pour 99. Une quantité de 1 000 000 001 est refusée. C'est sans risque financier (le prix est calculé par le serveur), mais le comportement n'est pas cohérent (`lib/pricing.ts:170-174`).

### 🟢 C4. Pas de barre d'achat fixe sur la page Pack
- [constaté] `/pack` : aucune barre fixe sur mobile, alors que les 3 fiches sérum en ont une.

### 🟢 C5. Le bandeau cookies cache la barre d'achat fixe à la première visite
- [constaté, 390 px] Tant que la cliente n'a pas choisi, le bandeau (z-50) couvre la barre fixe (capture `shots/banniere-cookies-sur-barre-390.png`).

### 🟢 C6. Numéro de commande
- `lib/order.ts:128-131` : il est composé de 6 caractères hexadécimaux aléatoires par jour. En cas de collision, l'enregistrement de l'acceptation des CGV est écrasé (`setJSON`) [code ; risque très faible]. Ce numéro ne peut pas servir de numéro de facture, qui doit suivre une numérotation chronologique continue.

---

## 3. À mettre en place avant l'ouverture

### Paiement : ce qu'il faut pour activer Stripe

État actuel [code] : le calcul du total côté serveur, la vérification du stock, la validation de l'adresse, les CGV versionnées, le modèle d'email et le modèle de facture HTML sont prêts. Il n'y a ni SDK Stripe, ni modèle de commande, ni webhook. Le développeur doit prévoir :

1. **Enregistrer la commande** au statut « en attente de paiement », côté serveur, dans `/api/commande` : numéro, lignes et total issus de `computeQuote`, adresse, email, transporteur (et point relais), version des CGV. Effort : 0,5 j.
2. **Stripe Checkout (page hébergée par Stripe, recommandé)** : créer la session avec des `price_data` calculés par le serveur (jamais par le navigateur), `metadata.orderNumber`, `customer_email`, et les adresses de retour `/commande/merci` et `/commande/annulee`. Le navigateur est ensuite redirigé vers Stripe. Carte, Apple Pay et Google Pay sont inclus. Effort : 1 j. (Le Payment Element intégré au site demande plutôt 2 à 3 j : plus de travail et de 3-D Secure à gérer.)
3. **Webhook `/api/stripe/webhook`** : lecture du corps brut, vérification de la signature (`STRIPE_WEBHOOK_SECRET`), traitement idempotent (un même événement reçu deux fois ne doit rien faire de plus). Sur `checkout.session.completed`, passer la commande en « payée », baisser le stock, attribuer le numéro de facture, envoyer l'email et vider le panier sur la page de remerciement. Sur `checkout.session.expired`, annuler la commande. Effort : 1 à 1,5 j.
4. **Stock fiable** : Netlify Blobs n'offre pas de transaction. Deux paiements simultanés pourraient vendre le dernier flacon deux fois [supposé]. Il faut des écritures conditionnelles (ETag / `onlyIfMatch`, si la version de `@netlify/blobs` le permet, À VÉRIFIER) ou une vraie base de données (Supabase est prévu dans `PLAN.md`). Il faut aussi revérifier le stock juste avant de créer la session Stripe. Effort : 0,5 à 1 j (plus si migration vers une base).
5. **Factures** : numérotation chronologique continue, sans trou (compteur stocké), génération du PDF à partir de `invoiceHtml` (bibliothèque PDF compatible avec les fonctions Netlify, Chromium y étant difficile à utiliser), archivage 10 ans. Effort : 1 j.
6. **Email de confirmation** : choisir un service d'envoi (À COMPLÉTER, Resend « non retenu »), configurer SPF et DKIM sur le domaine (À COMPLÉTER), joindre les PDF des CGV et du formulaire de rétractation (déjà dans `public/documents/`). Effort : 0,5 j.
7. **Back-office Commandes** : liste, détail, statut (payée, expédiée, remboursée), numéro de suivi, téléchargement de la facture, et remboursements depuis Stripe ou le back-office. Effort : 1 à 1,5 j.
8. **Protection de /api/commande** : limite de débit et contrôle de l'origine (I2). Effort : 0,25 j.
9. **Tests** : tests de bout en bout avec les clés de test Stripe et `stripe listen` pour le webhook, cas de paiement refusé, abandonné ou expiré. Effort : 1 j.

**Estimation développeur : environ 7 à 9 jours** pour Checkout, webhook, commandes, stock, factures, emails, back-office et tests, sans Mondial Relay ni NNH27. **Ajouter environ 1 j** pour le widget Mondial Relay (B3) et **0,5 à 1 j** pour le code NNH27 (I3) quand il sera utile.

### Tableau des actions

| Action | Qui | Effort |
|---|---|---|
| Créer et activer le compte Stripe (BIOTYVIE, SIRET, IBAN, pièces d'identité), donner les clés de test puis les clés réelles | Marque | 1 à 3 j de délai de validation Stripe |
| Choisir le service d'envoi d'emails et accéder au DNS du nom de domaine (domaine À COMPLÉTER) | Marque, puis développeur | 0,5 j |
| Paiement Stripe + webhook + enregistrement des commandes (B1, B2, points 1 à 4) | Développeur | 3 à 4 j |
| Factures numérotées en PDF + email de confirmation (points 5 et 6) | Développeur | 1,5 j |
| Page Commandes du back-office (point 7) | Développeur | 1 à 1,5 j |
| Compte Mondial Relay (identifiants) | Marque | délai À COMPLÉTER |
| Widget point relais, ou retrait de Mondial Relay au lancement (B3) | Développeur | 1 j (ou 0,1 j pour masquer) |
| Saisir le stock initial de chaque sérum dans le back-office (aujourd'hui `stock: null` = non suivi, donc vente illimitée) | Marque | 0,1 j |
| Tarifs Colissimo / Mondial Relay (I4), date de fin de NNH27 (I3) | Marque | À COMPLÉTER |
| Barre fixe qui respecte le stock (I1), limite de débit (I2) | Développeur | 0,5 j |
| Points de confort C1 à C6 | Développeur | 0,5 à 1 j |
| Commande test de bout en bout en mode test Stripe, puis un vrai achat remboursé après la mise en ligne | Marque + développeur | 0,5 j |
