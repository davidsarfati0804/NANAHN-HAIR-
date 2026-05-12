import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { heroCopy } from "@/data/site";

export default function HeroSection() {
  return (
    <section id="accueil" className="relative overflow-hidden bg-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-24">
        <div>
          <Image
            src="/images/typographie-hero.png"
            alt="Na Nah N'hair"
            width={700}
            height={490}
            priority
            className="h-auto w-full max-w-[520px]"
          />
          <h1 className="mt-5 max-w-2xl text-4xl font-black leading-none text-[var(--color-deep-violet)] md:text-6xl">
            {heroCopy.kicker}
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-[var(--color-ink)]">{heroCopy.body}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="rounded-full bg-[var(--color-lavender)] px-7 py-4 text-center font-bold text-white shadow-[0_16px_36px_rgba(170,161,200,0.42)] transition hover:-translate-y-0.5 hover:bg-[var(--color-plum)]" href="/boutique">
              Découvrir les sérums
            </Link>
            <Link className="rounded-full border border-[var(--color-lavender)] px-7 py-4 text-center font-bold text-[var(--color-deep-violet)] transition hover:-translate-y-0.5 hover:bg-[var(--color-lavender-soft)]" href="/routines">
              Voir le pack
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-5 -top-5 z-10 flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-bold text-[var(--color-deep-violet)] shadow-xl">
            <Sparkles size={17} className="text-[var(--color-gold)]" />
            Code NNH26
          </div>
          <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-[var(--color-lavender-mist)] bg-white lg:min-h-[560px]">
            <Image
              src="/images/products/three-products.jpg"
              alt="Les trois sérums Na Nah N'hair"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              style={{ objectPosition: "50% 72%" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
