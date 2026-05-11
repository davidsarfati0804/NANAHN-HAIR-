import Link from "next/link";
import { Music2, Sparkles } from "lucide-react";
import { heroCopy } from "@/data/site";
import ImagePlaceholder from "./ImagePlaceholder";

export default function HeroSection() {
  return (
    <section id="accueil" className="relative overflow-hidden bg-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-lavender-soft)] px-4 py-2 text-sm font-bold text-[var(--color-deep-violet)]">
            <Music2 size={16} />
            Haircare remix
          </div>
          <h1 className="text-7xl font-black leading-[0.82] text-[var(--color-deep-violet)] sm:text-8xl lg:text-[7.5rem] xl:text-[8.2rem]">
            {heroCopy.titleLines.map((line) => (
              <span key={line} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-7 text-2xl font-extrabold text-[var(--color-plum)]">{heroCopy.kicker}</p>
          <p className="mt-4 max-w-xl text-lg leading-8 text-[var(--color-ink)]">{heroCopy.body}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="rounded-full bg-[var(--color-lavender)] px-7 py-4 text-center font-bold text-white shadow-[0_16px_36px_rgba(170,161,200,0.42)] transition hover:-translate-y-0.5 hover:bg-[var(--color-plum)]" href="#boutique">
              Découvrir les sérums
            </Link>
            <Link className="rounded-full border border-[var(--color-lavender)] px-7 py-4 text-center font-bold text-[var(--color-deep-violet)] transition hover:-translate-y-0.5 hover:bg-[var(--color-lavender-soft)]" href="#pack">
              Voir le pack zéro prise de tête
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-5 -top-5 z-10 flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-bold text-[var(--color-deep-violet)] shadow-xl">
            <Sparkles size={17} className="text-[var(--color-gold)]" />
            Code NNH26
          </div>
          {/* TODO: remplacer par une photo horizontale des 3 flacons. */}
          <ImagePlaceholder label="Photo horizontale des 3 flacons" className="min-h-[420px] lg:min-h-[560px]" />
        </div>
      </div>
    </section>
  );
}
