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
      "Le Fabulous Hair Serum est le soin quotidien essentiel pour des cheveux en pleine santé, doux et équilibrés.\n\nFormulé à base d’huiles végétales riches en vitamines E, il agit en profondeur pour réconforter le cuir chevelu et renforcer la fibre capillaire jour après jour.\n\nCe sérum aide à :\n✨ Gainer, hydrater et fortifier le cheveu\n✨ Améliorer la santé du cheveu\n✨ Diminuer les pellicules\n\nSa texture légère s’intègre parfaitement dans une routine simple et agréable, sans alourdir les cheveux, tout en leur apportant juste ce qu’il faut de nutrition et de soin.\n\nUtilisé au quotidien, le Fabulous Hair Serum devient le geste de base pour des cheveux plus sains, plus doux et naturellement éclatants.\n\n💛 Des cheveux nourris au quotidien.\n💛 Une chevelure en pleine santé.\n💛 Un cuir chevelu apaisé.",
    benefits: ["Gaine , hydrate et fortifie le cheveu", "Améliore la santé du cheveu", "Diminue les pellicules"],
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
      "Le Luxurious Hair Serum est le soin éclat par excellence, pensé pour sublimer les cheveux ternes, secs et abîmés.\n\nFormulé à base d’huiles végétales riches en vitamines C, il nourrit la fibre capillaire en profondeur et révèle une chevelure plus forte, souple et éclatante.\n\nCe sérum aide à :\n✨ Renforcer le cheveu terne, sec et abîmé\n✨ Améliorer la beauté du cheveu\n✨ Donner de la brillance\n✨ Donner du volume\n\n💛 Des cheveux brillants.\n💛 Plus de volume et de lumière.\n💛 Une beauté visible et ressentie.",
    benefits: ["Renforce le cheveu terne, sec et abîmé", "Améliore la beauté du cheveu", "Donne du volume et de la brillance"],
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
