// TOUS les textes du site NA NAH N'HAIR (demande INFOS.md : un seul fichier de contenu).
// Sources : INFOS.md (prioritaire) et BRIEF.md. Ne rien inventer.
// Une valeur `null` = information manquante : le site affiche « À COMPLÉTER : … ».

import type { ProductTheme } from "@/lib/design-tokens";
import { fr } from "@/lib/typography";

export const brand = fr({
  name: "NA NAH N'HAIR",
  // Logo fourni (assets/logo/logo-na-nah-nhair.jpg), utilisé tel quel dans l'en-tête
  logo: { src: "/images/logo-na-nah-nhair.jpg", width: 1772, height: 1772, alt: "Na Nah N’hair !" },
  // Même logo vectorisé (scripts/vectoriser-logo.py), pour le grand titre de l'accueil
  logoSvg: { src: "/images/logo-na-nah-nhair.svg", width: 1403, height: 987 },
  // Nom de marque tel qu'écrit sur le logo
  displayName: "Na Nah N’hair",
  signature: "Révèle ton Na Nah N'Hair.",
  marketingConcept: "Quel Na Nah N'Hair es-tu ?",
  madeIn: "Made in France",
});

export const announcement = fr({
  text: "Quel Na Nah N'Hair es-tu ?",
  href: "/quiz",
  // Texte gardé en réserve (INFOS §1 et §11), à réactiver si la livraison redevient payante
  reserveText:
    "Révèle ton Na Nah N'hair ! — Livraison offerte pour la première commande avec le code NNH27",
});

export const navigation = fr([
  { label: "Accueil", href: "/" },
  { label: "Le quiz", href: "/quiz" },
  { label: "Les soins", href: "/soins" },
  { label: "Boutique", href: "/boutique" },
  { label: "Mon histoire", href: "/mon-histoire" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
]);

export const emotionalConcept = fr({
  // Citation sans guillemets, pour le manifeste de la page Mon histoire (manifeste.html fourni)
  quote: "Je ne suis pas qu’une seule femme.",
  title: "« Je ne suis pas qu’une seule femme. »",
  lines: ["Je suis Fabulous.", "Je suis Miraculous.", "Je suis Luxurious.", "Je suis les trois."],
});

export type Product = {
  slug: ProductTheme;
  name: string;
  shortName: string;
  // Prix INFOS.md : valeur initiale du catalogue (le prix affiché vient du back-office)
  infosPrice: string;
  photo: { file: string; alt: string; available: boolean };
  personality: string;
  // Phrase à la première personne affichée sur les cartes et les fiches (modification 1, 20/10/2026)
  iAm: string;
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
  usage: UsageGuide | null;
  precautions: string | null;
  volume: string;
  founder?: boolean;
};

// Mode d'emploi (textes et illustrations fournis le 20/10/2026 : assets/sources/mode-emploi-*/)
export type UsageGuide = {
  steps: Array<{
    title: string;
    text: { before: string; strong: string; after: string };
    image: { src: string; width: number; height: number };
  }>;
  precautions: Array<{ icon: string; text: string }>;
  badge: { icon: string; label: string };
};

function usageGuide(productName: string, folder: string): UsageGuide {
  const img = (name: string) => `/images/${folder}/${name}.png`;
  return {
    steps: [
      {
        title: "Étape 1",
        text: {
          before: "Appliquer ",
          strong: productName,
          after:
            " des racines vers les pointes. Pour un soin complet, 3 pipettes sont nécessaires : sur le cuir chevelu, les longueurs et les pointes.",
        },
        image: { src: img("etape1-application"), width: 370, height: 384 },
      },
      {
        title: "Étape 2",
        text: {
          before: "",
          strong: "",
          after: "Laver les cheveux avec un shampoing classique. Pour un résultat optimal, utiliser le soin 3 fois par semaine.",
        },
        image: { src: img("etape2-shampoing"), width: 262, height: 288 },
      },
    ],
    precautions: [
      { icon: img("icone-coloration"), text: "Ne pas utiliser le soin les 2 jours qui précèdent et qui suivent une coloration." },
      { icon: img("icone-yeux"), text: "Éviter tout contact avec les yeux." },
      { icon: img("icone-externe"), text: "Usage externe uniquement." },
    ],
    badge: { icon: img("icone-nuit-jour"), label: "Nuit & jour" },
  };
}

const inciNotes = [
  "* Ingrédients issus de l'agriculture biologique",
  "** Allergènes dus à la présence de parfum",
];

export const products: Product[] = fr([
  {
    slug: "fabulous",
    name: "FABULOUS HAIR SERUM",
    shortName: "Fabulous",
    infosPrice: "19,90 €",
    photo: {
      file: "fabulous.jpg",
      alt: "Flacon du Fabulous Hair Serum, 30 ml",
      available: false,
    },
    personality: "la fraîche, naturelle et spontanée.",
    iAm: "Je suis fraîche, naturelle et spontanée.",
    universe: "vert, frais, positif, accessible et pétillant.",
    scent: "Monoï",
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
    usage: usageGuide("Fabulous Hair Serum", "mode-emploi-fabulous"),
    precautions: null,
    volume: "30 ml",
  },
  {
    slug: "miraculous",
    name: "MIRACULOUS HAIR SERUM",
    shortName: "Miraculous",
    infosPrice: "39,90 €",
    photo: {
      file: "miraculous.jpg",
      alt: "Flacon du Miraculous Hair Serum, 30 ml",
      available: false,
    },
    personality: "la déterminée, ambitieuse et audacieuse.",
    iAm: "Je suis déterminée, ambitieuse et audacieuse.",
    universe: "violet, confiance, force, ambition et transformation.",
    scent: "Vanille patchouli",
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
    usage: usageGuide("Miraculous Hair Serum", "mode-emploi"),
    precautions: null,
    volume: "30 ml",
    founder: true,
  },
  {
    slug: "luxurious",
    name: "LUXURIOUS HAIR SERUM",
    shortName: "Luxurious",
    infosPrice: "29,90 €",
    photo: {
      file: "luxurious.jpg",
      alt: "Flacon du Luxurious Hair Serum, 30 ml",
      available: false,
    },
    personality: "la féminine, élégante et sensorielle.",
    iAm: "Je suis féminine, élégante et sensorielle.",
    universe: "rose, beauté, plaisir, sophistication et douceur.",
    scent: "Fleur d’oranger",
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
    usage: usageGuide("Luxurious Hair Serum", "mode-emploi-luxurious"),
    precautions: null,
    volume: "30 ml",
  },
]);

// Ordre d'affichage côte à côte : Fabulous, Miraculous, Luxurious
export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);

