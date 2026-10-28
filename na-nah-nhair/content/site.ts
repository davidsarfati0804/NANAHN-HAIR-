// TOUS les textes du site NA NAH N'HAIR (demande INFOS.md : un seul fichier de contenu).
// Sources : INFOS.md (prioritaire) et BRIEF.md. Ne rien inventer.
// Une valeur `null` = information manquante : le site affiche « À COMPLÉTER : … ».

import type { ProductTheme } from "@/lib/design-tokens";
import { fr } from "@/lib/typography";

export const brand = fr({
  name: "NA NAH N'HAIR",
  // Logo fourni (assets/logo/logo-na-nah-nhair.jpg), utilisé tel quel dans l'en-tête
  logo: { src: "/images/logo-na-nah-nhair.jpg", width: 1772, height: 1772, alt: "Na Nah N’hair !", headerAlt: "Na Nah N’hair ! — retour à l'accueil" },
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
  title: "Je ne suis pas qu’une seule femme.",
  lines: ["Je suis Fabulous.", "Je suis Miraculous.", "Je suis Luxurious.", "Je suis les trois."],
});

export type Product = {
  slug: ProductTheme;
  name: string;
  shortName: string;
  // Prix INFOS.md : valeur initiale du catalogue (le prix affiché vient du back-office)
  infosPrice: string;
  // cutout : flacon détouré affiché à la place de la photo à fond blanc (modification 40)
  photo: { file: string; alt: string; available: boolean; responsive?: string; cutout?: ProductTheme };
  // Photo détourée (fond transparent) du premier écran de l'accueil (modification 22)
  cutout: { file: string; alt: string; available: boolean };
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
  // Questions-réponses propres au soin (fiche produit) : null = À COMPLÉTER
  faq: Array<{ question: string; answer: string }> | null;
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
      file: "fabulous.png",
      alt: "Flacon Fabulous Hair Serum, sérum capillaire de 30 ml",
      available: true,
      cutout: "fabulous",
    },
    cutout: { file: "fabulous.png", alt: "Flacon Fabulous Hair Serum", available: true },
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
        "Formulé à base d’huiles végétales riches en vitamine E, il agit en profondeur pour réconforter le cuir chevelu et renforcer la fibre capillaire jour après jour.",
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
    faq: null,
    volume: "30 ml",
  },
  {
    slug: "miraculous",
    name: "MIRACULOUS HAIR SERUM",
    shortName: "Miraculous",
    infosPrice: "39,90 €",
    photo: {
      file: "miraculous.png",
      alt: "Flacon Miraculous Hair Serum, sérum capillaire de 30 ml",
      available: true,
      cutout: "miraculous",
    },
    cutout: { file: "miraculous.png", alt: "Flacon Miraculous Hair Serum", available: true },
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
        "Formulé à base d’huiles végétales riches en vitamine B, il agit comme un véritable boost naturel pour le cuir chevelu et la fibre capillaire.",
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
    faq: null,
    volume: "30 ml",
    founder: true,
  },
  {
    slug: "luxurious",
    name: "LUXURIOUS HAIR SERUM",
    shortName: "Luxurious",
    infosPrice: "29,90 €",
    photo: {
      file: "luxurious.png",
      alt: "Flacon Luxurious Hair Serum, sérum capillaire de 30 ml",
      available: true,
      cutout: "luxurious",
    },
    cutout: { file: "luxurious.png", alt: "Flacon Luxurious Hair Serum", available: true },
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
        "Formulé à base d’huiles végétales riches en vitamine C, il nourrit la fibre capillaire en profondeur et révèle une chevelure plus forte, souple et éclatante.",
      helpsTitle: "Ce sérum aide à :",
      helps: [
        "Renforcer le cheveu terne, sec et abîmé",
        "Améliorer la beauté du cheveu",
        "Donner de la brillance",
        "Donner du volume",
      ],
      // Modification 47
      outro:
        "Son parfum de fleur d’oranger transforme ta routine capillaire en un vrai moment de plaisir. Utilisé comme touche finale, le Luxurious Hair Serum devient ce petit luxe que tu mérites, pour des cheveux élégants et lumineux.",
    },
    inci: "RICINUS COMMUNIS SEED OIL*, OLEA EUROPAEA FRUIT OIL*, COCOS NUCIFERA OIL*, PERSEA GRATISSIMA OIL*, BRASSICA NIGRA SEED OIL*, SIMMONDSIA CHINENSIS SEED OIL*, BRASSICA OLERACEA ITALICA SEED OIL*, VITIS VINIFERA SEED OIL, EMBLICA OFFICINALIS FRUIT POWDER*, FRAGRANCE, TOCOPHEROL, HELIANTHUS ANNUUS SEED OIL, ALPHA-HEXYLCINNAMALDEHYDE**, CITRAL**, D-LIMONENE**, GERANIOL**",
    inciNotes,
    usage: usageGuide("Luxurious Hair Serum", "mode-emploi-luxurious"),
    precautions: null,
    faq: null,
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
    alt: "Pack des 3 soins : les flacons Miraculous, Luxurious et Fabulous",
    available: true,
    responsive: "pack",
  },
  contentTitle: "Contenu du pack",
  contentShort: "Fabulous + Miraculous + Luxurious",
  // Noms complets dans cette carte (modification 32, exception à la modification 29)
  content: [
    { slug: "fabulous", product: "Fabulous Hair Serum", text: "Pour gainer, hydrater et fortifier le cheveu." },
    { slug: "miraculous", product: "Miraculous Hair Serum", text: "Pour stimuler la pousse, la repousse et ralentir la chute." },
    { slug: "luxurious", product: "Luxurious Hair Serum", text: "Pour la touche finale, le volume et la brillance miroir." },
  ] as Array<{ slug: ProductTheme; product: string; text: string }>,
  usageTitle: "Mode d’emploi du pack",
  // Modification 33 (version finale) ; **…** = en gras (composant RichText)
  usage:
    "Alterne les sérums selon tes besoins ou crée ta propre routine : **Miraculous** pour ta cure, **Fabulous** pour prendre soin de toi, **Luxurious** pour briller en sortie. Pour un résultat optimisé, utilise le soin 3 fois par semaine.",
});

