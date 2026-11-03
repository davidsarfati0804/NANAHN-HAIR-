"use client";

import Link from "next/link";
import { useState } from "react";
import { home, productPage, products, quiz } from "@/content/site";
import type { ProductTheme } from "@/lib/design-tokens";
import { cutoutFallback, cutoutSize, cutoutSrcSet } from "@/lib/cutouts";
import { themeClasses } from "@/lib/theme-classes";

// Sélecteur « Quel soin est le tien ? » (modification 34) : trois cartes-boutons, le flacon touché
// se soulève très discrètement (transform uniquement, 400 ms), une seule carte sélectionnée à la fois,
// et le panneau dessous affiche le soin. Mouvement réduit : seulement le contour et le panneau.
// Bouton « DÉCOUVRIR [SOIN] → » (modifications 69 et 75) : ton foncé du soin, texte blanc (contraste AA),
// ombre douce de la couleur du bouton ; pleine largeur sur téléphone, au moins 320 px sur ordinateur
const ctaColor: Record<ProductTheme, string> = {
  fabulous: "bg-fabulous-deep shadow-[0_4px_10px_color-mix(in_srgb,var(--color-fabulous-deep)_25%,transparent)]",
  miraculous: "bg-miraculous-deep shadow-[0_4px_10px_color-mix(in_srgb,var(--color-miraculous-deep)_25%,transparent)]",
  luxurious: "bg-luxurious-deep shadow-[0_4px_10px_color-mix(in_srgb,var(--color-luxurious-deep)_25%,transparent)]",
};

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
            <Link
              href={`/soins/${current.slug}`}
              className={`group mt-5 inline-flex min-h-[52px] w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-full px-4 py-3 text-[0.8125rem] font-bold uppercase tracking-[0.06em] sm:gap-3 sm:px-6 sm:text-sm sm:tracking-[0.08em] text-white transition-[filter] duration-200 hover:brightness-90 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-deep-violet active:brightness-90 motion-reduce:transition-none sm:w-auto sm:min-w-80 ${ctaColor[current.slug]}`}
            >
              {quiz.result.discoverCta(current.shortName)}
              <span
                aria-hidden
                className="inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-white/25 text-xs transition-transform duration-200 group-hover:translate-x-1 group-active:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-active:translate-x-0"
              >
                →
              </span>
            </Link>
          </div>
        ) : (
          <p className="text-sm font-light">{home.trio.touchHint}</p>
        )}
      </div>
    </div>
  );
}