export const pack = fr({
  slug: "pack",
  name: "PACK DES 3 SOINS",
  infosPrice: "69,90 €",
  photo: {
    file: "pack.jpg",
    alt: "Les trois sérums NA NAH N'HAIR ensemble, au spa à Maurice",
    available: false,
  },
  contentTitle: "Contenu du pack",
  contentShort: "Fabulous + Miraculous + Luxurious",
  content: [
    // Textes de la modification 4 (20/10/2026)
    { product: "Fabulous", text: "Pour gainer, hydrater et fortifier le cheveu." },
    { product: "Miraculous", text: "Pour stimuler la pousse et la repousse du cheveu et ralentir la chute." },
    { product: "Luxurious", text: "Pour la touche finale, le volume et la brillance miroir." },
  ],
  usageTitle: "Mode d’emploi du pack",
  usage:
    "Alterne les sérums selon tes besoins ou crée ta propre routine : Miraculous en cure, Fabulous au quotidien et Luxurious pour briller en sortie.",
});

export const story = fr({
  title: "Mon histoire",
  paragraphs: [
    "Je suis naturopathe et diplômée en aromathérapie.",
    "En première année de naturopathie, lors d'un stage en clinique, j'accompagnais une femme qui souhaitait prendre soin de ses cheveux et favoriser leur longueur. J'ai relevé le défi en préparant une synergie personnalisée pour elle.",
    "Cette expérience m'a donné envie d'aider d'autres personnes et de créer mes propres soins capillaires. J'ai commencé mes préparations dans ma chambre, sur mon bureau.",
    "J'aime aider les autres, me rendre utile et savoir qu'une petite action de ma part peut apporter de la satisfaction à quelqu'un.",
    "C'est ainsi qu'est née l'idée de NA NAH N'HAIR : trois soins, trois univers, une même envie de permettre aux femmes de prendre soin de leurs cheveux tout en révélant différentes facettes de leur personnalité.",
  ],
});

