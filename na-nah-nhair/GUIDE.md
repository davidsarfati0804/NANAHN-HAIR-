# GUIDE.md — Lancer, tester et modifier le site

Le nouveau site est dans le dossier `na-nah-nhair/`. Le premier site (à la racine du dépôt) n'est pas touché.

## Lancer le site sur un ordinateur

1. Installer Node.js 20 ou plus récent.
2. Ouvrir un terminal dans le dossier `na-nah-nhair/`.
3. `npm install` (une seule fois).
4. `npm run dev`, puis ouvrir http://localhost:3000.

## Tester

- `npm test` : tests automatiques (contrastes, textes conformes à INFOS.md, quiz : les 243 combinaisons, prix, panier, stock, sécurité).
- `npm run build` puis `npm run test:e2e` : tests dans un navigateur (quiz, panier, commande, back-office, accessibilité, affichage en 375 px / tablette / ordinateur). Les captures d'écran sont enregistrées dans `captures/`.

## Modifier

| Je veux changer… | Fichier |
|---|---|
| un texte (produit, accueil, bandeau, pack, histoire, infos légales) | `content/site.ts` |
| une couleur | `lib/design-tokens.ts` **et** `app/globals.css` (mêmes valeurs ; un test vérifie qu'elles sont identiques) |
| une police | `app/layout.tsx` (polices de remplacement) et `app/globals.css` |

## Ajouter les photos

Le plus simple : depuis le back-office, **Produits et stocks** > Photo.

Ou dans le code : déposer la photo dans `assets/images/` (ex. `fabulous.jpg`), la copier dans `public/images/`, puis dans `content/site.ts` passer `available: false` à `available: true` pour cette photo.

## Back-office (`/admin`)

1. Choisir un mot de passe d'au moins 12 caractères, puis lancer :
   `npm run admin:setup -- "mon mot de passe"`
2. La commande affiche trois lignes `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET` et `ADMIN_TOTP_SECRET`.
   - En local : les copier dans un fichier `.env.local` (jamais envoyé sur GitHub).
   - En ligne : les ajouter dans Netlify > Site configuration > Environment variables.
3. Ajouter la clé `ADMIN_TOTP_SECRET` dans une application d'authentification (Google Authenticator, Authy…) : elle donne le code à 6 chiffres demandé à chaque connexion.
4. Se connecter sur `/admin/connexion`.

Le mot de passe n'est jamais enregistré, seule son empreinte (hash) l'est. Pour le changer, relancer `npm run admin:setup` et remplacer les variables.

Dans le back-office :

- **Commandes** : chaque commande (en attente de paiement, payée, expédiée, annulée), adresse, facture, preuve
  d'acceptation des CGV ; bouton « Marquer expédiée » avec le numéro de suivi ; renvoi de l'email de confirmation.
- **Produits et stocks** : prix, stock (vide = non suivi), disponibilité, photo de chaque produit. Le pack n'a pas de
  stock propre. Le stock baisse tout seul à chaque commande payée.
- **Livraison** : seuil de livraison offerte (0 = toujours offerte) et transporteurs. À l'ouverture : Colissimo seul
  (Mondial Relay à cocher plus tard, quand le compte et le choix du point relais seront prêts).
- **Messages** : messages du formulaire de contact (une alerte part aussi par email si les emails sont configurés).
- **Journal** : historique des modifications et des erreurs.
- **Télécharger une sauvegarde** (tableau de bord) : fichier de toutes les données. Avant la mise en ligne, puis
  chaque semaine ; à garder en lieu sûr.

Un code à 6 chiffres ne sert qu'une fois : pour une 2e connexion dans la même minute, attendre le code suivant.

## Où sont les données ?

Commandes, prix, stocks, réglages, messages et photos envoyées sont enregistrés :

- en ligne : dans **Netlify Blobs** (inclus dans Netlify, rien à créer), avec un espace **séparé** pour la vraie
  boutique (production), pour `site-2` et pour les aperçus : les tests faits sur `site-2` n'arrivent jamais dans
  la vraie boutique ;
- en local : dans le dossier `.data/` (ignoré par Git).

## Paiement en ligne (Stripe)

Le paiement est prêt dans le code ; il s'active dès que les clés sont dans Netlify. **Toujours en mode test d'abord.**

1. Créer le compte sur stripe.com (gratuit), avec l'email de la boutique. Laisser le bouton « Mode test » activé.
2. Stripe > Développeurs > **Clés API** : copier la **clé secrète de test** (`sk_test_…`). Ne jamais l'envoyer par
   message ni la mettre dans le code.
3. Netlify > Site configuration > Environment variables : ajouter `STRIPE_SECRET_KEY` = cette clé, contexte
   **Branch deploys** (pour `site-2`).
4. Stripe > Développeurs > **Webhooks** > Ajouter une destination :
   - adresse : `https://site-2--nanahnhair.netlify.app/api/stripe/webhook` ;
   - événements : `checkout.session.completed` et `checkout.session.async_payment_succeeded`.
   Copier le **secret de signature** (`whsec_…`) et l'ajouter dans Netlify : `STRIPE_WEBHOOK_SECRET`, même contexte.
5. Redéployer `site-2` (Deploys > Trigger deploy). La page Commandes du back-office affiche « Stripe en MODE TEST ».
6. Tester une commande avec la carte de test `4242 4242 4242 4242` (date future, code 123) : la commande passe
   « Payée », le stock baisse, la facture apparaît, l'email part (si les emails sont configurés).

Pour les vrais paiements (seulement le jour de l'ouverture, après validation du compte Stripe) : mêmes étapes avec
la clé `sk_live_…`, un webhook vers l'adresse définitive du site, et le contexte **Production** dans Netlify.

## Emails (Gmail)

Les emails (confirmation de commande avec facture et PDF des CGV, alertes « nouvelle commande » et « nouveau
message ») partent du compte Gmail ou Google Workspace de la boutique.

1. Sur ce compte Google : activer la **validation en deux étapes** (Compte Google > Sécurité).
2. Créer un **mot de passe d'application** : Compte Google > Sécurité > Mots de passe des applications
   (myaccount.google.com/apppasswords), nom « Site NA NAH N'HAIR ». Google affiche 16 lettres.
3. Netlify > Environment variables (contexte Branch deploys pour tester, Production à l'ouverture) :
   - `SMTP_USER` = l'adresse Gmail (ex. Contact@nanahnhair.com si c'est un compte Google Workspace) ;
   - `SMTP_PASSWORD` = les 16 lettres du mot de passe d'application (jamais le mot de passe du compte) ;
   - facultatif : `MAIL_NOTIFY` = adresse qui reçoit les alertes (par défaut Contact@nanahnhair.com).
4. Redéployer. La page Commandes du back-office affiche « Emails : envoi actif ».

Ne jamais envoyer ces mots de passe par message : ils se saisissent uniquement dans Netlify.
Gmail limite l'envoi à environ 500 emails par jour (2 000 avec Google Workspace), largement suffisant.

## Voir le nouveau site en ligne (Netlify)

Le premier site (branche `main`) n'est pas modifié. Le nouveau site est publié depuis la branche **`site-2`** :
son fichier `netlify.toml` à la racine indique à Netlify de construire le dossier `na-nah-nhair/`.

**Une seule fois, dans Netlify** (site déjà relié à GitHub) :

1. Site configuration > Build & deploy > Continuous deployment > **Branches and deploy contexts** > Configure.
2. **Branch deploys** : choisir « Let me add individual branches » et ajouter `site-2` (ou « All »). Enregistrer.
3. Site configuration > Environment variables : ajouter `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET` et `ADMIN_TOTP_SECRET` (voir « Back-office » ci-dessus), avec le contexte « Branch deploys ».
4. Deploys > Trigger deploy (ou attendre le prochain envoi sur `site-2`).

Adresse du nouveau site : `https://site-2--<nom-du-site-netlify>.netlify.app`.
Chaque envoi sur la branche `site-2` met ce site à jour automatiquement.

## Mise en ligne officielle

Uniquement après validation : voir la checklist du jour J dans `recette/2026-10-28/rapport-production.md`.
Le contrôle `npm run verifier:mise-en-ligne` (lancé par Netlify avant chaque build de production) refuse la mise
en ligne tant qu'une information manque : pages légales, FAQ des fiches, adresse sur les images story
(`quiz.story.siteAddress`, puis `node scripts/generer-stories.mjs`), PDF juridiques à régénérer
(`npm run pdf:juridique`). Variables de production : `SITE_URL`, `NNH_INDEXABLE=1`, `ADMIN_*`, Stripe, emails.
