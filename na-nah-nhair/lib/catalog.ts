// Données de vente (prix, stock, activation) : modifiables dans le back-office.
// Les textes restent dans content/site.ts.
import { pack, products } from "@/content/site";
import { parsePrice } from "@/lib/money";

export const SERUM_IDS = ["fabulous", "miraculous", "luxurious"] as const;
export type SerumId = (typeof SERUM_IDS)[number];
export type ProductId = SerumId | "pack";
export const PRODUCT_IDS: ProductId[] = [...SERUM_IDS, "pack"];

export type CatalogProduct = {
  id: ProductId;
  priceCents: number;
  // null = stock non renseigné (non suivi). Le pack n'a pas de stock propre.
  stock: number | null;
  active: boolean;
  // Photo envoyée depuis le back-office (clé du stockage), sinon photo du dossier assets
  photoKey: string | null;
};

export type Catalog = Record<ProductId, CatalogProduct>;

// Composition du pack (décision du 18/10/2026) : un exemplaire de chaque sérum
export const PACK_ITEMS: Record<SerumId, number> = { fabulous: 1, miraculous: 1, luxurious: 1 };

export function seedCatalog(): Catalog {
  const entries = products.map((p) => [
    p.slug,
    { id: p.slug, priceCents: parsePrice(p.infosPrice), stock: null, active: true, photoKey: null },
  ]);
  return {
    ...Object.fromEntries(entries),
    pack: { id: "pack", priceCents: parsePrice(pack.infosPrice), stock: null, active: true, photoKey: null },
  } as Catalog;
}

export function isProductId(id: unknown): id is ProductId {
  return typeof id === "string" && (PRODUCT_IDS as string[]).includes(id);
}

// Quantité encore vendable d'un produit (null = illimité, stock non suivi)
export function availableQuantity(catalog: Catalog, id: ProductId): number | null {
  const product = catalog[id];
  if (!product.active) return 0;
  if (id !== "pack") return product.stock;
  let min: number | null = null;
  for (const serum of SERUM_IDS) {
    const s = catalog[serum];
    if (!s.active) return 0;
    if (s.stock === null) continue;
    const possible = Math.floor(s.stock / PACK_ITEMS[serum]);
    min = min === null ? possible : Math.min(min, possible);
  }
  return min;
}

// Version publique du catalogue (ce que le navigateur reçoit)
export type PublicProduct = {
  id: ProductId;
  priceCents: number;
  available: number | null;
  photoUrl: string | null;
};

export function toPublic(catalog: Catalog): Record<ProductId, PublicProduct> {
  return Object.fromEntries(
    PRODUCT_IDS.map((id) => [
      id,
      {
        id,
        priceCents: catalog[id].priceCents,
        available: availableQuantity(catalog, id),
        photoUrl: catalog[id].photoKey ? `/media/${catalog[id].photoKey}` : null,
      },
    ]),
  ) as Record<ProductId, PublicProduct>;
}
