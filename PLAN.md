# PLAN.md — Phase 1 : plan du site NA NAH N'HAIR

> Statut : **en attente de validation**. Aucun code n'est écrit tant que ce plan et les questions de la section 7 ne sont pas validés.
> Sources : `BRIEF.md`, `INFOS.md` (prioritaire), `DEMARRAGE.md`.

---

## 1. Ce qu'on garde, ce qu'on supprime

**On garde (site actuel)**

- Les couleurs : Lavender `#AAA1C8`, Lavender doux `#F3F0FA`, brume `#E8E2F2`, violet profond `#35205F`, prune `#6D4E91`, encre `#211A2E`, blanc `#FFFFFF`, et les touches existantes (blush `#FFF5F7`, or `#D8A24A`, jaune Pantone 7499 `#F1E6B2`).
- La typographie : titres en **Bebas Kai** (remplacement Bebas Neue), texte en **Montserrat**. À remplacer par les polices des flacons dès qu'elles arrivent dans `assets/fonts/`.

**On supprime** : toutes les pages, composants, textes et données actuels, en particulier les avis clients fictifs et la page « Résultats » avant/après (interdits par le brief), ainsi que la configuration Netlify si l'hébergement passe sur Vercel (question 7.2).

**On ajoute** (demandé par le brief, absent aujourd'hui) : vert Fabulous et rose Luxurious. Je proposerai des teintes en phase 2, accordées au Lavender, à valider visuellement.

Contrastes mesurés (WCAG AA = 4,5 minimum pour du texte) :

| Combinaison | Ratio | Verdict |
|---|---|---|
| Blanc sur Lavender | 2,43 | ✗ interdit, comme décidé dans INFOS |
| Violet profond sur Lavender | 5,67 | ✓ texte des encadrés |
| Encre sur Lavender | 6,90 | ✓ texte des encadrés |
| Blanc sur prune (bouton) | 6,67 | ✓ boutons |
| Blanc sur violet profond (bouton) | 13,79 | ✓ boutons |

---

## 2. Architecture technique

| Brique | Choix (imposé par BRIEF §7) | Rôle |
|---|---|---|
| Site | Next.js (App Router) + TypeScript + Tailwind CSS | pages, API, back-office |
| Base de données | Supabase (PostgreSQL) | produits, stocks, commandes, codes promo, réglages |
| Authentification admin | Supabase Auth + double authentification (TOTP) | accès au back-office |
| Paiement | Stripe Checkout (carte, Apple Pay, Google Pay), **mode test** | paiement, webhook de confirmation |
| Emails | Resend | confirmation de commande, expédition, accusé de contact |
| Factures | PDF généré côté serveur, stocké dans Supabase Storage | facture par commande |
| Hébergement | Vercel (voir question 7.2) | HTTPS, variables d'environnement |
| Tests | Vitest (logique) + Playwright (parcours) + Lighthouse | section 8 du brief |

**Règles de sécurité appliquées partout**

- Les prix et le total sont **toujours recalculés côté serveur** à partir de la base. Le navigateur n'envoie que des identifiants de produits et des quantités.
- Une commande passe à « payée » **uniquement** quand le webhook Stripe (signature vérifiée) le confirme. Le stock est décrémenté à ce moment-là, dans une transaction.
- Validation serveur de tous les formulaires (Zod), anti-spam sur le contact (champ piège + limitation de débit), protection CSRF, en-têtes de sécurité.
- Clés secrètes **uniquement** dans `.env.local` (jamais dans le dépôt). Un fichier `.env.example` liste les noms des variables, sans les valeurs.
- Aucun cookie non essentiel avant consentement. Au départ, le site n'utilise que les cookies nécessaires (panier, session admin, Stripe).

---

## 3. Arborescence

```
/                      Accueil
/quiz                  Quiz « Quel Na Nah N'Hair es-tu ? »
/soins                 Les trois soins
/soins/fabulous        Fiche produit
/soins/miraculous      Fiche produit
/soins/luxurious       Fiche produit
/pack                  Pack des 3 soins
/boutique              Boutique (3 soins + pack)
/panier                Panier
/commande              Livraison (Colissimo / Mondial Relay) puis Stripe Checkout
/commande/merci        Confirmation après paiement
/mon-histoire          Page éditoriale
/faq                   FAQ
/contact               Formulaire de contact
/mentions-legales      Pages juridiques (contenu À COMPLÉTER / à relire)
/cgv
/confidentialite
/cookies
/retours               Retours et droit de rétractation
/admin                 Back-office protégé (connexion + double authentification)
  /admin/produits      prix, photos, stocks, activation
  /admin/commandes     statuts, numéro de suivi, export CSV, factures
  /admin/codes-promo
  /admin/livraison     transporteurs, tarifs, seuil de gratuité
  /admin/reglages      bandeau d'annonce
/api/checkout          création de la session Stripe (prix recalculés)
/api/webhooks/stripe   confirmation de paiement
/api/contact           formulaire de contact
sitemap.xml, robots.txt
```

**Organisation des fichiers**

```
assets/                 vos fichiers sources (images, fonts, logo) tels que livrés
public/images/          copies optimisées servies par le site
content/site.ts         TOUS les textes (produits, quiz, FAQ, histoire, bandeau, légal), un seul fichier
lib/design-tokens.ts    TOUTES les couleurs et typographies, un seul fichier
lib/quiz.ts             logique de points du quiz (testée)
lib/pricing.ts          calcul du panier, du pack, de la livraison, des codes promo (testé)
supabase/migrations/    schéma de la base
tests/                  tests automatisés
TODO-A-COMPLETER.md     liste de tous les À COMPLÉTER
GUIDE.md                guide en français : lancer, tester, modifier, publier
```

Textes et données sont séparés : les **textes** sont dans `content/site.ts` (facile à modifier, comme demandé dans INFOS). Les **prix, stocks et réglages** sont dans la base, modifiables dans le back-office. Les prix de départ de la base reprennent INFOS.

---

## 4. Modèle de données (Supabase)

| Table | Champs principaux |
|---|---|
| `products` | id, slug, nom, prix (centimes), stock, actif, type (`serum` / `pack`), photo |
| `pack_items` | pack_id, product_id, quantité (le pack = 1 Fabulous + 1 Miraculous + 1 Luxurious) |
| `orders` | numéro, email, nom, adresse, téléphone, transporteur, point relais, sous-total, livraison, remise, total, statut (`en_attente`, `payee`, `preparee`, `expediee`, `livree`, `annulee`), n° de suivi, n° de facture, id de session Stripe, dates |
| `order_items` | commande, produit, nom et prix **figés au moment de l'achat**, quantité |
| `promo_codes` | code, type (livraison offerte / % / montant), valeur, pays, date de fin, une seule fois par email, actif |
| `promo_redemptions` | code, email, commande (contrôle « une seule fois par cliente ») |
| `shipping_methods` | transporteur (Colissimo, Mondial Relay), tarif, délai, actif |
| `settings` | seuil de livraison offerte, texte du bandeau, texte de réserve NNH27 |
| `contact_messages` | nom, email, message, date |
| `admin_audit_log` | qui a fait quoi dans le back-office, quand |
| `error_log` | erreurs serveur (webhook, emails, paiement) |

Les données clientes (commandes, messages) sont accessibles **uniquement côté serveur**. La sécurité au niveau des lignes (RLS) de Supabase bloque tout accès public. Sauvegardes : sauvegardes quotidiennes de Supabase, plus un export manuel décrit dans le guide.

---

## 5. Étapes (phases du BRIEF §9), validation après chacune

| Phase | Contenu | Livrable à valider |
|---|---|---|
| 1. Plan | ce document + `TODO-A-COMPLETER.md` | ✅ maintenant |
| 2. Design system | tokens (couleurs, polices), composants (boutons, encadrés Lavender, cartes produits, bandeau, en-tête, pied de page), accueil complet | aperçu visuel et captures 375 px / tablette / ordinateur |
| 3. Pages vitrine | les trois soins, 3 fiches produits, pack, Mon histoire, FAQ | pages + captures |
| 4. Quiz | 5 questions, réponses mélangées, points, égalités, page résultat | quiz en ligne + tests (3 résultats, toutes les égalités, scores extrêmes) |
| 5. Boutique | Supabase, produits en base, panier persistant, back-office produits et stocks | démo + tests panier et prix |
| 6. Paiement et commandes | Stripe test, webhook, stock, emails Resend, statuts, suivi, export, factures PDF | parcours de test : réussi / refusé / abandonné |
| 7. Contact, juridique, RGPD, SEO | formulaire, pages légales (emplacements), bandeau cookies, sitemap, données structurées | tests du formulaire, audit SEO |
| 8. Recette finale | tous les tests de la section 8 + corrections | rapport de tests |
| 9. Mise en ligne | guide pas à pas (domaine, variables, Stripe en production) | **uniquement avec votre accord explicite** |

À chaque phase : branche Git dédiée, tests, rapport en français, puis j'attends votre validation.

---

## 6. Contradictions relevées et règle appliquée

| Sujet | BRIEF | INFOS (prime) | Appliqué |
|---|---|---|---|
| Prix | Miraculous 39,90 € / Luxurious 29,90 € | identique | identique. L'ancien site avait les prix inversés et un pack à 69,00 € : corrigé |
| Parfums, INCI | À COMPLÉTER | fournis | INFOS, INCI recopiées **à l'identique** |
| Fond et neutre | crème / blanc cassé ou jaune | fond blanc + encadrés Lavender | INFOS |
| Égalité du quiz | proposer le pack ou les deux soins | Miraculous gagne s'il est à égalité, sinon pack (Fabulous = Luxurious) | INFOS |
| Questions du quiz | 5 thèmes généraux | 5 questions détaillées | INFOS |
| Livraison | seuil À COMPLÉTER | offerte en France, seuil modifiable | INFOS |
| Bandeau | — | « Quel Na Nah N'Hair es-tu ? » → quiz, texte NNH27 en réserve | INFOS |
| **Allégations de pousse** | **interdit : « pas de promesse de pousse des cheveux »** | **Miraculous : « Stimule la pousse et la repousse », « Ralentit la chute » ; pack : « dire stop à la chute »** | **question 7.1, à trancher** |

---

## 7. Questions avant de commencer

1. **Allégations Miraculous.** INFOS prime, mais ces phrases sont précisément celles que BRIEF interdit. La réglementation cosmétique européenne (règlement 655/2013) exige qu'une allégation soit justifiée. « Stimule la pousse » et « stop à la chute » sont souvent considérées comme des allégations de type médicament. Je les affiche telles quelles avec une mention « à valider », ou j'attends une formulation validée par votre laboratoire ?
2. **Hébergement.** BRIEF impose Vercel, mais le site actuel est configuré pour Netlify. Je passe sur Vercel ?
3. **Photos et logo.** Le lien Drive n'est pas encore là. Le dépôt contient déjà des photos de flacons (Fabulous, Miraculous, Luxurious, trois produits ensemble) et des logos. Je les utilise en attendant, ou je mets des emplacements vides ?
4. **Polices des flacons.** En attendant, je garde Bebas Kai / Bebas Neue et Montserrat comme polices de remplacement ?
5. **Comptes.** Avez-vous déjà des comptes Stripe, Supabase, Resend et Vercel ? Sinon, je vous donne les étapes de création au moment de la phase concernée (aucune clé ne doit passer par le chat).
6. **Stock du pack.** Je propose que le pack n'ait pas de stock propre : il est disponible tant que les trois sérums le sont, et un pack vendu décrémente un exemplaire de chacun. D'accord ?
7. **Mondial Relay.** Le choix d'un point relais demande un compte professionnel Mondial Relay (identifiants pour leur widget). Avez-vous ce compte ? Sinon, je prépare l'emplacement.
8. **Prénom et photo pour « Mon histoire ».** Le texte est à la première personne : faut-il afficher votre prénom ou une photo de vous ? (sinon, emplacement À COMPLÉTER)
9. **Accès au back-office.** Qui doit y avoir accès (une ou plusieurs adresses email) ?
10. **Domaine.** L'email `Contact@nanahnhair.com` laisse penser que le domaine `nanahnhair.com` vous appartient. C'est bien celui du site ?
