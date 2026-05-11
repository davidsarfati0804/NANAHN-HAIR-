export type Product = {
  id: string;
  name: string;
  price: string;
  priceCents: number;
  scent: string;
  description: string;
  accent: string;
};

export const products: Product[] = [
  {
    id: "fabulous",
    name: "Fabulous Hair Serum",
    price: "19,90 €",
    priceCents: 1990,
    scent: "Monoï",
    description:
      "Le remix que tes cheveux attendaient pour retrouver souplesse, douceur et force.",
    accent: "Routine douce",
  },
  {
    id: "miraculous",
    name: "Miraculous Hair Serum",
    price: "29,90 €",
    priceCents: 2990,
    scent: "Patchouli",
    description:
      "Le remix que tes cheveux attendaient pour accompagner une routine capillaire fortifiante et pleine de vitalité.",
    accent: "Cure vitalité",
  },
  {
    id: "luxurious",
    name: "Luxurious Hair Serum",
    price: "39,90 €",
    priceCents: 3990,
    scent: "Fleur d’oranger",
    description:
      "Le remix que tes cheveux attendaient pour passer de l’ombre à la lumière et retrouver tout leur peps.",
    accent: "Glow final",
  },
];

export const pack = {
  id: "pack-zero-prise-de-tete",
  name: "Le pack zéro prise de tête",
  subtitle: "Le remix total 🎶",
  price: "69,00 €",
  priceCents: 6900,
  description:
    "L’expérience Na Nah N’hair complète. Un coffret conçu pour celles et ceux qui veulent tout : hydratation, vitalité et brillance.",
};
