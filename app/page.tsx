import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import AddToCartButton from "@/components/ecommerce/AddToCartButton";
import { SiteFooter } from "@/components/ecommerce/AboutFaqFooter";
import HeroSection from "@/components/ecommerce/HeroSection";
import MarqueeBar from "@/components/ecommerce/MarqueeBar";
import ProductCard from "@/components/ecommerce/ProductCard";
import ReassuranceStrip from "@/components/ecommerce/ReassuranceStrip";
import SiteHeader from "@/components/ecommerce/SiteHeader";
import { pack, products } from "@/data/products";

export const metadata: Metadata = {
  title: "Na Nah N’hair | Sérums capillaires",
  description:
    "Na Nah N’hair propose des sérums capillaires pour nourrir, sublimer et faire briller la routine cheveux avec une énergie fun et premium accessible.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Na Nah N’hair | Pas de chichis, juste du style",
    description:
      "Découvre les sérums Fabulous, Miraculous, Luxurious et le pack zéro prise de tête.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-[var(--color-ink)]">
      <MarqueeBar />
      <SiteHeader />
      <main>
        <HeroSection />
        <section className="bg-white px-5 py-14 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-plum)]">Boutique</p>
                <h2 className="mt-3 text-4xl font-black text-[var(--color-deep-violet)] md:text-6xl">
                  Choisis ton sérum capillaire ✨
                </h2>
              </div>
              <Link href="/boutique" className="rounded-full bg-[var(--color-lavender)] px-6 py-4 text-center font-black text-white transition hover:bg-[var(--color-plum)]">
                Voir toute la boutique
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} compact />
              ))}
            </div>
          </div>
        </section>

        <section id="pack" className="bg-[var(--color-lavender)] px-5 py-14 text-white lg:px-8 lg:py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <h2 className="inline-flex rounded-full bg-white px-4 py-2 text-lg font-black uppercase tracking-[0.08em] text-[var(--color-deep-violet)] md:text-xl">
                Pack routine
              </h2>
              <p className="mt-5 text-3xl font-black md:text-4xl">Le pack - Zéro prise de tête</p>
              <p className="mt-4 inline-flex rounded-full bg-[var(--color-pantone-7499)] px-4 py-2 text-xl font-black text-[var(--color-deep-violet)]">
                {pack.price}
              </p>
              <p className="mt-4 max-w-xl text-lg font-bold leading-8 text-white">
                Ne choisis pas un soin… choisis une expérience complète.
                <br />
                Trois sérums, une seule mission : nourrir, sublimer et révéler la beauté naturelle de tes cheveux.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <AddToCartButton item={pack} label="Commander le pack" variant="white" />
                <Link href="/routines" className="rounded-full border border-white/45 px-7 py-4 text-center font-black text-white">
                  En savoir plus
                </Link>
              </div>
            </div>
            <div className="relative min-h-[360px] overflow-hidden rounded-[1.5rem] border border-white/25 bg-white/10">
              <Image
                src={pack.image}
                alt={pack.photoLabel}
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover"
                style={{ objectPosition: "50% 88%" }}
              />
            </div>
          </div>
        </section>

        <ReassuranceStrip />

        <section className="bg-white px-5 py-14 lg:px-8 lg:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div className="flex h-full min-h-[290px] flex-col items-center justify-center rounded-[1.5rem] bg-white p-7 text-center shadow-[0_14px_34px_rgba(53,32,95,0.07)]">
              <Image
                src="/images/typographie-section-marque.png"
                alt="Na Nah N'hair"
                width={1772}
                height={1772}
                sizes="(min-width: 1024px) 300px, 68vw"
                className="h-auto w-full max-w-[300px]"
              />
            </div>
            <div className="flex h-full min-h-[290px] flex-col justify-center rounded-[1.5rem] bg-[var(--color-lavender)] p-7 text-white md:p-9">
              <p className="text-lg font-bold leading-8">
                Tout a commencé avec une histoire authentique.
                <br />
                Une femme, ses cheveux fragilisés par la maladie, et une envie profonde : les aider à renaître.
              </p>
              <Link href="/a-propos" className="mt-7 inline-flex rounded-full bg-white px-7 py-4 font-black text-[var(--color-deep-violet)]">
                Découvrir l’histoire
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
