import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/ecommerce/AboutFaqFooter";
import MarqueeBar from "@/components/ecommerce/MarqueeBar";
import PageIntro from "@/components/ecommerce/PageIntro";
import { WinningMixSection } from "@/components/ecommerce/ProductSections";
import SiteHeader from "@/components/ecommerce/SiteHeader";

export const metadata: Metadata = {
  title: "Routines | Na Nah N’hair",
  description: "Comprends comment alterner les sérums Na Nah N’hair selon tes besoins.",
};

export default function RoutinesPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--color-ink)]">
      <MarqueeBar />
      <SiteHeader />
      <main>
        <PageIntro
          eyebrow="Routines"
          title="Une routine simple pour chaque moment ✨"
          text={`La routine idéale pour tes cheveux nourris, stimulés et lumineux ✨\nParce que tes cheveux méritent qu’on prenne soin d’eux tout simplement !`}
        />
        <section className="bg-white px-5 pb-16 lg:px-8 lg:pb-20">
          <div className="mx-auto max-w-2xl">
            <div className="overflow-hidden rounded-[1.5rem] border border-[var(--color-lavender-mist)] bg-[var(--color-lavender-soft)]">
              <Image
                src="/images/page-routine.jpg"
                alt="Routine Na Nah N'hair"
                width={1328}
                height={2048}
                sizes="(min-width: 1024px) 672px, 100vw"
                className="h-auto w-full"
              />
            </div>
          </div>
        </section>
        <WinningMixSection />
        <section className="bg-white px-5 py-12 text-center lg:px-8">
          <Link href="/boutique" className="inline-flex rounded-full bg-[var(--color-lavender)] px-7 py-4 font-black text-white">
            Compose ta magie
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
