// Commandes : enregistrées à la validation (« en attente de paiement »), payées à la confirmation de Stripe.
import { pack, products } from "@/content/site";
import { type Catalog, PACK_ITEMS, type ProductId, SERUM_IDS } from "@/lib/catalog";
import type { DeliveryAddress } from "@/lib/order";
import type { Quote } from "@/lib/pricing";
import type { CarrierId } from "@/lib/settings";

export type OrderStatus = "attente-paiement" | "payee" | "expediee" | "annulee";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  "attente-paiement": "En attente de paiement",
  payee: "Payée",
  expediee: "Expédiée",
  annulee: "Annulée",
};

export type OrderLine = { id: ProductId; name: string; quantity: number; unitCents: number; totalCents: number };

export type Order = {
  number: string;
  createdAt: string;
  status: OrderStatus;
  lines: OrderLine[];
  subtotalCents: number;
  shippingCents: number;
  freeShipping: boolean;
  totalCents: number;
  carrier: CarrierId;
  address: DeliveryAddress;
  // Preuve d'acceptation des CGV, rattachée à la commande et à la cliente
  cgv: { version: string; acceptedAt: string };
  payment?: { provider: "stripe"; sessionId: string; paidAt?: string; paymentIntent?: string };
  invoiceNumber?: string;
  shipping?: { shippedAt: string; tracking: string };
  emails?: { confirmationSentAt?: string; error?: string };
  // Clé du lien de facture envoyé à la cliente
  accessKey: string;
};

export const productLabel = (id: ProductId) => (id === "pack" ? pack.name : products.find((p) => p.slug === id)!.name);

export function orderFromQuote(input: {
  number: string;
  quote: Quote;
  carrier: CarrierId;
  address: DeliveryAddress;
  cgvVersion: string;
  accessKey: string;
  now?: Date;
}): Order {
  const at = (input.now ?? new Date()).toISOString();
  return {
    number: input.number,
    createdAt: at,
    status: "attente-paiement",
    lines: input.quote.lines.map((l) => ({ ...l, name: productLabel(l.id) })),
    subtotalCents: input.quote.subtotalCents,
    shippingCents: input.quote.shippingCents ?? 0,
    freeShipping: input.quote.freeShipping,
    totalCents: input.quote.totalCents,
    carrier: input.carrier,
    address: input.address,
    cgv: { version: input.cgvVersion, acceptedAt: at },
    accessKey: input.accessKey,
  };
}

// Stock après une commande payée : chaque sérum perd ses exemplaires vendus, seuls ou dans des packs.
// Un stock non suivi (null) le reste ; jamais en dessous de 0.
export function decrementStock(catalog: Catalog, lines: Array<{ id: ProductId; quantity: number }>): Catalog {
  const next = structuredClone(catalog);
  const packs = lines.filter((l) => l.id === "pack").reduce((n, l) => n + l.quantity, 0);
  for (const s of SERUM_IDS) {
    if (next[s].stock === null) continue;
    const sold = lines.filter((l) => l.id === s).reduce((n, l) => n + l.quantity, 0) + packs * PACK_ITEMS[s];
    next[s].stock = Math.max(0, next[s].stock - sold);
  }
  return next;
}

// Numéro de facture : F-AAAA-00001, à la suite, sans trou (compteur atomique dans le stockage)
export const invoiceNumber = (year: number, n: number) => `F-${year}-${String(n).padStart(5, "0")}`;

export const addressLine = (a: DeliveryAddress) => `${a.firstName} ${a.lastName}, ${a.address}, ${a.postalCode} ${a.city}`;
