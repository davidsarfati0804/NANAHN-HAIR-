# Intégration Stripe — Na Nah N'hair
*Plan d'action complet — à suivre dans l'ordre*

---

## Prérequis

- Un compte Stripe créé sur stripe.com (gratuit)
- Accès au dashboard Stripe pour récupérer les clés API
- Node.js installé (déjà le cas)

---

## ÉTAPE 1 — Créer le compte Stripe et récupérer les clés

1. Va sur https://stripe.com et crée un compte
2. Dans le dashboard Stripe → **Développeurs → Clés API**
3. Copie :
   - `Publishable key` → commence par `pk_test_...`
   - `Secret key` → commence par `sk_test_...`
4. Ces clés sont en mode **test** pour commencer (aucun vrai paiement)

---

## ÉTAPE 2 — Installer le SDK Stripe

Dans le terminal, à la racine du projet :

```bash
npm install stripe @stripe/stripe-js
```

- `stripe` → SDK serveur (API routes Next.js)
- `@stripe/stripe-js` → SDK client (optionnel ici car on utilise Stripe Checkout)

---

## ÉTAPE 3 — Créer le fichier `.env.local`

Créer un fichier `.env.local` à la racine du projet (jamais commité sur Git) :

```env
STRIPE_SECRET_KEY=COLLE_ICI_TA_CLE_SECRETE_STRIPE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=COLLE_ICI_TA_CLE_PUBLIQUE_STRIPE
NEXT_PUBLIC_SITE_URL=http://localhost:3005
```

Remplacer les valeurs par tes vraies clés copiées depuis le dashboard Stripe.

> ⚠️ Vérifier que `.env.local` est bien dans `.gitignore` (c'est le cas par défaut avec Next.js)

---

## ÉTAPE 4 — Créer les produits dans Stripe

Dans le dashboard Stripe → **Catalogue produits → Ajouter un produit** :

| Produit | Prix |
|---------|------|
| Fabulous Hair Serum | 19,90 € — paiement unique |
| Miraculous Hair Serum | 29,90 € — paiement unique |
| Luxurious Hair Serum | 39,90 € — paiement unique |
| Le pack zéro prise de tête | 69,00 € — paiement unique |

Pour chaque produit, Stripe génère un **Price ID** (commence par `price_...`).
Copier ces Price IDs — ils seront utilisés dans le code.

---

## ÉTAPE 5 — Ajouter les Price IDs dans `data/products.ts`

Ajouter un champ `stripePriceId` à chaque produit :

```ts
// Dans data/products.ts
{
  id: "fabulous",
  stripePriceId: "price_XXXXXXXXXXXXXXXXXXXXXXXX",
  // ... reste des champs
}
```

Et pareil pour `pack` dans le même fichier.

---

## ÉTAPE 6 — Créer l'API route Stripe Checkout

Créer le fichier `app/api/checkout/route.ts` :

```ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { items } = await req.json();
  // items = [{ stripePriceId: "price_xxx", quantity: 1 }, ...]

  const line_items = items.map((item: { stripePriceId: string; quantity: number }) => ({
    price: item.stripePriceId,
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/commande-confirmee?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/panier`,
    locale: "fr",
    shipping_address_collection: {
      allowed_countries: ["FR", "BE", "CH", "LU"],
    },
    phone_number_collection: { enabled: true },
  });

  return NextResponse.json({ url: session.url });
}
```

---

## ÉTAPE 7 — Modifier le CartProvider pour déclencher le checkout

Dans `components/ecommerce/CartProvider.tsx`, ajouter une fonction `checkout` qui :

1. Transforme les items du panier en tableau `[{ stripePriceId, quantity }]`
2. Appelle `POST /api/checkout`
3. Redirige vers l'URL Stripe retournée

```ts
const checkout = async () => {
  const items = cart.map((item) => ({
    stripePriceId: item.stripePriceId,
    quantity: item.quantity,
  }));

  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });

  const { url } = await res.json();
  window.location.href = url;
};
```

---

## ÉTAPE 8 — Ajouter le bouton "Payer" sur la page panier

Dans `components/ecommerce/CartPageClient.tsx` (ou la page panier) :

- Remplacer le texte placeholder par un bouton **"Payer maintenant"**
- Ce bouton appelle la fonction `checkout()` du CartProvider
- Afficher un état de chargement pendant la redirection

---

## ÉTAPE 9 — Créer la page de confirmation

Créer `app/commande-confirmee/page.tsx` :

- Affiche un message de remerciement
- Récupère optionnellement les détails de la commande via `session_id` (nom, montant)
- Propose un lien retour vers la boutique

```
URL après paiement : /commande-confirmee?session_id=cs_test_xxx
```

---

## ÉTAPE 10 — Tester en mode test

Stripe fournit des cartes de test :

| Carte | Numéro | Résultat |
|-------|--------|---------|
| Visa | `4242 4242 4242 4242` | Paiement réussi |
| Refusée | `4000 0000 0000 0002` | Paiement refusé |
| 3D Secure | `4000 0025 0000 3155` | Authentification requise |

- Date d'expiration : n'importe quelle date future
- CVC : n'importe quels 3 chiffres
- Code postal : n'importe lequel

Faire un test complet : ajouter un produit → panier → payer → page confirmation → vérifier dans le dashboard Stripe.

---

## ÉTAPE 11 — Passer en mode production

Quand les tests sont validés :

1. Dans le dashboard Stripe → activer le compte (fournir les infos légales de la société)
2. Remplacer dans `.env.local` les clés `pk_test_` et `sk_test_` par les clés **live** (`pk_live_` et `sk_live_`)
3. Recréer les produits en mode live (ou les dupliquer depuis le mode test)
4. Mettre à jour `NEXT_PUBLIC_SITE_URL` avec l'URL de production (ex: `https://nanahnhair.fr`)
5. Sur Netlify/Vercel : ajouter les variables d'environnement dans les settings du projet

