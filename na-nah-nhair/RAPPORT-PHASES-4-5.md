# Rapport — Phases 4 et 5 : quiz, boutique, panier, back-office

## Livré

### Phase 4 : quiz « Quel Na Nah N'Hair es-tu ? » (`/quiz`)

- Les 5 questions et réponses d'INFOS §10, mot pour mot ; une seule réponse par question ; bouton « Question précédente ».
- Ordre des réponses différent à chaque question (le premier soin proposé change : Miraculous, Luxurious, Fabulous, Miraculous, Luxurious).
- Points : 1 point par réponse, Miraculous 2 points aux questions 4 et 5.
- Égalités : Miraculous l'emporte dès qu'il est à égalité (y compris l'égalité parfaite 2-2-2) ; égalité Fabulous / Luxurious seule → pack.
- 4 pages résultat (`/quiz/resultat/fabulous|miraculous|luxurious|pack`) : personnalité, phrase, prix, « Ajouter au panier », bloc « Découvre aussi Miraculous, mon produit fondateur », message final « Et si tu étais les trois ? Découvre toute la collection. », « Refaire le quiz ».

### Phase 5 : boutique

- **Boutique** (`/boutique`) : 3 soins + pack, ajout au panier, mention « Épuisé ».
- **« Ajouter au panier »** fonctionnel partout : fiches (avec quantité), pack, boutique, résultats du quiz.
- **Panier** (`/panier`) : persistant (conservé après fermeture, synchronisé entre onglets), +/−, retirer, totaux, livraison, erreurs de stock nommées.
- **Commande** (`/commande`) : choix Colissimo / Mondial Relay, total **recalculé par le serveur**. Le bouton « Payer » attend Stripe (phase 6).
- **Stock** : le pack n'a pas de stock propre, il consomme un exemplaire de chaque sérum ; impossible de dépasser le stock, même en combinant sérums et packs.
- **Back-office** (`/admin`) :
  - connexion par mot de passe haché (scrypt) + code de double authentification (application type Google Authenticator) ;
  - 5 essais ratés par IP (50 au total) → blocage 15 minutes ; déconnexion qui invalide la session côté serveur ;
  - produits : prix, stock, mise en vente, photo (JPEG / PNG / WebP, 4 Mo, contenu vérifié) ;
  - livraison : seuil de livraison offerte, tarifs et activation des transporteurs (contrôles de cohérence) ;
  - journal des actions et des erreurs.
- **Données** : Netlify Blobs en ligne (inclus dans Netlify), dossier `.data/` en local. Remplaçable par Supabase sans toucher aux pages.
- **Sécurité** : prix jamais pris du navigateur, validation serveur, protection CSRF (Next.js), en-têtes CSP / HSTS / anti-clickjacking, taille des requêtes limitée.

## Recette par 4 agents de test indépendants

| Agent | Résultat | Corrigé |
|---|---|---|
| Contenu et quiz | 243/243 parcours du quiz conformes ; prix, INCI, textes conformes à INFOS ; aucun contenu inventé | majuscules, délai « préparation À COMPLÉTER » affiché, À COMPLÉTER visibles dans la FAQ fermée, textes déplacés dans `content/site.ts`, typographie française (espaces insécables) |
| Boutique | parcours, totaux au centime, API résistante | **stock partagé sérum + pack non contrôlé dans le panier**, messages d'erreur imprécis, transporteur sans tarif, tous transporteurs désactivés, séparateur de milliers, doublon d'erreur |
| Sécurité | actions admin, CSRF, uploads, secrets : solides | **critique : les données du back-office étaient incluses dans la redirection d'un visiteur non connecté** ; contournement de la limitation par X-Forwarded-For ; CSP / HSTS ; taille des requêtes ; déconnexion côté serveur |
| Ergonomie / accessibilité | axe WCAG AA : 0 violation ; 0 erreur console | titres qui débordaient (320 / 768 px), focus invisible sur fond violet, ancres FAQ sous l'en-tête, accueil 768–1023 px, zones tactiles 44 px, Échap ferme le menu, page active « Les soins » |

Défauts trouvés par mes propres tests pendant les corrections : formulaires du back-office qui réaffichaient les anciennes valeurs après enregistrement, et effaçaient les saisies en cas d'erreur. Corrigés.

## Tests finaux

| Suite | Résultat |
|---|---|
| Tests automatiques (`npm test`) : quiz 243 combinaisons et égalités, prix, pack, stock partagé, livraison, sécurité (hash, session, TOTP RFC 6238, limitation, révocation), stockage, contenu = INFOS/BRIEF, contrastes | ✅ 74/74 |
| Navigateur (`npm run test:e2e`) : quiz (7 scénarios + clavier), panier, commande, API, back-office (accès refusé, fuite de données, cookie falsifié, déconnexion, prix, stock, épuisé, photo, livraison), en-têtes de sécurité, 18 pages à 320 / 375 / 768 / 900 / 1280 px, accessibilité WCAG AA sur 16 pages | ✅ 71/71, deux exécutions complètes |

## À arbitrer par vous

1. Résultat « pack » du quiz : texte proposé « Fabulous et Luxurious à égalité » / « Tu as autant de Fabulous que de Luxurious en toi : le pack réunit les trois soins. » (non fourni par INFOS).
2. Résultat Miraculous : le bloc « Découvre aussi Miraculous » apparaît aussi (INFOS : « sur toutes les pages résultat »). Je le garde ou je le masque sur ce résultat ?
3. Stock initial de chaque sérum (à saisir dans le back-office ; vide = non suivi).

## Reste à faire (phases suivantes)

- Phase 6 : paiement Stripe (compte Stripe nécessaire), commandes, emails, factures, codes promo.
- Phase 7 : contact, pages juridiques, cookies, SEO.
- Point relais Mondial Relay : compte Mondial Relay nécessaire.
