import type { Metadata } from "next";
import BoutiqueFilter from "@/components/ecommerce/BoutiqueFilter";
import { SiteFooter } from "@/components/ecommerce/AboutFaqFooter";
import MarqueeBar from "@/components/ecommerce/MarqueeBar";
import PageIntro from "@/components/ecommerce/PageIntro";
import ReassuranceStrip from "@/components/ecommerce/ReassuranceStrip";
import SiteHeader from "@/components/ecommerce/SiteHeader";
import { PackSection } from "@/components/ecommerce/ProductSections";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Boutique — Sérums capillaires",
  description: "Choisis ton sérum Na Nah N’hair ou le pack complet selon ton besoin capillaire.",
};

export default function BoutiquePage() {
  return (
    <div className="min-h-screen bg-white text-[var(--color-ink)]">
      <MarqueeBar />
      <SiteHeader />
      <main>
        <PageIntro
          eyebrow="Boutique"
          title="Choisis ton sérum capillaire"
        />
        <section className="bg-white px-5 pb-16 lg:px-8 lg:pb-20">
          <div className="mx-auto max-w-7xl">
            <BoutiqueFilter products={products} />
          </div>
        </section>
        <PackSection />
        <ReassuranceStrip />
      </main>
      <SiteFooter />
    </div>
  );
}
