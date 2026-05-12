import type { Metadata } from "next";
import { SiteFooter } from "@/components/ecommerce/AboutFaqFooter";
import BeforeAfterSlider from "@/components/ecommerce/BeforeAfterSlider";
import MarqueeBar from "@/components/ecommerce/MarqueeBar";
import PageIntro from "@/components/ecommerce/PageIntro";
import ReviewsSection from "@/components/ecommerce/ReviewsSection";
import SiteHeader from "@/components/ecommerce/SiteHeader";

export const metadata: Metadata = {
  title: "Résultats | Na Nah N’hair",
  description: "Découvre les avant/après et retours d’expérience Na Nah N’hair.",
};

export default function ResultatsPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--color-ink)]">
      <MarqueeBar />
      <SiteHeader />
      <main>
        <PageIntro
          eyebrow="Résultats"
          title="Avant / après & retours d’expérience"
          text="Des visuels clairs pour observer les routines, avec une lecture prudente : chaque cheveu réagit différemment."
        />
        <BeforeAfterSlider />
        <ReviewsSection />
      </main>
      <SiteFooter />
    </div>
  );
}