export const home = fr({
  hero: {
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
  // Section « Mon histoire » en trois cartes (textes de la modification 6, 20/10/2026)
  story: {
    kicker: "Mon histoire",
    titleLines: ["De mon bureau", "à ta routine"],
    sticker: "Naturopathe · Aromathérapie",
    regionLabel: "Mon histoire en trois cartes",
    swipeHint: "glisse pour la suite →",
    dotLabel: (n: number) => `Afficher la carte ${n}`,
    cards: [
      {
        title: "Le défi",
        text: "Première année de naturopathie, stage en clinique. Une femme souhaite prendre soin de ses cheveux et favoriser leur longueur. J’ai relevé le défi : une synergie sur mesure, rien que pour elle.",
      },
      {
        title: "Le bureau",
        text: "Mes premières préparations sont nées dans ma chambre, sur mon bureau.",
      },
      {
        title: "Les trois soins",
        text: "Trois soins, trois univers, une même envie : prendre soin de tes cheveux.",
      },
    ],
    photo: { file: "histoire.jpg", alt: "Mes premières préparations sur mon bureau", available: false },
    cta: { label: "Découvrir les trois soins", href: "/soins" },
    readMore: { label: "Lire toute mon histoire", href: "/mon-histoire" },
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
        text: null,
        lines: [
          { product: "Fabulous", text: "Huiles végétales riches en vitamines E." },
          { product: "Miraculous", text: "Huiles végétales riches en vitamines B." },
          { product: "Luxurious", text: "Huiles végétales riches en vitamines C." },
        ],
      },
      {
        title: "Trois parfums",
        text: "Monoï, Vanille patchouli et Fleur d’oranger.",
      },
      {
        title: "Livraison offerte en France",
        text: "Délai : 3 jours ouvrés, préparation incluse.",
      },
    ] as Array<{ title: string; text: string | null; todo?: string; lines?: Array<{ product: string; text: string }> }>,
  },
  finalCta: {
    title: "Et si tu étais les trois ?",
    text: "Découvre toute la collection.",
    cta: { label: "Aller à la boutique", href: "/boutique" },
  },
});

export const legal = fr({
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
});

export const footer = fr({
  legalLinks: [
    { label: "Mentions légales", href: "/mentions-legales" },
    { label: "CGV", href: "/cgv" },
    { label: "Politique de confidentialité", href: "/confidentialite" },
    { label: "Politique cookies", href: "/cookies" },
    { label: "Retours et droit de rétractation", href: "/retours" },
  ],
  contactTitle: "Contact",
  followTitle: "Instagram",
});


export const seo = fr({
  description: "Trois soins. Trois personnalités. Une seule question : lequel est le tien ?",
  faqDescription: "Utilisation, composition, précautions, livraison, retours et commandes.",
});

export const legalTexts = fr({
  cookieChoiceTitle: "Ton choix concernant les cookies",
  contactLink: "Une question ? Contacte-nous",
});

export const consentTexts = fr({
  label: "Cookies",
  text: "Ce site n'utilise que le stockage nécessaire à son fonctionnement (ton panier). Aucun cookie publicitaire ni de mesure d'audience.",
  accept: "Accepter",
  refuse: "Refuser",
  more: "En savoir plus",
  reset: "Modifier mon choix",
  current: (choice: string) => `Ton choix actuel : ${choice}.`,
  accepted: "accepté",
  refused: "refusé",
  none: "aucun choix enregistré",
});

export const contactTexts = fr({
  title: "Contact",
  intro: "Une question sur un soin, une commande ou la livraison ? Écris-nous.",
  name: "Nom",
  email: "Email",
  subject: "Sujet",
  subjects: ["Une commande", "Les soins", "Autre"],
  message: "Message",
  submit: "Envoyer",
  sending: "Envoi…",
  success: "Merci ! Ton message a bien été envoyé. Nous te répondrons rapidement.",
  privacy: "Tes informations servent uniquement à te répondre. Voir la politique de confidentialité.",
  coordinatesTitle: "Coordonnées",
  instagramTitle: "Instagram",
  errors: {
    name: "Indique ton nom (2 à 100 caractères).",
    email: "Indique une adresse email valide.",
    subject: "Choisis un sujet.",
    message: "Ton message doit contenir entre 10 et 3 000 caractères.",
    spam: "Message refusé. Réessaie dans quelques instants.",
    rate: "Trop de messages envoyés. Réessaie plus tard.",
    server: "Le message n'a pas pu être envoyé. Écris-nous directement par email.",
  },
});

