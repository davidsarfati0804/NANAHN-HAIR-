import Image from "next/image";
import Link from "next/link";
import { products } from "@/content/site";
import type { ProductTheme } from "@/lib/design-tokens";
import { themeClasses } from "@/lib/theme-classes";

// Trois flacons du premier écran (modification 22) : Fabulous à gauche, Miraculous au centre
// (plus grand, plus haut), Luxurious à droite ; légèrement superposés, inclinés vers l'extérieur.
const layout: Record<ProductTheme, { order: number; tilt: string; size: string; lift: string; blob: string; delay: string }> = {
  fabulous: { order: 0, tilt: "-rotate-[5deg]", size: "w-[27%]", lift: "mt-6", blob: "bg-fabulous", delay: "0s" },
  miraculous: { order: 1, tilt: "", size: "w-[33%] z-10 -mx-[3%]", lift: "", blob: "bg-miraculous", delay: "0.5s" },
  luxurious: { order: 2, tilt: "rotate-[5deg]", size: "w-[27%]", lift: "mt-6", blob: "bg-luxurious-vivid", delay: "1s" },
};

export default function HeroBottles({ className = "" }: { className?: string }) {
  const ordered = [...products].sort((a, b) => layout[a.slug].order - layout[b.slug].order);
  return (
    <ul className={`flex items-start justify-center ${className}`}>
      {ordered.map((p) => {
        const l = layout[p.slug];
        const t = themeClasses[p.slug];
        return (
          <li key={p.slug} className={`flacon-monte relative ${l.size} ${l.lift}`} style={{ animationDelay: l.delay }}>
            {/* Forme douce dans la couleur du soin */}
            <div aria-hidden className={`absolute inset-x-[-12%] bottom-[4%] top-[18%] rounded-full ${l.blob} opacity-80`} />
            <Link href={`/soins/${p.slug}`} className={`relative block ${l.tilt}`}>
              {p.cutout.available ? (
                <Image
                  src={`/images/produits/${p.cutout.file}`}
                  alt={p.cutout.alt}
                  width={400}
                  height={1000}
                  priority
                  sizes="(max-width: 640px) 33vw, 220px"
                  className="h-auto w-full"
                />
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
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
