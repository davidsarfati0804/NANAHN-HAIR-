import type { Metadata } from "next";
import { FaqSection, IngredientsSection, SiteFooter } from "@/components/ecommerce/AboutFaqFooter";
import MarqueeBar from "@/components/ecommerce/MarqueeBar";
import PageIntro from "@/components/ecommerce/PageIntro";
import SiteHeader from "@/components/ecommerce/SiteHeader";

export const metadata: Metadata = {
  title: "FAQ | Na Nah N’hair",
  description: "Questions fréquentes sur les sérums Na Nah N’hair.",
};

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--color-ink)]">
      <MarqueeBar />
      <SiteHeader />
      <main>
        <PageIntro
          eyebrow="Aide"
          title="On t’explique tout, sans prise de tête ✨"
          text="Utilisation, routines, résultats, livraisons …&#10;Retrouve ici toutes les réponses pour choisir ton sérum capillaire 💛"
        />
        <FaqSection />
        <IngredientsSection />
      </main>
      <SiteFooter />
    </div>
  );
}
