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
          title="Une histoire de confiance, de cheveux et d’énergie"
          text="Na Nah N’hair est née d’un moment de partage, avec une envie simple : créer des soins naturels, sensoriels et faciles à adopter."
        />
        <AboutSection />
      </main>
      <SiteFooter />
    </div>
  );
}
