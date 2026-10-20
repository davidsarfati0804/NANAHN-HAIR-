import type { ProductTheme } from "@/lib/design-tokens";

// Classes Tailwind écrites en entier pour que Tailwind les détecte.
// base = fond du cadre (couleur du flacon) ; soft = fond clair ; text = ton foncé (textes, boutons) ;
// name = nom du produit (couleur du texte du flacon ; Fabulous sur bande blanche pour rester lisible)
export const themeClasses: Record<
  ProductTheme,
  { base: string; soft: string; text: string; border: string; button: string; name: string }
> = {
  fabulous: {
    base: "bg-fabulous",
    soft: "bg-fabulous-soft",
    text: "text-fabulous-deep",
    border: "border-fabulous-deep",
    button: "bouton bg-fabulous-deep text-white hover:opacity-90",
    name: "inline-block rounded-2xl bg-white px-3 pt-1 text-fabulous-name",
  },
  miraculous: {
    base: "bg-miraculous",
    soft: "bg-miraculous-soft",
    text: "text-miraculous-deep",
    border: "border-miraculous-deep",
    button: "bouton bg-miraculous-deep text-white hover:opacity-90",
    name: "text-miraculous-name",
  },
  luxurious: {
    base: "bg-luxurious",
    soft: "bg-luxurious-soft",
    text: "text-luxurious-deep",
    border: "border-luxurious-deep",
    button: "bouton bg-luxurious-deep text-white hover:opacity-90",
    name: "text-luxurious-name",
  },
};
