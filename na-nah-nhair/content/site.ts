// TOUS les textes du site NA NAH N'HAIR (demande INFOS.md : un seul fichier de contenu).
// Sources : INFOS.md (prioritaire) et BRIEF.md. Ne rien inventer.
// Une valeur `null` = information manquante : le site affiche « À COMPLÉTER : … ».

import type { ProductTheme } from "@/lib/design-tokens";

export const brand = {
  name: "NA NAH N'HAIR",
  logoLines: ["NA", "NAH", "N'HAIR !"],
  signature: "Révèle ton Na Nah N'Hair.",
  marketingConcept: "Quel Na Nah N'Hair es-tu ?",
  madeIn: "Made in France",
};

export const announcement = {
  text: "Quel Na Nah N'Hair es-tu ?",
  href: "/quiz",
  // Texte gardé en réserve (INFOS §1 et §11), à réactiver si la livraison redevient payante
  reserveText:
    "Révèle ton Na Nah N'hair ! — Livraison offerte pour la première commande avec le code NNH27",
};

export const navigation = [
  { label: "Accueil", href: "/" },
  { label: "Le quiz", href: "/quiz" },
  { label: "Les soins", href: "/soins" },
  { label: "Boutique", href: "/boutique" },
  { label: "Mon histoire", href: "/mon-histoire" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const emotionalConcept = {
  title: "« Je ne suis pas qu'une seule femme. »",
  lines: ["Je suis Fabulous.", "Je suis Miraculous.", "Je suis Luxurious.", "Je suis les trois."],
  note: "Les personnalités ne sont pas des catégories exclusives : une cliente peut être les trois.",
};

export type Product = {
  slug: ProductTheme;
  name: string;
  shortName: string;
  price: string;
  photo: { file: string; alt: string; available: boolean };
  personality: string;
  universe: string;
  scent: string;
  text: string;
  phrase: string;
  highlights: string[];
  description: {
    intro: string;
    vitamins: string;
    helpsTitle: string;
    helps: string[];
    outro: string | null;
  };
  inci: string;
  inciNotes: string[];
  usage: string | null;
  precautions: string | null;
  volume: string;
  founder?: boolean;
};

const inciNotes = [
  "* Ingrédients issus de l'agriculture biologique",
  "** Allergènes dus à la présence de parfum",
];

export const products: Product[] = [
  {
    slug: "fabulous",
    name: "FABULOUS HAIR SERUM",
    shortName: "Fabulous",
    price: "19,90 €",
    photo: {
      file: "fabulous.jpg",
      alt: "Flacon du Fabulous Hair Serum, 30 ml",
      available: false,
    },
    personality: "la fraîche, naturelle et spontanée.",
    universe: "vert, frais, positif, accessible et pétillant.",
    scent: "monoï",
    text: "elle aime prendre soin de ses cheveux sans se compliquer la vie.",
    phrase: "« Simplement moi, simplement Fabulous. »",
    highlights: [
      "Gaine, hydrate et fortifie le cheveu",
      "Améliore la santé du cheveu",
      "Diminue les pellicules",
    ],
    description: {
      intro:
        "Le Fabulous Hair Serum est le soin quotidien essentiel pour des cheveux en pleine santé, doux et équilibrés.",
      vitamins:
        "Formulé à base d'huiles végétales riches en vitamines E, il agit en profondeur pour réconforter le cuir chevelu et renforcer la fibre capillaire jour après jour.",
      helpsTitle: "Ce sérum aide à :",
      helps: [
        "Gainer, hydrater et fortifier le cheveu",
        "Améliorer la santé du cheveu",
        "Diminuer les pellicules",
      ],
      outro:
        "Sa texture légère s'intègre parfaitement dans une routine simple et agréable, sans alourdir les cheveux, tout en leur apportant juste ce qu'il faut de nutrition et de soin. Utilisé au quotidien, le Fabulous Hair Serum devient le geste de base pour des cheveux plus sains, plus doux et naturellement éclatants.",
    },
    inci: "RICINUS COMMUNIS SEED OIL*, OLEA EUROPAEA FRUIT OIL*, COCOS NUCIFERA OIL*, PERSEA GRATISSIMA OIL*, BRASSICA NIGRA SEED OIL*, SIMMONDSIA CHINENSIS SEED OIL*, BRASSICA OLERACEA ITALICA SEED OIL*, VITIS VINIFERA SEED OIL, EMBLICA OFFICINALIS FRUIT POWDER*, FRAGRANCE, TOCOPHEROL, HELIANTHUS ANNUUS SEED OIL, BENZYL SALICYLATE**, ALPHA-HEXYLCINNAMALDEHYDE**, D-CITRONELLOL**, D-LIMONENE**, GERANIOL**, LINALOOL**, BENZYL BENZOATE**, CITRAL**, EUGENOL**, ISOEUGENOL**",
    inciNotes,
    usage: null,
    precautions: null,
    volume: "30 ml",
  },
  {
    slug: "miraculous",
    name: "MIRACULOUS HAIR SERUM",
    shortName: "Miraculous",
    price: "39,90 €",
    photo: {
      file: "miraculous.jpg",
      alt: "Flacon du Miraculous Hair Serum, 30 ml",
      available: false,
    },
    personality: "la déterminée, ambitieuse et audacieuse.",
    universe: "violet, confiance, force, ambition et transformation.",
    scent: "vanille patchouli",
    text: "c'est mon produit fondateur. L'histoire de ma marque a commencé avec cette envie de créer une synergie capillaire pour aider une femme à prendre soin de ses cheveux.",
    phrase: "« Je crois en mon objectif. »",
    highlights: [
      "Stimule la pousse et la repousse",
      "Ralentit la chute du cheveu",
      "Diminue les fourches",
    ],
    description: {
      intro:
        "Le Miraculous Hair Serum est une cure capillaire intensive pensée pour accompagner les cheveux en phase de fragilité, de chute ou de ralentissement de pousse.",
      vitamins:
        "Formulé à base d'huiles végétales riches en vitamines B, il agit comme un véritable boost naturel pour le cuir chevelu et la fibre capillaire.",
      helpsTitle: "Ce sérum aide à :",
      helps: [
        "Stimuler la pousse et la repousse des cheveux",
        "Ralentir la chute capillaire",
        "Réduire l'apparition des fourches",
      ],
      outro:
        "Sa texture douce et sensorielle pénètre facilement le cuir chevelu pour nourrir, revitaliser et réactiver l'énergie du cheveu dès la racine. Utilisé en cure, il devient un véritable rituel de transformation.",
    },
    inci: "RICINUS COMMUNIS SEED OIL*, OLEA EUROPAEA FRUIT OIL*, COCOS NUCIFERA OIL*, PERSEA GRATISSIMA OIL*, BRASSICA NIGRA SEED OIL*, SIMMONDSIA CHINENSIS SEED OIL*, BRASSICA OLERACEA ITALICA SEED OIL*, VITIS VINIFERA SEED OIL, EMBLICA OFFICINALIS FRUIT POWDER*, FRAGRANCE, TOCOPHEROL, HELIANTHUS ANNUUS SEED OIL, CITRAL**, COUMARIN**, BENZYL BENZOATE**, D-LIMONENE**, LINALOOL**",
    inciNotes,
    usage: null,
    precautions: null,
    volume: "30 ml",
    founder: true,
  },
  {
    slug: "luxurious",
    name: "LUXURIOUS HAIR SERUM",
    shortName: "Luxurious",
    price: "29,90 €",
    photo: {
      file: "luxurious.jpg",
      alt: "Flacon du Luxurious Hair Serum, 30 ml",
      available: false,
    },
    personality: "la féminine, élégante et sensorielle.",
    universe: "rose, beauté, plaisir, sophistication et douceur.",
    scent: "fleur d'oranger",
    text: "elle aime sentir bon, se sentir belle et transformer sa routine capillaire en un moment de plaisir.",
    phrase: "« Parce que je mérite ce petit luxe. »",
    highlights: [
      "Renforce le cheveu terne, sec et abîmé",
      "Améliore la beauté du cheveu",
      "Donne du volume et de la brillance",
    ],
    description: {
      intro:
        "Le Luxurious Hair Serum est le soin éclat par excellence, pensé pour sublimer les cheveux ternes, secs et abîmés.",
      vitamins:
        "Formulé à base d'huiles végétales riches en vitamines C, il nourrit la fibre capillaire en profondeur et révèle une chevelure plus forte, souple et éclatante.",
      helpsTitle: "Ce sérum aide à :",
      helps: [
        "Renforcer le cheveu terne, sec et abîmé",
        "Améliorer la beauté du cheveu",
        "Donner de la brillance",
        "Donner du volume",
      ],
      outro: null,
    },
    inci: "RICINUS COMMUNIS SEED OIL*, OLEA EUROPAEA FRUIT OIL*, COCOS NUCIFERA OIL*, PERSEA GRATISSIMA OIL*, BRASSICA NIGRA SEED OIL*, SIMMONDSIA CHINENSIS SEED OIL*, BRASSICA OLERACEA ITALICA SEED OIL*, VITIS VINIFERA SEED OIL, EMBLICA OFFICINALIS FRUIT POWDER*, FRAGRANCE, TOCOPHEROL, HELIANTHUS ANNUUS SEED OIL, ALPHA-HEXYLCINNAMALDEHYDE**, CITRAL**, D-LIMONENE**, GERANIOL**",
    inciNotes,
    usage: null,
    precautions: null,
    volume: "30 ml",
  },
];

// Ordre d'affichage côte à côte : Fabulous, Miraculous, Luxurious
export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);

export const pack = {
  slug: "pack",
  name: "PACK DES 3 SOINS",
  price: "69,90 €",
  photo: {
    file: "pack.jpg",
    alt: "Les trois sérums NA NAH N'HAIR ensemble, au spa à Maurice",
    available: false,
  },
  contentTitle: "Contenu du pack",
  content: [
    { product: "Fabulous", text: "pour gainer, fortifier et apaiser ton cuir chevelu." },
    { product: "Miraculous", text: "pour stimuler la pousse et dire stop à la chute." },
    { product: "Luxurious", text: "pour la touche finale, le volume et la brillance miroir." },
  ],
  usageTitle: "Mode d'emploi du pack",
  usage:
    "alterne les sérums selon tes besoins ou crée ta propre routine : Miraculous en cure, Fabulous au quotidien, et Luxurious pour briller en sortie.",
};

export const story = {
  title: "Mon histoire",
  paragraphs: [
    "Je suis naturopathe et diplômée en aromathérapie.",
    "En première année de naturopathie, lors d'un stage en clinique, j'accompagnais une femme qui souhaitait prendre soin de ses cheveux et favoriser leur longueur. J'ai relevé le défi en préparant une synergie personnalisée pour elle.",
    "Cette expérience m'a donné envie d'aider d'autres personnes et de créer mes propres soins capillaires. J'ai commencé mes préparations dans ma chambre, sur mon bureau.",
    "J'aime aider les autres, me rendre utile et savoir qu'une petite action de ma part peut apporter de la satisfaction à quelqu'un.",
    "C'est ainsi qu'est née l'idée de NA NAH N'HAIR : trois soins, trois univers, une même envie de permettre aux femmes de prendre soin de leurs cheveux tout en révélant différentes facettes de leur personnalité.",
  ],
};

export const home = {
  hero: {
    title: brand.logoLines,
    signature: brand.signature,
    subtitle: "Trois soins. Trois personnalités. Une seule question : lequel est le tien ?",
    primaryCta: { label: "Je découvre mon Na Nah N'Hair", href: "/quiz" },
    secondaryCta: { label: "Découvrir les trois soins", href: "/soins" },
  },
  trio: {
    kicker: "Trois soins, trois personnalités",
    title: "Lequel est le tien ?",
    cta: "Voir la fiche",
  },
  products: {
    kicker: "Les soins",
    title: "Les trois soins",
    scentLabel: "Odeur",
    volumeLabel: "Contenance",
  },
  pack: {
    kicker: "Le pack",
    cta: "Découvrir le pack",
  },
  story: {
    kicker: "Mon histoire",
    cta: "Lire mon histoire",
  },
  // Faits repris d'INFOS.md uniquement
  reasons: {
    title: "Pourquoi découvrir NA NAH N'HAIR",
    items: [
      { title: "Made in France", text: null },
      {
        title: "Créés par une naturopathe",
        text: "Je suis naturopathe et diplômée en aromathérapie.",
      },
      {
        title: "Huiles végétales",
        text: "Fabulous : huiles végétales riches en vitamines E. Miraculous : huiles végétales riches en vitamines B. Luxurious : huiles végétales riches en vitamines C.",
      },
      {
        title: "Trois parfums",
        text: "Monoï, vanille patchouli et fleur d'oranger.",
      },
      {
        title: "Livraison offerte en France",
        text: "Délai : 3 jours ouvrés.",
      },
    ] as Array<{ title: string; text: string | null }>,
  },
  finalCta: {
    title: "Et si tu étais les trois ?",
    text: "Découvre toute la collection.",
    cta: { label: "Aller à la boutique", href: "/boutique" },
  },
};

export const legal = {
  brand: "NA NAH N'HAIR",
  siret: "922 151 170 00011",
  address: "24 rue Octave Feuillet, 75016 Paris",
  phone: "01 80 18 29 29",
  email: "Contact@nanahnhair.com",
  companyStatus: null,
  vat: null,
  host: "Netlify", // coordonnées à confirmer
  publicationManager: null,
  instagram: null,
};

export const footer = {
  legalLinks: [
    { label: "Mentions légales", href: "/mentions-legales" },
    { label: "CGV", href: "/cgv" },
    { label: "Politique de confidentialité", href: "/confidentialite" },
    { label: "Politique cookies", href: "/cookies" },
    { label: "Retours et droit de rétractation", href: "/retours" },
  ],
  contactTitle: "Contact",
  followTitle: "Instagram",
};

// Pages pas encore construites : phase du brief où elles arrivent
export const upcomingPages: Record<string, { title: string; phase: string }> = {
  quiz: { title: "Quel Na Nah N'Hair es-tu ?", phase: "Phase 4 : quiz" },
  soins: { title: "Les trois soins", phase: "Phase 3 : pages vitrine" },
  pack: { title: "Pack des 3 soins", phase: "Phase 3 : pages vitrine" },
  boutique: { title: "Boutique", phase: "Phase 5 : boutique" },
  panier: { title: "Panier", phase: "Phase 5 : boutique" },
  "mon-histoire": { title: "Mon histoire", phase: "Phase 3 : pages vitrine" },
  faq: { title: "FAQ", phase: "Phase 3 : pages vitrine" },
  contact: { title: "Contact", phase: "Phase 7 : contact et juridique" },
  "mentions-legales": { title: "Mentions légales", phase: "Phase 7 : contact et juridique" },
  cgv: { title: "Conditions générales de vente", phase: "Phase 7 : contact et juridique" },
  confidentialite: { title: "Politique de confidentialité", phase: "Phase 7 : contact et juridique" },
  cookies: { title: "Politique cookies", phase: "Phase 7 : contact et juridique" },
  retours: { title: "Retours et droit de rétractation", phase: "Phase 7 : contact et juridique" },
};
