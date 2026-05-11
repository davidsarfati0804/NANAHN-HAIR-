export type Product = {
  id: string;
  name: string;
  price: string;
  priceCents: number;
  scent: string;
  photoLabel: string;
  image: string;
  imagePosition: string;
  headline: string;
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
    photoLabel: "Photo 1 : Fabulous Hair Serum",
    image: "/images/products/fabulous-new.jpg",
    imagePosition: "50% 50%",
    headline: "Nutrition & force au quotidien ✨",
    description:
      "Le sérum qui nourrit, fortifie et aide tes cheveux à retrouver toute leur vitalité.",
    accent: "Nutrition & force",
  },
  {
    id: "miraculous",
    name: "Miraculous Hair Serum",
    price: "29,90 €",
    priceCents: 2990,
    scent: "Vanille Patchouli",
    photoLabel: "Photo 2 : Miraculous Hair Serum",
    image: "/images/products/miraculous.jpg",
    imagePosition: "50% 48%",
    headline: "Le boost pousse & anti-chute 🚀",
    description:
      "Stimule la pousse, ralentit la chute et redonne le bon tempo à tes cheveux.",
    accent: "Pousse & anti-chute",
  },
  {
    id: "luxurious",
    name: "Luxurious Hair Serum",
    price: "39,90 €",
    priceCents: 3990,
    scent: "Fleur d’oranger",
    photoLabel: "Photo 3 : Luxurious Hair Serum",
    image: "/images/products/luxurious.jpg",
    imagePosition: "50% 43%",
    headline: "Brillance miroir & volume aérien ✨",
    description:
      "Réveille les cheveux ternes, apporte du volume et une brillance lumineuse.",
    accent: "Brillance & volume",
  },
];

export const pack = {
  id: "pack-zero-prise-de-tete",
  name: "Le pack zéro prise de tête",
  subtitle: "Le remix total 🎶",
  price: "69,00 €",
  priceCents: 6900,
  description:
    "C'est l'expérience Na Nah N'hair complète. Un coffret conçu pour ceux qui veulent tout : la pousse, l'hydratation et la brillance.",
  photoLabel: "Photo des 3 produits ensemble au spa à Maurice",
  image: "/images/products/pack-spa.jpg",
};
