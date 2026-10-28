# Recette : conformité légale et RGPD (NA NAH N'HAIR / BIOTYVIE)

Date : 28/10/2026. Serveur de production local http://localhost:3200. Aucun fichier du projet modifié.
Scripts, captures et résultats bruts : `/tmp/claude-0/-home-user-nanahn-hair-/cbc784ff-bc8e-5b19-b2fe-76bd78d2564a/scratchpad/recette/agent-juridique/` (`audit.cjs`, `audit.json`, `bandeau.png`, `commande.png`, `commande-apres.png`, `produit-*.png`, `cgv.txt`, `form.txt`).

Légende : **[C]** constaté (code lu, test Playwright ou commande exécutée) · **[S]** supposé (non vérifiable depuis le conteneur).
Ce rapport ne constitue pas un avis juridique : les points marqués « professionnel » sont **à faire valider par un professionnel** (avocat, expert-comptable, ou personne responsable / évaluateur de la sécurité pour la cosmétique).

Effet de bord du test : une commande de test (sans paiement) a créé la preuve d'acceptation `NNH-20261028-0E3C73` dans le stockage local de recette (`scratchpad/recette/data/`).

---

## 1. Ce qui est conforme (bref)

- **Garde-fou de mise en ligne [C]** : `npm run verifier:mise-en-ligne` sort en code 1 avec 8 points ; `netlify.toml` l'exécute dans `[context.production]` avant `npm run build`. Points connus, listés sans détail :
  - `content/juridique/cgv-v1.md:3` (projet + date), `:107` (médiateur) ;
  - `content/juridique/mentions-legales.md:3` (projet), `:36` (médiateur) ;
  - `content/juridique/confidentialite.md:3`, `cookies.md:3` (projet + date) ;
  - `content/juridique/retractation.md:3`, `textes-boutique.md:3` (projet).
  Ses limites sont détaillées en 2.2.
- **Mentions légales (LCEN) [C]** : dénomination, forme, capital, RCS, SIRET, siège, email, téléphone, directrice de la publication et nom + adresse de l'hébergeur sont présents. Les numéros SIREN et SIRET passent le contrôle de format (Luhn) ; leur existence n'a pas pu être vérifiée [S].
- **Mention « TVA non applicable, article 293 B du CGI » [C]** : présente dans le pied de page des 18 pages testées, dans le panier, dans le récapitulatif de commande, dans l'email de confirmation (`lib/emails/confirmation.ts:29`) et sur la facture (`lib/invoices/invoice.ts:60`). Plus aucun « TTC ».
- **Tunnel de commande (L221-14, L221-5) [C]** :
  - le bouton s'intitule « Commander et payer » ;
  - la case CGV n'est pas pré-cochée ; sans elle, la commande est refusée côté client (message) et côté serveur (`app/api/commande/route.ts:28`) ;
  - le récapitulatif affiche produits, quantités, prix, livraison « Offerte », total, mention TVA, adresse et délai ;
  - le droit de rétractation et les frais de retour sont rappelés juste avant le bouton.
- **Zone de livraison [C]** : un code postal 97200 est refusé avec le message « France métropolitaine, Corse comprise » ; 20000 (Corse) est accepté (`lib/order.ts:20`). Le téléphone est bien facultatif (client et serveur).
- **Preuve d'acceptation des CGV [C]** : la date, la version (`v1`) et le numéro de commande sont enregistrés (`lib/store/index.ts:158-162`). Les CGV sont versionnées (`content/juridique/index.ts:6`, fichier `cgv-v1.md`, PDF `cgv-v1.pdf`).
- **Rétractation [C]** :
  - délai de 14 jours à compter de la réception ;
  - frais de retour à la charge de la cliente, annoncés ;
  - remboursement sous 14 jours, avec faculté de différer ;
  - le formulaire type reprend les rubriques de l'annexe à l'art. R221-1 et existe en page web et en PDF.
