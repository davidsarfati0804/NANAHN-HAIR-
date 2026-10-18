import "server-only";
import { type ProductId, type PublicProduct, toPublic } from "@/lib/catalog";
import { getCatalog, getSettings } from "@/lib/store";

// Prix, disponibilités et photos à jour, pour les pages rendues sur le serveur
export async function getShopData(): Promise<{
  products: Record<ProductId, PublicProduct>;
  freeShipping: boolean;
  freeShippingThresholdCents: number;
}> {
  const [catalog, settings] = await Promise.all([getCatalog(), getSettings()]);
  return {
    products: toPublic(catalog),
    freeShipping: settings.freeShippingThresholdCents === 0,
    freeShippingThresholdCents: settings.freeShippingThresholdCents,
  };
}
