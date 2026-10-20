// Design tokens NA NAH N'HAIR : la seule source des couleurs et typographies.
// Les mêmes valeurs sont exposées en variables CSS dans app/globals.css.

export const colors = {
  // Repris du premier site
  white: "#FFFFFF",
  lavender: "#AAA1C8", // Pantone 15-3817 TCX, hex à valider visuellement
  lavenderSoft: "#F3F0FA",
  lavenderMist: "#E8E2F2",
  // Violet foncé : même teinte que le logo (250°), lisible partout (WCAG AA)
  deepViolet: "#342B64",
  plum: "#504587", // violet intermédiaire, même teinte que le logo
  ink: "#211A2E",
  blush: "#FFF5F7",
  gold: "#D8A24A",
  yellow: "#F1E6B2", // Pantone 7499

  // Couleurs prélevées dans le logo (assets/logo/logo-na-nah-nhair.jpg)
  logoViolet: "#8076B3",
  logoYellow: "#F1E1B0",

  // Nouveaux : couleurs produits (à valider en phase 2)
  fabulous: "#8FD3AE",
  fabulousSoft: "#E8F7EE",
  fabulousDeep: "#1D5A3C",
  miraculous: "#C7B2EC",
  miraculousSoft: "#F4EEFC",
  miraculousDeep: "#342B64",
  luxurious: "#F5A9C6",
  luxuriousSoft: "#FDECF2",
  luxuriousDeep: "#8A2453",
} as const;

export type ColorName = keyof typeof colors;

export const fonts = {
  // Polices de remplacement en attendant celles des flacons (assets/fonts/)
  display: "'Bebas Kai', var(--font-bebas), Impact, sans-serif",
  body: "var(--font-montserrat), Arial, sans-serif",
} as const;

export type ProductTheme = "fabulous" | "miraculous" | "luxurious";

// Grands textes uniquement (≥ 19 px gras ou ≥ 24 px) : WCAG AA exige 3:1
export const largeTextPairs: Array<[text: ColorName, background: ColorName]> = [
  ["logoViolet", "logoYellow"], // logo de l'en-tête (fichier fourni)
  ["logoViolet", "white"], // titre de l'accueil (logo)
];

// Paires texte / fond réellement utilisées : vérifiées WCAG AA par tests/design-tokens.test.ts
export const contrastPairs: Array<[text: ColorName, background: ColorName]> = [
  ["deepViolet", "logoYellow"], // bandeau d'annonce
  ["ink", "white"],
  ["deepViolet", "white"],
  ["plum", "white"],
  ["deepViolet", "lavender"],
  ["ink", "lavender"],
  ["deepViolet", "lavenderSoft"],
  ["white", "deepViolet"],
  ["white", "plum"],
  ["deepViolet", "yellow"],
  ["fabulousDeep", "fabulous"],
  ["fabulousDeep", "fabulousSoft"],
  ["white", "fabulousDeep"],
  ["miraculousDeep", "miraculous"],
  ["miraculousDeep", "miraculousSoft"],
  ["white", "miraculousDeep"],
  ["luxuriousDeep", "luxurious"],
  ["luxuriousDeep", "luxuriousSoft"],
  ["white", "luxuriousDeep"],
];
