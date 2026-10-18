import type { ProductTheme } from "@/lib/design-tokens";

// Classes Tailwind écrites en entier pour que Tailwind les détecte
export const themeClasses: Record<
  ProductTheme,
  { base: string; soft: string; text: string; border: string; button: string }
> = {
  fabulous: {
    base: "bg-fabulous",
    soft: "bg-fabulous-soft",
    text: "text-fabulous-deep",
    border: "border-fabulous-deep",
    button: "bg-fabulous-deep text-white hover:bg-ink",
  },
  miraculous: {
    base: "bg-miraculous",
    soft: "bg-miraculous-soft",
    text: "text-miraculous-deep",
    border: "border-miraculous-deep",
    button: "bg-miraculous-deep text-white hover:bg-ink",
  },
  luxurious: {
    base: "bg-luxurious",
    soft: "bg-luxurious-soft",
    text: "text-luxurious-deep",
    border: "border-luxurious-deep",
    button: "bg-luxurious-deep text-white hover:bg-ink",
  },
};
