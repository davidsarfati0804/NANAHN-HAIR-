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
  fullDescription: string;
  benefits: string[];
  usage: string;
  inciTitle: string;
  category: "nutrition" | "pousse" | "brillance";
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
    fullDescription:
      "Fabulous Hair Serum est le geste quotidien pour les cheveux qui ont besoin de nutrition, de confort et de tenue. Sa texture huile accompagne le massage du cuir chevelu et aide les longueurs à retrouver un toucher plus souple.",
    benefits: ["Nourrit les longueurs", "Fortifie la routine", "Aide à apaiser le cuir chevelu"],
    usage:
      "Applique quelques gouttes dans les mains, chauffe la matière puis masse le cuir chevelu ou répartis sur les longueurs. Ajuste la quantité selon ta densité de cheveux.",
    inciTitle: "PARFUM MONOI",
    category: "nutrition",
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
    fullDescription:
      "Miraculous Hair Serum est pensé comme une cure ciblée pour accompagner les périodes où les cheveux manquent de vitalité. Il s’intègre facilement dans une routine massage régulière.",
    benefits: ["Accompagne la pousse", "Aide à ralentir la chute", "Réveille le cuir chevelu"],
    usage:
      "Utilise en cure, idéalement le soir. Dépose quelques gouttes sur le cuir chevelu, masse par mouvements circulaires, puis laisse poser selon ta routine.",
    inciTitle: "PARFUM VANILLE PATCHOULI",
    category: "pousse",
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
    fullDescription:
      "Luxurious Hair Serum est la touche finition de la routine Na Nah N’hair. Il apporte un rendu plus lumineux, aide à discipliner les longueurs et donne une impression de volume plus aérien.",
    benefits: ["Apporte de la brillance", "Aide à discipliner", "Finition volume léger"],
    usage:
      "Applique une petite quantité sur les longueurs et pointes en finition. Commence par peu de matière, puis ajoute si nécessaire.",
    inciTitle: "PARFUM FLEUR ORANGER",
    category: "brillance",
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
