// Réglages boutique modifiables dans le back-office
export type CarrierId = "colissimo" | "mondial-relay";

export type ShopSettings = {
  // Livraison offerte à partir de ce montant (centimes). 0 = toujours offerte (décision INFOS §11).
  freeShippingThresholdCents: number;
  carriers: Record<CarrierId, { label: string; priceCents: number | null; active: boolean }>;
  // Franchise en base de TVA (modification 53) : false = « TVA non applicable, article 293 B du CGI »
  vatApplicable: boolean;
};

export function seedSettings(): ShopSettings {
  return {
    freeShippingThresholdCents: 0,
    vatApplicable: false,
    carriers: {
      // Tarifs : À COMPLÉTER (INFOS §11)
      colissimo: { label: "Colissimo", priceCents: null, active: true },
      // Mondial Relay désactivé à l'ouverture (28/10/2026) : à réactiver dans le back-office quand le compte
      // et le choix du point relais seront prêts
      "mondial-relay": { label: "Mondial Relay (point relais)", priceCents: null, active: false },
    },
  };
}