export const shareTexts = fr({
  share: "Partager mon résultat",
  copied: "Lien copié !",
  shareTitle: (name: string) => `Mon Na Nah N'Hair : ${name}`,
});

// Libellés communs des pages produits
export const productPage = fr({
  priceLabel: "Prix",
  personalityPrefix: "Personnalité : ",
  universePrefix: "Univers : ",
  personalityLabel: "Personnalité",
  universeLabel: "Univers",
  scentLabel: "Odeur",
  volumeLabel: "Contenance",
  highlightsTitle: "Points clés",
  descriptionTitle: "Description",
  inciTitle: "Ingrédients (INCI)",
  usageTitle: "Mode d'emploi",
  precautionsTitle: "Précautions d'emploi",
  faqTitle: "Questions fréquentes",
  founderBadge: "Mon produit fondateur",
  addToCart: "Ajouter au panier",
  othersTitle: "Découvre aussi",
  quizCta: { label: "Quel soin est le tien ?", href: "/quiz" },
  packTitle: "Et si tu étais les trois ?",
  packCta: "Découvrir le pack",
});

export const soinsPage = fr({
  title: "Les trois soins",
  intro: "Trois soins. Trois personnalités. Une seule question : lequel est le tien ?",
  cta: "Voir la fiche",
  quizCta: { label: "Je découvre mon Na Nah N'Hair", href: "/quiz" },
});

export const storyPage = fr({
  kicker: "Mon histoire",
  founderTitle: "Miraculous, mon produit fondateur",
  shopCta: { label: "Découvrir les trois soins", href: "/soins" },
});

// FAQ : questions = structure ; réponses = INFOS.md uniquement, sinon À COMPLÉTER
export type FaqItem = { question: string; answer: string[] | null; todo?: string };
export type FaqGroup = { title: string; items: FaqItem[] };

export const faq: { title: string; groups: FaqGroup[] } = fr({
  title: "FAQ",
  groups: [
    {
      title: "Utilisation",
      items: [
        {
          question: "Comment utiliser les sérums ?",
          answer: null,
          todo: "mode d'emploi de chaque sérum",
        },
        {
          question: "Comment utiliser le pack des 3 soins ?",
          answer: [`${pack.usageTitle} : ${pack.usage}`],
        },
      ],
    },
    {
      title: "Composition",
      items: [
        {
          question: "Quelle est la composition des sérums ?",
          answer: [
            "La liste complète des ingrédients (INCI) est affichée sur la fiche de chaque soin.",
            ...products.map((p) => {
              const v = p.description.vitamins.split(",")[0];
              return `${p.shortName} : ${v.charAt(0).toLowerCase()}${v.slice(1)}.`;
            }),
          ],
        },
        {
          question: "Quel est le parfum de chaque sérum ?",
          answer: products.map((p) => `${p.shortName} : ${p.scent}.`),
        },
        {
          question: "Quelle est la contenance d'un flacon ?",
          answer: ["Chaque sérum est présenté en flacon de 30 ml."],
        },
      ],
    },
    {
      title: "Précautions",
      items: [
        {
          question: "Y a-t-il des précautions d'emploi ?",
          answer: null,
          todo: "précautions d'emploi de chaque sérum",
        },
      ],
    },
    {
      title: "Livraison",
      items: [
        {
          question: "Où livrez-vous ?",
          answer: ["France uniquement."],
        },
        {
          question: "Combien coûte la livraison ?",
          answer: ["Livraison offerte sur toutes les commandes en France, pour l'instant."],
        },
        {
          question: "Quel est le délai de livraison ?",
          answer: ["3 jours ouvrés, préparation incluse."],
        },
        {
          question: "Quels transporteurs proposez-vous ?",
          answer: ["Colissimo et Mondial Relay, au choix à la commande (avec choix d'un point relais pour Mondial Relay)."],
        },
      ],
    },
    {
      title: "Retours",
      items: [
        {
          question: "Puis-je retourner un produit ?",
          answer: [
            "Droit de rétractation de 14 jours pour les produits non ouverts, comme l'impose la loi pour la vente à distance.",
            "Les produits ouverts ne sont pas repris (raison d'hygiène).",
          ],
          todo: "qui paie les frais de retour",
        },
        {
          question: "Que faire si mon produit est défectueux ou erroné ?",
          answer: ["Garantie légale en cas de produit défectueux ou erroné."],
          todo: "procédure à suivre",
        },
      ],
    },
    {
      title: "Commandes",
      items: [
        {
          question: "Comment vous contacter au sujet d'une commande ?",
          answer: [`Par email à ${legal.email} ou par téléphone au ${legal.phone}.`],
        },
      ],
    },
  ],
});

