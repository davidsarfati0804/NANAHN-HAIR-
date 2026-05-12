import type { Metadata } from "next";
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
          title="Tout a commencé avec une histoire vraie."
          text="Une femme, ses cheveux fragilisés par la maladie, et une envie profonde : les aider à renaître."
        />
        <AboutSection />
      </main>
      <SiteFooter />
    </div>
  );
}