// Page « Mon histoire » : textes fournis le 22/10/2026 (modification 31), mot pour mot
export const story = fr({
  title: "Mon histoire",
  heading: "Tout a commencé sur mon bureau.",
  paragraphs: [
    "Je suis naturopathe et diplômée en aromathérapie. Mais avant les diplômes, il y a eu une rencontre.",
    "En première année de naturopathie, lors d’un stage, j’accompagnais une femme qui souhaitait prendre soin de ses cheveux et favoriser leur longueur. J’ai relevé le défi : préparer une synergie rien que pour elle.",
    "Cette expérience m’a donné envie d’aider d’autres personnes et de créer mes propres soins capillaires. J’ai commencé mes préparations dans ma chambre, sur mon bureau. Sans artifice, sans filtre.",
    "J’aime aider les autres, me rendre utile, et savoir qu’une petite action de ma part peut apporter de la satisfaction à quelqu’un. Ce que je voulais, au fond ? Que prendre soin de ses cheveux devienne un vrai moment pour soi : se faire plaisir, lâcher prise, être soi-même.",
    "Parce qu’une femme n’est jamais qu’une seule chose. Elle peut être fraîche et spontanée, déterminée et audacieuse, élégante et sensorielle, parfois tout ça dans la même journée.",
  ],
  closing:
    "C’est ainsi qu’est née Na Nah N’hair : trois soins, trois personnalités, une même envie, celle de te laisser prendre soin de tes cheveux tout en révélant tes différentes facettes, telle que tu es, pour de vrai.",
});

export const home = fr({
  hero: {
    signature: brand.signature,
    subtitle: "Trois soins. Trois personnalités. Une seule question : lequel est le tien ?",
    primaryCta: { label: "Je découvre mon Na Nah N'Hair", href: "/quiz" },
    secondaryCta: { label: "Découvrir les trois soins", href: "/soins" },
    quizHint: "5 questions · 1 résultat",
    reassurance: ["Made in France", "30 ml"],
    reassuranceShipping: "Livraison offerte en France",
    scrollCta: { label: "Découvre les trois soins", href: "#trio" },
  },
  trio: {
    kicker: "Trois soins, trois personnalités",
    accroche: "À chaque personnalité, son soin.",
    title: "Quel soin est le tien ?",
    cta: "Voir la fiche",
    // Sélecteur de flacons (modification 34)
    touchHint: "Touche un flacon",
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
        text: "En première année de naturopathie, lors d’un stage, une femme souhaite prendre soin de ses cheveux et favoriser leur longueur. J’ai relevé le défi : une synergie sur mesure, rien que pour elle.",
      },
      {
        title: "Le bureau",
        text: "Mes premières préparations sont nées dans ma chambre, sur mon bureau.",
      },
      {
        title: "Les trois soins",
        text: "Trois soins, trois personnalités, une même envie : prendre soin de tes cheveux.",
      },
    ],
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
          { product: "Fabulous Hair Serum", text: "Huiles végétales riches en vitamine E." },
          { product: "Miraculous Hair Serum", text: "Huiles végétales riches en vitamine B." },
          { product: "Luxurious Hair Serum", text: "Huiles végétales riches en vitamine C." },
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
  address: "24 rue Octave Feuillet, 75116 Paris",
  // Société qui exploite la marque (modification 53) ; seul le siège social est public
  company: { name: "BIOTYVIE", form: "SARL à associé unique", capital: "1 000 €", rcs: "RCS Paris 922 151 170" },
  // Franchise en base de TVA : prix nets, sans « TTC »
  vatMention: "TVA non applicable, article 293 B du CGI",
  phone: "01 80 18 29 29",
  email: "Contact@nanahnhair.com",
  companyStatus: null,
  vat: null,
  host: "Netlify", // coordonnées à confirmer
  publicationManager: null,
  // Modification 50 : lien sortant simple, sans suivi
  instagram: "https://www.instagram.com/na.nah.nhair/",
  instagramHandle: "@na.nah.nhair",
});

