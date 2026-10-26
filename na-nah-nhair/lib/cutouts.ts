import type { ProductTheme } from "@/lib/design-tokens";

// Flacons détourés (fond transparent, modifications 40 et 51), générés par scripts/preparer-detoures.py.
// Dimensions des fichiers fournis (version 3 du 26/10/2026, modification 55) : jamais agrandis.
export const cutoutSize: Record<ProductTheme, { width: number; height: number }> = {
  fabulous: { width: 465, height: 1245 },
  miraculous: { width: 457, height: 1226 },
  luxurious: { width: 474, height: 1241 },
};

// WebP (qualité 90) en 160, 320 px et pleine résolution
export const cutoutSrcSet = (slug: ProductTheme) =>
  [`/images/produits/${slug}-detoure-160.webp 160w`, `/images/produits/${slug}-detoure-320.webp 320w`, `/images/produits/${slug}-detoure-max.webp ${cutoutSize[slug].width}w`].join(", ");
// Secours : PNG pleine résolution
export const cutoutFallback = (slug: ProductTheme) => `/images/produits/${slug}-detoure-max.png`;

// Premier écran de l'accueil : version de référence (24/10/2026), inchangée (modification 51)
export const HERO_WIDTHS = [240, 480, 720] as const;
export const heroHeight: Record<ProductTheme, number> = { fabulous: 655, miraculous: 647, luxurious: 640 };
export const heroSrcSet = (slug: ProductTheme, ext: "webp" | "png") =>
  HERO_WIDTHS.map((w) => `/images/produits/${slug}-accueil-${w}.${ext} ${w}w`).join(", ");