// Quiz (INFOS §10). L'ordre des réponses est mélangé d'une question à l'autre :
// le soin proposé en premier change à chaque question.
export type QuizAnswer = { text: string; product: ProductTheme; points: number };

export const quiz = fr({
  title: "Quel Na Nah N'Hair es-tu ?",
  intro: "5 questions, une seule réponse par question.",
  start: "Commencer le quiz",
  progress: (n: number, total: number) => `Question ${n} sur ${total}`,
  previous: "Question précédente",
  restart: "Refaire le quiz",
  questions: [
    // Questions 1 à 4 : réponses fournies le 20/10/2026 (ordre d'affichage tel que fourni) ; question 5 inchangée
    {
      question: "Ton rituel idéal du week-end ?",
      answers: [
        { text: "Un brunch entre copines puis une virée shopping", product: "miraculous", points: 1 },
        { text: "Une escapade à la plage, sans réveil", product: "fabulous", points: 1 },
        { text: "Un hôtel spa avec vue, peignoir et coupe de champagne", product: "luxurious", points: 1 },
      ],
    },
    {
      question: "Ce que tu aimes dans un soin ?",
      answers: [
        { text: "Un parfum gourmand qui reste sur mes cheveux toute la journée", product: "luxurious", points: 1 },
        { text: "Un vrai rituel, que je suis avec régularité", product: "miraculous", points: 1 },
        { text: "Quelques gouttes, et je file", product: "fabulous", points: 1 },
      ],
    },
    {
      question: "L'expérience que tu recherches ?",
      answers: [
        { text: "Un vent de fraîcheur, comme un matin d'été", product: "fabulous", points: 1 },
        { text: "Un moment glamour, rien que pour moi", product: "luxurious", points: 1 },
        { text: "Un nouveau départ pour mes cheveux", product: "miraculous", points: 1 },
      ],
    },
    {
      question: "Ta priorité pour tes cheveux ?",
      answers: [
        { text: "Des cheveux plus forts, avec un soin suivi sur la durée", product: "miraculous", points: 2 },
        { text: "Une brillance miroir et du volume", product: "luxurious", points: 1 },
        { text: "Des cheveux gainés, hydratés et en pleine forme", product: "fabulous", points: 1 },
      ],
    },
    {
      question: "Ta phrase préférée ?",
      answers: [
        { text: "« Je mérite ce petit luxe »", product: "luxurious", points: 1 },
        { text: "« Simplement moi »", product: "fabulous", points: 1 },
        { text: "« Je crois en mon objectif »", product: "miraculous", points: 2 },
      ],
    },
  ] as Array<{ question: string; answers: QuizAnswer[] }>,
  result: {
    kicker: "Ton Na Nah N'Hair",
    packTitle: "Fabulous et Luxurious à égalité",
    packText: "Tu as autant de Fabulous que de Luxurious en toi : le pack réunit les trois soins.",
    founderTitle: "Découvre aussi Miraculous, mon produit fondateur",
    founderCta: "Voir Miraculous",
    finalMessage: "Et si tu étais les trois ? Découvre toute la collection.",
    finalCta: { label: "Découvrir toute la collection", href: "/boutique" },
    productCta: "Voir la fiche",
  },
});

export const shop = fr({
  title: "Boutique",
  intro: "Trois soins et le pack.",
  addToCart: "Ajouter au panier",
  added: "Ajouté au panier",
  viewCart: "Voir le panier",
  quantity: "Quantité",
  soldOut: "Épuisé",
  lowStock: (n: number) => `Plus que ${n} en stock`,
  viewProduct: "Voir la fiche",
  freeShipping: "Livraison offerte en France · Délai : 3 jours ouvrés, préparation incluse.",
  freeShippingFrom: (amount: string) => `Livraison offerte en France dès ${amount} · Délai : 3 jours ouvrés, préparation incluse.`,
});