export const footer = fr({
  // Une seule ligne : « Mentions légales · CGV · Rétractation · Confidentialité · Cookies » (modification 39)
  legalLinks: [
    { label: "Mentions légales", href: "/mentions-legales" },
    { label: "CGV", href: "/cgv" },
    { label: "Rétractation", href: "/retractation" },
    { label: "Confidentialité", href: "/confidentialite" },
    { label: "Cookies", href: "/cookies" },
  ],
  manageCookies: "Gérer mes cookies",
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

// Page introuvable et page d'erreur (textes d'interface, voir TEXTES-A-VALIDER.md)
export const errorTexts = {
  notFound: {
    title: fr("Page introuvable"),
    text: fr("Cette page n'existe pas ou a changé d'adresse."),
    home: "Retour à l'accueil",
    shop: "Voir la boutique",
  },
  error: {
    title: fr("Une erreur est survenue"),
    text: fr("La page n'a pas pu s'afficher. Réessaie dans un instant."),
    retry: "Réessayer",
    home: "Retour à l'accueil",
  },
};

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
  // Le nom lu commence par le texte affiché (accessibilité : nom accessible = texte visible)
  instagramLabel: "@na.nah.nhair, Instagram de Na Nah N’hair (s'ouvre dans un nouvel onglet)",
  errors: {
    name: "Indique ton nom (2 à 100 caractères).",
    email: "Indique une adresse email valide.",
    subject: "Choisis un sujet.",
    message: "Ton message doit contenir entre 10 et 3 000 caractères.",
    spam: "Message refusé. Réessaie dans quelques instants.",
    tooFast: "Envoi trop rapide : vérifie ton message, puis envoie-le à nouveau.",
    rate: "Trop de messages envoyés. Réessaie plus tard.",
    server: "Le message n'a pas pu être envoyé. Écris-nous directement par email.",
  },
});

// Libellés communs des pages produits
export const productPage = fr({
  priceLabel: "Prix",
  // Petite ligne sous le grand nom (modification 29) ; le nom complet reste partout ailleurs
  serumLabel: "Hair Serum",
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
  // Carte Miraculous (modification 49)
  // Modification 52 : point d'exclamation, espace fine insécable avant « ! »
  founderTitle: "Voici Miraculous\u202f!",
  founderText: "Celui par lequel tout a commencé. Dans ma chambre, c’est lui que j’ai créé en premier : déterminé, ambitieux, un peu audacieux, comme celle qu’il accompagne.",
  founderCta: "Découvrir Miraculous",
  shopCta: { label: "Découvrir les trois soins", href: "/soins" },
});