- **Garantie des vices cachés [C]** : correctement présentée (CGV art. 9).
- **Plateforme européenne de RLL [C]** : retirée des CGV. Cela paraît cohérent avec la fermeture de la plateforme ODR en 2025 (règlement (UE) 2024/3228) ; à confirmer par un professionnel.
- **PDF [C]** : `cgv-v1.pdf` et `formulaire-de-retractation.pdf` sont identiques mot pour mot aux `.md` actuels (comparaison texte automatique : 0 ligne absente). Ils sont servis en 200 `application/pdf`.
- **Cookies et consentement [C]** (Playwright, contexte vierge, 18 pages) :
  - avant tout choix : 0 cookie, `localStorage` vide, **0 requête vers un domaine tiers** ;
  - après « Refuser » : seulement `nnh-consentement = refuse|<horodatage>` ;
  - après « Accepter » et une navigation sur 4 pages : toujours 0 cookie et 0 requête tierce ;
  - « Refuser » et « Accepter » sont au même niveau ;
  - « Gérer mes cookies » (pied de page) efface le choix et réaffiche le bandeau ;
  - la page /cookies propose « Modifier mon choix » ;
  - le choix expire après 182 jours (`lib/consent.ts:8`), conforme aux « 6 mois » annoncés ;
  - le tableau des cookies correspond au code : `nnh-panier-v1` (`components/cart/CartProvider.tsx:7`), `nnh_admin` 8 h (`lib/auth.ts:7`, `lib/auth-core.ts:25`) ;
  - les polices sont auto-hébergées et la CSP est `default-src 'self'`.
- **Pied de page [C]** : Mentions légales · CGV · Rétractation · Confidentialité · Cookies + « Gérer mes cookies » présents sur les 18 pages testées (dont panier et commande).
- **Accessibilité [C]** : axe-core (WCAG 2.1 A/AA) ne trouve **aucune violation** sur /mentions-legales, /cgv, /retractation, /confidentialite, /cookies, /commande et /contact. Toutes les pages ont `lang="fr"` et un seul h1.
- **Formulaire de contact [C]** : une mention courte avec lien vers /confidentialite. Données collectées : nom, email, sujet, message. L'adresse IP n'est utilisée que pour limiter les envois et elle est purgée après 1 h (`lib/auth-core.ts:110-117`).
- **Fiches produits [C]** : liste INCI complète, renvois `*` (bio) et `**` (allergènes), précautions d'emploi (dans le bloc « Mode d'emploi », `content/site.ts:114-118`), contenance 30 ml et prix sont affichés. Le quiz n'enregistre rien (aucun stockage dans le code).

---

## 2. Écarts et manques

### 2.1 🔴 Bloquants

| # | Écart | Où | Preuve | Référence |
|---|---|---|---|---|
| R1 | **Le paiement n'est pas branché, mais « Commander et payer » enregistre une commande.** La cliente reçoit un numéro de commande et le message « conditions générales de vente acceptées » ; rien n'est encaissé. Cela contredit CGV art. 4-5 (« commande ferme après confirmation du paiement », Stripe) et la confidentialité. | `app/api/commande/route.ts:13-42`, `components/cart/Checkout.tsx:297-301`, `content/site.ts:796` | [C] Test : « Commande n° NNH-20261028-0E3C73 : conditions générales de vente acceptées (version v1). Le paiement en ligne (carte, Apple Pay, Google Pay) arrive bientôt. » (`commande-apres.png`). Aucune occurrence de Stripe dans le code. | C. conso. L221-14 (obligation de paiement), L111-1 / R111-1 (modalités de paiement), cohérence avec les CGV |
| R2 | **Aucune confirmation sur support durable n'est envoyée.** L'email (récapitulatif + CGV + formulaire en PDF) est prêt, mais aucun service d'envoi n'est branché. Les CGV art. 4 promettent pourtant cet email. | `lib/emails/confirmation.ts:1-3`, TODO « Envoi des emails » | [C] Aucun service d'envoi dans `package.json`, ni d'appel à `confirmationEmail` depuis une route | C. conso. L221-13 |
| R3 | **Médiateur de la consommation absent** (connu, bloqué par le garde-fou) | `cgv-v1.md:107`, `mentions-legales.md:36` | [C] | C. conso. L612-1, L616-1, R616-1 |
| R4 | **Mondial Relay est proposé, mais la sélection du point relais n'existe pas.** Une commande Mondial Relay ne pourrait pas être livrée comme promis (CGV art. 6, FAQ). Le garde-fou ne le détecte pas. | `components/cart/Checkout.tsx:148-153` | [C] « À COMPLÉTER : sélection du point relais » s'affiche quand Mondial Relay est choisi ; l'API accepte quand même la commande (`route.ts:34`) | Exécution du contrat (L216-1), cohérence avec les CGV |
| R5 | **Allégations « Stimule la pousse et la repousse », « Ralentit la chute du cheveu », « cure… phase de chute »** sur les fiches, le pack **et l'étiquette du flacon** (visible sur la photo d'accueil). Deux risques : allégation non justifiée, et requalification en médicament par présentation ou par fonction. Sans dossier de preuves validé, c'est bloquant. | `content/site.ts:191-192, 197, 202-203, 281` ; photo `miraculous.png` | [C] Textes affichés sur /soins/miraculous et /pack ; [S] dossier de preuves non vu | Règl. (CE) 1223/2009 art. 20 ; règl. (UE) 655/2013 (critères communs : preuves, véracité) ; CSP L5111-1. Professionnel (réglementaire cosmétique) |

