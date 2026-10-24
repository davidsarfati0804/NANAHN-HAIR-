import Link from "next/link";
import { products } from "@/content/site";
import type { ProductTheme } from "@/lib/design-tokens";
import { cutoutHeight, cutoutSrcSet } from "@/lib/cutouts";
import { themeClasses } from "@/lib/theme-classes";

// Trois flacons du premier écran (modification 22) : Fabulous à gauche, Miraculous au centre
// (plus grand, plus haut), Luxurious à droite ; légèrement superposés, inclinés vers l'extérieur.
const layout: Record<ProductTheme, { order: number; tilt: string; size: string; lift: string; delay: string }> = {
  fabulous: { order: 0, tilt: "-rotate-[5deg]", size: "w-[27%]", lift: "mt-6", delay: "0s" },
  miraculous: { order: 1, tilt: "", size: "w-[33%] z-10 -mx-[3%]", lift: "", delay: "0.5s" },
  luxurious: { order: 2, tilt: "rotate-[5deg]", size: "w-[27%]", lift: "mt-6", delay: "1s" },
};


export default function HeroBottles({ className = "" }: { className?: string }) {
  const ordered = [...products].sort((a, b) => layout[a.slug].order - layout[b.slug].order);
  return (
    <ul className={`flex items-start justify-center ${className}`}>
      {ordered.map((p) => {
        const l = layout[p.slug];
        const t = themeClasses[p.slug];
        return (
          <li
            key={p.slug}
            className={`flacon-monte group relative hover:z-20 focus-within:z-20 ${l.size} ${l.lift}`}
            style={{ animationDelay: l.delay }}
          >
            <Link href={`/soins/${p.slug}`} className={`relative block rounded-3xl ${l.tilt}`}>
              {p.cutout.available ? (
                // Au survol, au focus ou au toucher : le flacon se soulève et grossit (aucune ombre sur l'image : modification 42)
                <picture>
                  <source type="image/webp" srcSet={cutoutSrcSet(p.slug, "webp")} sizes="(max-width: 1023px) 30vw, 150px" />
                  <img
                    src={`/images/produits/${p.slug}-detoure-240.png`}
                    srcSet={cutoutSrcSet(p.slug, "png")}
                    sizes="(max-width: 1023px) 30vw, 150px"
                    width={240}
                    height={cutoutHeight[p.slug]}
                    alt={p.cutout.alt}
                    loading="eager"
                    fetchPriority="high"
                    className="relative z-10 h-auto w-full transition-[translate,scale] duration-300 ease-out group-hover:-translate-y-3 group-hover:scale-[1.08] group-focus-within:-translate-y-3 group-focus-within:scale-[1.08] group-active:-translate-y-3 group-active:scale-[1.08] motion-reduce:transition-none"
                  />
                </picture>
              ) : (
                <span
                  role="img"
                  aria-label={`${p.cutout.alt} (photo à venir)`}
                  className={`flex aspect-[1/2] w-full flex-col items-center justify-center rounded-[999px_999px_1.5rem_1.5rem] border-2 border-dashed bg-white/85 px-1 text-center ${t.border} ${t.text}`}
                >
                  <span className="text-[0.5rem] font-bold uppercase leading-tight sm:text-[0.65rem]">À COMPLÉTER : photo détourée</span>
                  <span className="mt-1 text-[0.5rem] sm:text-[0.65rem]">{p.shortName}</span>
                </span>
              )}
              {/* Ombre au sol sous la base du flacon (décorative), inclinée avec lui */}
              <span aria-hidden className="pointer-events-none absolute -bottom-1 left-1/2 h-2.5 w-[70%] -translate-x-1/2 rounded-[50%] bg-deep-violet/[0.18] blur-[8px]" />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
