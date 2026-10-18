// Calcul du panier : le même code sert à l'affichage et, côté serveur, au calcul qui fait foi.
import { availableQuantity, type Catalog, isProductId, PACK_ITEMS, type ProductId, SERUM_IDS } from "@/lib/catalog";
import type { CarrierId, ShopSettings } from "@/lib/settings";

export const MAX_QUANTITY_PER_LINE = 99;

export type CartItem = { id: ProductId; quantity: number };
export type QuoteLine = { id: ProductId; quantity: number; unitCents: number; totalCents: number };
export type QuoteError =
  | { code: "unknown-product"; id: string }
  | { code: "invalid-quantity"; id: ProductId }
  | { code: "unavailable"; id: ProductId }
  | { code: "insufficient-stock"; id: ProductId; available: number }
  | { code: "empty-cart" }
  | { code: "unknown-carrier" }
  | { code: "carrier-price-missing"; carrier: CarrierId };

export type Quote = {
  lines: QuoteLine[];
  subtotalCents: number;
  shippingCents: number | null; // null = pas encore de transporteur choisi ou tarif manquant
  freeShipping: boolean;
  totalCents: number;
  errors: QuoteError[];
};

// Nettoie un panier venu du navigateur : identifiants connus, quantités entières, doublons fusionnés
export function sanitizeCart(raw: unknown): { items: CartItem[]; errors: QuoteError[] } {
  const errors: QuoteError[] = [];
  const merged = new Map<ProductId, number>();
  if (!Array.isArray(raw)) return { items: [], errors: [{ code: "empty-cart" }] };
  for (const entry of raw) {
    const id = (entry as { id?: unknown })?.id;
    const quantity = (entry as { quantity?: unknown })?.quantity;
    if (!isProductId(id)) {
      errors.push({ code: "unknown-product", id: String(id) });
      continue;
    }
    if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY_PER_LINE) {
      errors.push({ code: "invalid-quantity", id });
      continue;
    }
    merged.set(id, Math.min((merged.get(id) ?? 0) + quantity, MAX_QUANTITY_PER_LINE));
  }
  return { items: [...merged].map(([id, q]) => ({ id, quantity: q })), errors };
}

// Vérifie le stock : un pack consomme un exemplaire de chaque sérum
export function stockErrors(catalog: Catalog, items: CartItem[]): QuoteError[] {
  const qty = (id: ProductId) => items.find((i) => i.id === id)?.quantity ?? 0;
  const errors: QuoteError[] = [];
  for (const item of items) {
    if (availableQuantity(catalog, item.id) === 0) {
      errors.push({ code: "unavailable", id: item.id });
      continue;
    }
    // Quantité maximale possible pour cette ligne, compte tenu des autres lignes
    let max = Infinity;
    for (const s of SERUM_IDS) {
      const stock = catalog[s].stock;
      if (stock === null) continue;
      if (item.id === s) max = Math.min(max, stock - qty("pack") * PACK_ITEMS[s]);
      if (item.id === "pack") max = Math.min(max, Math.floor((stock - qty(s)) / PACK_ITEMS[s]));
    }
    if (item.quantity > max) errors.push({ code: "insufficient-stock", id: item.id, available: Math.max(0, max) });
  }
  return errors;
}

export function computeQuote(
  catalog: Catalog,
  settings: ShopSettings,
  items: CartItem[],
  carrier?: CarrierId | null,
): Quote {
  const errors: QuoteError[] = [];
  if (items.length === 0) errors.push({ code: "empty-cart" });
  errors.push(...stockErrors(catalog, items));

  const lines = items.map((item) => {
    const unitCents = catalog[item.id].priceCents;
    return { id: item.id, quantity: item.quantity, unitCents, totalCents: unitCents * item.quantity };
  });
  const subtotalCents = lines.reduce((sum, l) => sum + l.totalCents, 0);
  const freeShipping = subtotalCents >= settings.freeShippingThresholdCents;

  let shippingCents: number | null = freeShipping ? 0 : null;
  if (carrier !== undefined && carrier !== null) {
    const c = settings.carriers[carrier];
    if (!c || !c.active) errors.push({ code: "unknown-carrier" });
    else if (!freeShipping) {
      if (c.priceCents === null) errors.push({ code: "carrier-price-missing", carrier });
      else shippingCents = c.priceCents;
    }
  }

  return {
    lines,
    subtotalCents,
    shippingCents,
    freeShipping,
    totalCents: subtotalCents + (shippingCents ?? 0),
    errors,
  };
}
