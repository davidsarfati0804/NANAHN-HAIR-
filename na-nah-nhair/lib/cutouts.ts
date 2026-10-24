import type { ProductTheme } from "@/lib/design-tokens";

// Flacons détourés (fond transparent, modification 40) : versions générées par scripts/preparer-detoures.py
export const CUTOUT_WIDTHS = [240, 480, 720] as const;
// Hauteur de la version 240 px (proportions des fichiers fournis), pour éviter les sauts de mise en page
export const cutoutHeight: Record<ProductTheme, number> = { fabulous: 655, miraculous: 647, luxurious: 640 };

export const cutoutSrcSet = (slug: ProductTheme, ext: "webp" | "png") =>
  CUTOUT_WIDTHS.map((w) => `/images/produits/${slug}-detoure-${w}.${ext} ${w}w`).join(", ");