// FAQ : questions = structure ; réponses = INFOS.md uniquement, sinon À COMPLÉTER
export type FaqItem = {
  question: string;
  answer: string[] | null;
  // Liste à puces sous les paragraphes
  list?: string[];
  // Un bloc par soin : nom en petit titre gras, étapes « Étape 1 », « Étape 2 »
  blocks?: { title: string; steps: { label: string; text: string }[] }[];
  // Réponse « Par email à … » avec lien mailto
  mailto?: { before: string; email: string };
  todo?: string;
};
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
          blocks: products.map((p) => ({
            title: `${p.shortName} Hair Serum`,
            steps: [
              {
                label: "Étape 1",
                text: `Utiliser ${p.shortName} Hair Serum des racines vers les pointes. Pour un soin complet : 3 pipettes sont nécessaires, à appliquer sur le cuir chevelu, les longueurs et les pointes.`,
              },
              {
                label: "Étape 2",
                text: "Laver les cheveux avec un shampoing classique. Pour un résultat optimisé, utiliser le soin 3 fois par semaine.",
              },
            ],
          })),
        },
        {
          question: "Comment utiliser le pack des 3 soins ?",
          answer: [pack.usage],
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
          answer: ["Ces précautions sont identiques pour Fabulous, Miraculous et Luxurious."],
          list: [
            "Ne pas utiliser le soin les 2 jours qui précèdent et suivent la coloration.",
            "Éviter tout contact avec les yeux.",
            "Usage externe uniquement.",
          ],
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
          // Modification 38 (version finale) ; l'adresse email devient un lien (RichText)
          answer: [
            "Oui. Tu disposes de 14 jours après réception pour te rétracter, sans avoir à te justifier. Pour cela, écris-nous à Contact@nanahnhair.com avant la fin de ce délai. Le soin doit être renvoyé neuf, non utilisé, dans son emballage d’origine. Les frais de retour sont à ta charge, et nous te conseillons de renvoyer ton colis avec suivi. Nous te remboursons dans les 14 jours suivant la réception du colis, par le même moyen de paiement que ta commande.",
          ],
        },
        {
          question: "Que faire si mon produit est défectueux ou erroné ?",
          answer: [
            "Écris-nous à Contact@nanahnhair.com avec ton numéro de commande et une photo du produit. Nous remplaçons ou remboursons le produit, et les frais de retour sont à notre charge. Tu bénéficies de la garantie légale de conformité.",
          ],
        },
      ],
    },
    {
      title: "Commandes",
      items: [
        {
          question: "Comment vous contacter au sujet d'une commande ?",
          answer: null,
          mailto: { before: "Par email à", email: "Contact@nanahnhair.com" },
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
  previous: "Retour",
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
  // Écran résultat (modification 20) : aucune photo de flacon
  result: {
    kicker: "Ton résultat",
    iAm: (name: string) => `Je suis ${name}.`,
    discoverCta: (name: string) => `Découvrir ${name}`,
    founderTitle: "Découvre aussi Miraculous, mon produit fondateur",
    founderCta: "Voir Miraculous",
    finalMessage: "Et si tu étais les trois ? Découvre toute la collection.",
    finalHref: "/boutique",
  },
  // Image story 1080 x 1920 (assets/story/, scripts/generer-stories.mjs)
  story: {
    kicker: "Quel Na Nah N’hair es-tu ?",
    share: "Partager en story",
    download: "Télécharger l'image",
    shareTitle: (name: string) => `Je suis ${name}.`,
    quizAt: "Fais le quiz sur",
    siteTodo: "À COMPLÉTER : adresse du site",
    // Adresse affichée sur l'image story (ex. « nanahnhair.com ») : null = À COMPLÉTER.
    // Après l'avoir renseignée : node scripts/generer-stories.mjs (images public/story/)
    siteAddress: null as string | null,
    instagram: "@na.nah.nhair",
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
  total: "Total",
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
  // Paiement conforme (modification 39, textes de content/juridique/textes-boutique.md)
  pay: "Commander et payer",
  cgvBefore: "J'ai lu et j'accepte les ",
  cgvLink: "conditions générales de vente",
  cgvAfter: ".",
  cgvError: "Pour passer commande, accepte les conditions générales de vente.",
  withdrawal: {
    text: "Droit de rétractation de 14 jours après réception. Les frais de retour sont à ta charge. Détails dans les ",
    cgv: "CGV",
    and: " et sur la page ",
    page: "Rétractation",
    end: ".",
  },
  addressTitle: "Adresse de livraison",
  // Information RGPD au moment de la collecte (texte d'interface, voir TEXTES-A-VALIDER.md)
  privacyBefore: "Ces informations servent uniquement à préparer et livrer ta commande. En savoir plus : ",
  privacyLink: "politique de confidentialité",
  fields: { firstName: "Prénom", lastName: "Nom", email: "Email", phone: "Téléphone (facultatif)", address: "Adresse", postalCode: "Code postal", city: "Ville" },
  // Zone de livraison (CGV, article 6)
  deliveryZone: "Nous livrons en France métropolitaine, Corse comprise.",
  addressError: "Vérifie ton adresse de livraison : les champs signalés sont incomplets.",
  delayLabel: "Délai de livraison",
  delayValue: "3 jours ouvrés, préparation incluse",
  accepted: (orderNumber: string, version: string) => `Commande n° ${orderNumber} : conditions générales de vente acceptées (version ${version}).`,
  submitError: "La commande n'a pas pu être enregistrée. Vérifie ton panier et réessaie.",
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
  backup: "Télécharger une sauvegarde",
  backupHelp: "(fichier à garder en lieu sûr : avant la mise en ligne, puis chaque semaine)",
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
    price: "Prix (€)",
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
    vat: "TVA applicable",
    vatHelp: "Franchise en base de TVA : « non » (TVA non applicable, article 293 B du CGI). Réglage prévu pour plus tard, non activable pour l'instant.",
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