---

## ÉTAPE 12 — Configurer les emails Stripe (optionnel mais recommandé)

Dans Stripe → **Paramètres → Emails** :
- Activer l'envoi automatique du reçu de paiement au client
- Personnaliser avec le logo et le nom Na Nah N'hair
- Ajouter l'email de support (`contact@nanahnhair.fr`)

---

## ÉTAPE 13 — Webhook Stripe (optionnel — pour gestion avancée)

Si tu veux recevoir les événements Stripe côté serveur (confirmation de paiement, remboursement…) :

1. Créer `app/api/webhook/route.ts`
2. Dans le dashboard Stripe → **Développeurs → Webhooks → Ajouter un endpoint**
3. URL : `https://nanahnhair.fr/api/webhook`
4. Écouter l'événement `checkout.session.completed`

> Ce point est facultatif pour un lancement. À faire si tu veux automatiser la gestion des commandes.

---

## Récapitulatif des fichiers à créer / modifier

| Action | Fichier |
|--------|---------|
| Créer | `.env.local` |
| Modifier | `data/products.ts` — ajouter `stripePriceId` |
| Créer | `app/api/checkout/route.ts` |
| Modifier | `components/ecommerce/CartProvider.tsx` — ajouter `checkout()` |
| Modifier | `components/ecommerce/CartPageClient.tsx` — bouton paiement |
| Créer | `app/commande-confirmee/page.tsx` |

**Total : 3 fichiers créés, 3 fichiers modifiés.**

---

## Ordre d'exécution recommandé

```
1. Compte Stripe + clés API         (5 min)
2. npm install stripe                (1 min)
3. .env.local                        (2 min)
4. Produits dans Stripe + Price IDs (10 min)
5. data/products.ts                  (5 min)
6. app/api/checkout/route.ts         (15 min)
7. CartProvider checkout()           (15 min)
8. CartPageClient bouton payer       (10 min)
9. Page confirmation                 (15 min)
10. Tests avec cartes de test        (20 min)
11. Passage en production            (15 min)
```

**Durée totale estimée : ~2 heures**