export const cartTexts = fr({
  title: "Panier",
  empty: "Ton panier est vide.",
  emptyCta: { label: "Aller à la boutique", href: "/boutique" },
  remove: "Retirer",
  quantityLabel: "Quantité",
  decrease: "Diminuer la quantité",
  increase: "Augmenter la quantité",
  subtotal: "Sous-total",
  shipping: "Livraison",
  shippingFree: "Offerte",
  shippingTbd: "Calculée à l'étape suivante",
  total: "Total TTC",
  checkout: "Commander",
  continue: "Continuer mes achats",
  loading: "Chargement du panier…",
  pricesError: "Impossible de charger les prix. Réessaie dans un instant.",
  errors: {
    unavailable: "Ce produit n'est plus disponible : retire-le du panier.",
    "insufficient-stock": (n: number) => `Stock insuffisant : ${n} disponible(s) au maximum.`,
  },
});

export const checkoutTexts = fr({
  title: "Commande",
  carrierTitle: "Mode de livraison",
  relayTitle: "Point relais Mondial Relay",
  summaryTitle: "Récapitulatif",
  pay: "Payer",
  backToCart: "Modifier le panier",
  paymentPending: "Le paiement en ligne (carte, Apple Pay, Google Pay) arrive bientôt.",
  carrierRequired: "Choisis un mode de livraison.",
  delay: "Délai : 3 jours ouvrés, préparation incluse.",
  quoteError: "Impossible de calculer le total. Réessaie dans un instant.",
  noCarrier: "Aucun mode de livraison n'est disponible pour le moment. Contacte-nous.",
  carrierPriceMissing: "Tarif indisponible pour ce transporteur : choisis-en un autre.",
  lineError: (name: string, message: string) => `${name} : ${message}`,
});

export const adminTexts = fr({
  title: "Back-office",
  login: {
    title: "Connexion au back-office",
    password: "Mot de passe",
    totp: "Code de double authentification (6 chiffres)",
    submit: "Se connecter",
    invalid: "Identifiants incorrects.",
    blocked: "Trop de tentatives. Réessaie dans 15 minutes.",
    // Les variables techniques à définir sont décrites dans GUIDE.md
    notConfigured: "Le back-office n'est pas encore activé.",
  },
  nav: [
    { label: "Tableau de bord", href: "/admin" },
    { label: "Produits et stocks", href: "/admin/produits" },
    { label: "Livraison", href: "/admin/livraison" },
    { label: "Messages", href: "/admin/messages" },
    { label: "Journal", href: "/admin/journal" },
  ],
  logout: "Se déconnecter",
  saved: "Modifications enregistrées.",
  products: {
    title: "Produits et stocks",
    price: "Prix TTC (€)",
    stock: "Stock",
    stockHelp: "Laisser vide si le stock n'est pas suivi.",
    packStock: "Le pack n'a pas de stock propre : il est disponible tant que les trois sérums le sont.",
    available: "Disponible à la vente",
    photo: "Photo (JPEG, PNG ou WebP, 4 Mo maximum)",
    removePhoto: "Retirer la photo",
    save: "Enregistrer",
    soldOut: "Épuisé",
    errors: {
      price: "Prix invalide (exemple : 19,90).",
      stock: "Stock invalide : nombre entier entre 0 et 100 000, ou vide.",
      photoType: "Format de photo refusé : JPEG, PNG ou WebP uniquement.",
      photoSize: "Photo trop lourde : 4 Mo maximum.",
    },
  },
  shipping: {
    title: "Livraison",
    threshold: "Livraison offerte à partir de (€)",
    thresholdHelp: "0 = livraison offerte sur toutes les commandes (réglage actuel).",
    carrierPrice: "Tarif (€)",
    carrierPriceHelp: "À COMPLÉTER : utile seulement si la livraison redevient payante.",
    carrierActive: "Proposé à la commande",
    save: "Enregistrer",
    errors: {
      threshold: "Montant invalide.",
      price: "Tarif invalide.",
      noCarrier: "Au moins un transporteur doit être proposé.",
      missingPrice: "Livraison payante : renseigne le tarif de chaque transporteur proposé.",
    },
  },
  messages: {
    title: "Messages",
    empty: "Aucun message.",
    delete: "Supprimer",
    export: "Exporter (CSV)",
    rgpd: "Suppression définitive (droit à l'effacement, RGPD).",
  },
  journal: { title: "Journal", audit: "Actions du back-office", errors: "Erreurs serveur", empty: "Rien pour l'instant." },
});
