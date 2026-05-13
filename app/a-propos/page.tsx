import type { Metadata } from "next";
import Image from "next/image";
import { AboutSection, SiteFooter } from "@/components/ecommerce/AboutFaqFooter";
import MarqueeBar from "@/components/ecommerce/MarqueeBar";
import PageIntro from "@/components/ecommerce/PageIntro";
import SiteHeader from "@/components/ecommerce/SiteHeader";

export const metadata: Metadata = {
  title: "La marque | Na Nah N’hair",
  description: "Découvre l’histoire, les valeurs et l’univers Na Nah N’hair.",
};

export default function AProposPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--color-ink)]">
      <MarqueeBar />
      <SiteHeader />
      <main>
        <PageIntro
          eyebrow="La marque"
          title="Une histoire de confiance et de lumière ✨"
        />
        <section className="bg-white px-5 pb-12 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <div className="overflow-hidden rounded-[1.5rem] border border-[var(--color-lavender-mist)] bg-[var(--color-lavender-soft)]">
              <Image
                src="/images/page-la-marque.jpg"
                alt="La marque Na Nah N'hair"
                width={1366}
                height={2048}
                sizes="(min-width: 1024px) 672px, 100vw"
                className="h-auto w-full"
              />
            </div>
          </div>
        </section>
        <AboutSection />
      </main>
      <SiteFooter />
    </div>
  );
}
