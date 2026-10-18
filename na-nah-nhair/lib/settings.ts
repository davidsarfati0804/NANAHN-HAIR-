// Réglages boutique modifiables dans le back-office
export type CarrierId = "colissimo" | "mondial-relay";

export type ShopSettings = {
  // Livraison offerte à partir de ce montant (centimes). 0 = toujours offerte (décision INFOS §11).
  freeShippingThresholdCents: number;
  carriers: Record<CarrierId, { label: string; priceCents: number | null; active: boolean }>;
};

export function seedSettings(): ShopSettings {
  return {
    freeShippingThresholdCents: 0,
    carriers: {
      // Tarifs : À COMPLÉTER (INFOS §11)
      colissimo: { label: "Colissimo", priceCents: null, active: true },
      "mondial-relay": { label: "Mondial Relay (point relais)", priceCents: null, active: true },
    },
  };
}
