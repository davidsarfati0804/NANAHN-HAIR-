// Design tokens NA NAH N'HAIR : la seule source des couleurs et typographies.
// Les mêmes valeurs sont exposées en variables CSS dans app/globals.css.

export const colors = {
  // Marque (validé le 20/10/2026, modification 9)
  logoViolet: "#8076B3", // violet du logo : logo et nom de marque
  deepViolet: "#342B64", // violet foncé : textes, titres, boutons, sections sombres
  plum: "#504587", // survol des boutons foncés uniquement
  logoYellow: "#F1E1B0", // crème du logo : bandeau, sticker, étiquettes À COMPLÉTER
  white: "#FFFFFF", // fond du site
  lavenderSoft: "#F3F0FA", // lavande très claire : fonds de sections
  lavender: "#AAA1C8", // lavande des cartes et encadrés (Pantone 15-3817 TCX), contours

  // Produits = couleurs des flacons (modification 10). VALEURS PROVISOIRES, Pantone exacts à venir.
  fabulousSoft: "#E4F3ED", // clair : fonds secondaires
  fabulous: "#B2DCCB", // moyen : fond du cadre (couleur du flacon)
  fabulousDeep: "#1D5A3C", // foncé : textes et boutons dans le cadre
  fabulousName: "#1D5A3C", // nom du produit : ton sur ton, vert foncé sur le vert du flacon (modification 14)
  miraculousSoft: "#E6E0F5",
  miraculous: "#B9A5E2",
  miraculousDeep: "#342B64",
  miraculousName: "#342B64", // À COMPLÉTER : couleur du texte du flacon
  luxuriousSoft: "#F8EAF3",
  luxurious: "#EBC4DE",
  luxuriousDeep: "#8A2453",
  luxuriousName: "#8A2453", // À COMPLÉTER : couleur du texte du flacon
  luxuriousVivid: "#E48FC0", // rose plus soutenu que le flacon : forme décorative derrière le flacon (accueil)
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
  ["logoViolet", "logoYellow"], // logo de l'en-tête (fichier fourni), nom de marque dans le bandeau
  ["logoViolet", "white"], // titre de l'accueil (logo), nom de marque en grand
  ["logoViolet", "lavenderSoft"], // numéros des cartes « Mon histoire »
  ["fabulousName", "fabulous"], // nom Fabulous ton sur ton dans son cadre
];

// Paires texte / fond réellement utilisées : vérifiées WCAG AA par tests/unit/design-tokens.test.ts
export const contrastPairs: Array<[text: ColorName, background: ColorName]> = [
  ["deepViolet", "white"],
  ["deepViolet", "logoYellow"],
  ["deepViolet", "lavenderSoft"],
  ["deepViolet", "lavender"],
  ["white", "deepViolet"],
  ["white", "plum"],
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