### 2.2 🟠 Importants

| # | Écart | Où | Preuve | Référence |
|---|---|---|---|---|
| O1 | **Prestataires de la confidentialité ≠ prestataires réels** | `confidentialite.md:27-29` | [C] Le site n'utilise ni Supabase, ni Resend, ni Stripe : grep vide, hormis un commentaire « en attendant Supabase » (`lib/store/index.ts:11`). Les données (messages, preuves CGV) sont stockées dans **Netlify Blobs**, alors que Netlify n'est cité que comme « hébergement du site ». Colissimo et Mondial Relay ne reçoivent aujourd'hui aucune donnée (pas d'intégration) [C]. | RGPD art. 13.1.e-f (destinataires, transferts) |
| O2 | **Garantie légale de conformité incomplète** par rapport au contenu réglementaire attendu. Manquent : réduction du prix ou résolution du contrat, prolongation de 6 mois après réparation, renouvellement en cas de remplacement imposé, suspension du paiement, mention de l'amende. | `cgv-v1.md:83` (texte fourni par la marque, non réécrit) | [C] | C. conso. L211-2, D211-2 et son annexe (décret 2022-424), L217-3 et s. Professionnel |
| O3 | **« Renvoyer le soin neuf, non utilisé, dans son emballage d'origine »** présenté comme une condition de la rétractation. Hors exception légale, l'usage n'ouvre droit qu'à une déduction pour dépréciation. Si la marque veut exclure les produits descellés (hygiène), il faut le dire explicitement et prévoir un scellé. Formulation également dans la FAQ et l'email. | `cgv-v1.md:73`, `retractation.md:18`, `content/site.ts:627`, `lib/emails/confirmation.ts:42` | [C] | C. conso. L221-23, L221-28 3°, L221-5 6°. Professionnel |
| O4 | **Délai de remboursement de la FAQ moins favorable** : « dans les 14 jours suivant la réception du colis », alors que la loi et les CGV disent 14 jours à compter de l'information de la décision (report possible jusqu'à récupération). | `content/site.ts:627` | [C] /faq | C. conso. L221-24 |
| O5 | **Zone de livraison incohérente** : la FAQ dit « France uniquement » et « commandes en France » ; la boutique dit « Livraison offerte en France ». Or les DOM-TOM sont refusés au paiement. | `content/site.ts:604, 608`, `shop.freeShipping` (`content/site.ts:737`) | [C] | L111-1 / L221-5 (restrictions de livraison à indiquer au plus tard au début du processus de commande, art. L221-5 et R111-1) |
| O6 | **Délai annoncé dans l'email ≠ CGV** : email « sera préparée sous 3 jours ouvrés » ; CGV « livrées sous 3 jours ouvrés, préparation incluse ». Le texte source `textes-boutique.md` contient la même phrase : il est à corriger par la marque. | `lib/emails/confirmation.ts:36`, `textes-boutique.md` | [C] | Cohérence contractuelle (L216-1) |
| O7 | **Téléphone de l'hébergeur absent** ; adresse Netlify à confirmer [S]. | `mentions-legales.md:24` | [C] absence ; [S] adresse | LCEN (loi 2004-575), obligations d'identification de l'hébergeur |
| O8 | **Preuve d'acceptation non rattachée à la cliente.** On enregistre seulement {numéro, date, version}. L'identité, l'email et le contenu de la commande ne sont pas conservés (« aucune autre donnée n'est conservée », `route.ts:15`). La preuve est donc peu exploitable. Pour les commandes de 120 € ou plus, l'écrit doit être conservé 10 ans. | `lib/store/index.ts:158`, `app/api/commande/route.ts:41` | [C] fichier `cgv-acceptations_NNH-20261028-0E3C73` = `{orderNumber, acceptedAt, cgvVersion}` | C. civ. 1366-1367 ; C. conso. L213-1, D213-1 |
| O9 | **Facture incomplète, et non branchée** : | `lib/invoices/invoice.ts:20-61` | [C] | CGI art. 242 nonies A ; C. com. L441-9. Professionnel |
| | – pas de numérotation séquentielle (le numéro est passé de l'extérieur, aucun générateur) ; | | | |
| | – pas de date de vente / livraison distincte ; | | | |
| | – nouvelles mentions de la réforme 2026 (catégorie « livraison de biens », adresse de livraison) à vérifier par l'expert-comptable [S]. | | | |
| O10 | **Pas d'information RGPD au point de collecte de la commande** : aucun lien vers /confidentialite près du formulaire adresse / email / téléphone (seulement CGV et Rétractation). | `components/cart/Checkout.tsx:155-185, 277-287` | [C] texte de /commande | RGPD art. 13 ; recommandations CNIL |
| O11 | **Limites du garde-fou** : il ne lit que `content/juridique/*.md`, `lib/emails/*.ts` et le pied de page. Il ne détecte pas : | `scripts/verifier-mise-en-ligne.mjs:17-25` | [C] « À COMPLÉTER » visibles en production sur /soins/fabulous, /soins/miraculous et /soins/luxurious, alors que le garde-fou ne liste que des pages légales | — |
| | – les PDF (`public/documents`) : si un `.md` change sans `npm run pdf:juridique`, un PDF obsolète partirait en pièce jointe ; | | | |
| | – la FAQ produit « À COMPLÉTER : FAQ … » visible sur les 3 fiches ; | | | |
| | – le point relais (R4) ; | | | |
| | – `lib/invoices`. | | | |
| O12 | **INCI : le terme « FRAGRANCE »** est utilisé ; l'étiquetage UE prévoit « PARFUM ». Noms « D-LIMONENE », « D-CITRONELLOL », « EMBLICA OFFICINALIS » à contrôler sur CosIng [S]. À vérifier aussi sur l'emballage. | `content/site.ts:166, 209, 255` | [C] texte affiché | Règl. 1223/2009 art. 19.1.g et 33 (glossaire). Personne responsable |
| O13 | **Cosmétique : obligations hors site non vérifiables** [S] : | — | [S] | Règl. 1223/2009 art. 4, 10, 11, 13, 19 |
| | – personne responsable et son adresse sur l'emballage ; | | | |
| | – DIP et rapport de sécurité ; | | | |
| | – notification CPNP ; | | | |
| | – n° de lot, PAO / DDM, contenance, fonction et précautions sur l'étiquette. | | | |
| O14 | **Autres allégations à justifier** : « Diminue les pellicules », « Diminue les fourches », « Made in France », « Ingrédients issus de l'agriculture biologique ». | `content/site.ts:18, 124, 150, 193, 312, 363` | [C] textes ; [S] justificatifs | Règl. 655/2013 ; C. conso. L121-2 (pratiques trompeuses) |

### 2.3 🟢 Confort

| # | Écart | Où | Preuve |
|---|---|---|---|
| V1 | Le tableau des cookies présente « nnh-consentement » comme un cookie : c'est du `localStorage` (contrairement au panier, qui est bien qualifié). | `cookies.md:15` | [C] |
| V2 | Le bandeau propose Accepter / Refuser alors qu'aucun traceur optionnel n'existe : ce n'est pas illégal, mais c'est à revoir si Stripe.js est chargé sur le site. Avec une page Stripe hébergée (Checkout), il n'y a pas de cookie sur le domaine du site [S]. La CSP devra être élargie (`next.config.ts:9`). | `ConsentBanner.tsx`, `cookies.md:18` | [C]/[S] |
| V3 | Confidentialité : il manque les directives post-mortem (loi 78-17, art. 85), le caractère obligatoire ou non des données (RGPD 13.2.e) et l'IP conservée 1 h pour l'anti-spam. Les messages de contact sont plafonnés à 1 000 sans purge automatique après 3 ans (suppression manuelle dans le back-office). | `confidentialite.md`, `lib/store/index.ts:133-147` | [C] |
| V4 | Dans le PDF des CGV et du formulaire, le nom de marque est dessiné (glyphes) : il est absent du texte extrait, et le PDF n'est pas balisé (« Tagged: no »). | `public/documents/*.pdf` | [C] `cgv.txt` : « BIOTYVIE (    ) » |
| V5 | Si le seuil de livraison offerte est modifié dans le back-office (`lib/settings.ts:14`), les CGV art. 6 (« offerte pour toute commande ») deviennent fausses. | `lib/settings.ts` | [C] |
| V6 | Les codes postaux non attribués (ex. 00000) sont acceptés. | `lib/order.ts:20` | [C] |
| V7 | Le garde-fou ne s'applique qu'au contexte `production` : les deploy previews et branch deploys restent publics, avec des textes « projet ». | `netlify.toml` | [C] |

---

## 3. À mettre en place avant l'ouverture

| Action | Qui | Lié à |
|---|---|---|
| Choisir et adhérer à un médiateur de la consommation, puis compléter CGV art. 14 et mentions légales | **Marque** | R3 |
| Brancher le paiement Stripe : commande ferme seulement après paiement, CSP élargie, et cookies/confidentialité mis à jour selon l'intégration | **Développeur** | R1, V2 |
| Brancher l'envoi de l'email de confirmation (avec PDF) et l'appeler à la confirmation du paiement | **Développeur** (+ choix du service par la marque) | R2 |
| Désactiver Mondial Relay (back-office) ou intégrer le choix du point relais | **Marque / développeur** | R4 |
| Dossier de preuves des allégations (pousse, repousse, chute, pellicules, fourches, bio, Made in France) ; décision sur leur maintien sur le site **et** l'étiquette | **Marque + professionnel** (réglementaire cosmétique / personne responsable) | R5, O14 |
| Vérifier personne responsable, DIP, rapport de sécurité, CPNP, étiquetage, INCI (« PARFUM ») | **Marque + professionnel** | O12, O13 |
| Relecture juridique : garantie de conformité (encadré réglementaire), clause « neuf, non utilisé », dépréciation, exception d'hygiène | **Professionnel** | O2, O3 |
| Aligner la FAQ (zone de livraison, délai de remboursement) et l'email (« préparée » / « livrée ») sur les CGV : textes à fournir par la marque | **Marque** | O4, O5, O6 |
| Confirmer les coordonnées complètes de l'hébergeur (adresse, téléphone) | **Marque** (+ professionnel) | O7 |
| Mettre à jour la liste des prestataires (Netlify Blobs comme stockage ; retirer ou ajouter Supabase, Resend, Stripe selon la réalité) et les durées de conservation | **Marque + développeur**, validation **professionnel** | O1, V3 |
| Rattacher la preuve d'acceptation à la commande payée (email, identité, contenu, montant, version CGV) et la conserver 10 ans | **Développeur** | O8 |
| Factures : numérotation séquentielle sans trou, date de vente, mentions validées par l'expert-comptable, génération à la confirmation du paiement | **Développeur + expert-comptable** | O9 |
| Ajouter un lien « politique de confidentialité » dans le formulaire de commande | **Développeur** (texte : marque) | O10 |
| Étendre le garde-fou aux PDF, aux fiches produits (FAQ « À COMPLÉTER »), au checkout et à `lib/invoices` | **Développeur** | O11 |
| Renseigner les dates, retirer les mentions « Projet de texte », relancer `npm run pdf:juridique`, puis `npm run verifier:mise-en-ligne` | **Marque puis développeur** | garde-fou |
