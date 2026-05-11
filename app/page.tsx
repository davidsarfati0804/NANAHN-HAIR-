import type { Metadata } from "next";
import { AboutSection, CartPlaceholder, FaqSection, SiteFooter } from "@/components/ecommerce/AboutFaqFooter";
import BeforeAfterSlider from "@/components/ecommerce/BeforeAfterSlider";
import HeroSection from "@/components/ecommerce/HeroSection";
import MarqueeBar from "@/components/ecommerce/MarqueeBar";
import { PackSection, ProductGrid, WinningMixSection } from "@/components/ecommerce/ProductSections";
import ReviewsSection from "@/components/ecommerce/ReviewsSection";
import SiteHeader from "@/components/ecommerce/SiteHeader";

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
        <ProductGrid />
        <PackSection />
        <WinningMixSection />
        <BeforeAfterSlider />
        <ReviewsSection />
        <AboutSection />
        <FaqSection />
        <CartPlaceholder />
      </main>
      <SiteFooter />
    </div>
  );
}
