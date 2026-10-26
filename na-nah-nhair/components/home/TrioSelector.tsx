"use client";

import Link from "next/link";
import { useState } from "react";
import { home, productPage, products } from "@/content/site";
import type { ProductTheme } from "@/lib/design-tokens";
import { cutoutFallback, cutoutSize, cutoutSrcSet } from "@/lib/cutouts";
import { themeClasses } from "@/lib/theme-classes";

// Sélecteur « Quel soin est le tien ? » (modification 34) : trois cartes-boutons, le flacon touché
// se soulève très discrètement (transform uniquement, 400 ms), une seule carte sélectionnée à la fois,
// et le panneau dessous affiche le soin. Mouvement réduit : seulement le contour et le panneau.
const cardColor: Record<ProductTheme, string> = {
  fabulous: "bg-fabulous",
  miraculous: "bg-miraculous",
  luxurious: "bg-luxurious-vivid", // rose plus soutenu que le flacon
};

export default function TrioSelector({ prices }: { prices: Record<ProductTheme, string> }) {
  const [selected, setSelected] = useState<ProductTheme | null>(null);
  const current = products.find((p) => p.slug === selected);
  const t = selected ? themeClasses[selected] : null;

  return (
    <div>
      <div className="mx-auto grid max-w-3xl grid-cols-3 gap-3 pt-10 sm:gap-6 sm:pt-14">
        {products.map((p) => {
          const on = selected === p.slug;
          return (
            <button
              key={p.slug}
              type="button"
              aria-pressed={on}
              aria-label={p.shortName}
              onClick={() => setSelected(on ? null : p.slug)}
              className="trio-carte flex min-h-11 flex-col items-center rounded-[1.75rem] text-center [perspective:600px]"
            >
              <span
                className={`relative block aspect-[4/5] w-full rounded-[1.75rem] ${cardColor[p.slug]} ${
                  on ? "outline outline-2 outline-offset-0 outline-deep-violet" : ""
                }`}
              >
                {/* Ombre au sol : se décale de 6 px quand le flacon se soulève */}
                <span
                  aria-hidden
                  className="trio-ombre absolute bottom-[4.5%] left-1/2 h-3 w-[55%] rounded-[50%] bg-deep-violet/20 blur-[3px]"
                />
                <span className="absolute inset-x-0 bottom-[6%] -top-[22%] flex justify-center">
                  {p.cutout.available ? (
                    <picture className="h-full">
                      <source type="image/webp" srcSet={cutoutSrcSet(p.slug)} sizes="(max-width: 640px) 28vw, 200px" />
                      <img
                        src={cutoutFallback(p.slug)}
                        width={cutoutSize[p.slug].width}
                        height={cutoutSize[p.slug].height}
                        alt={p.cutout.alt}
                        loading="lazy"
                        decoding="async"
                        className="trio-flacon h-full w-auto"
                      />
                    </picture>
                  ) : (
                    <span className="flex h-full items-center px-1 text-[0.55rem] font-bold uppercase">À COMPLÉTER : photo détourée</span>
                  )}
                </span>
              </span>
              <span className={`mt-2 text-xs font-bold uppercase tracking-wide ${themeClasses[p.slug].text}`}>{p.shortName}</span>
            </button>
          );
        })}
      </div>

      {/* Panneau : « Touche un flacon », puis le soin choisi */}
      <div
        aria-live="polite"
        className={`mx-auto mt-6 max-w-3xl rounded-[2rem] px-6 py-6 text-center transition-colors duration-200 motion-reduce:transition-none sm:px-10 ${
          current && t ? `${t.soft} ${t.text}` : "bg-lavender-soft text-deep-violet"
        }`}
      >
        {current && t ? (
          <div key={current.slug} className="fondu">
            <p className={`nom-produit ${t.name}`}>{current.shortName}</p>
            <p className="text-sm font-bold uppercase tracking-wide">{productPage.serumLabel}</p>
            <p className="mt-3">{current.iAm}</p>
            <p className="mt-3 nom-produit">{prices[current.slug]}</p>
            <Link href={`/soins/${current.slug}`} className={`mt-4 ${t.button}`}>
              {home.trio.cta}
              <span className="sr-only"> {current.shortName}</span>
            </Link>
          </div>
        ) : (
          <p className="text-sm font-light">{home.trio.touchHint}</p>
        )}
      </div>
    </div>
  );
}
