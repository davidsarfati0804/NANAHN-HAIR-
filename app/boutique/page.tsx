import type { Metadata } from "next";
import { SiteFooter } from "@/components/ecommerce/AboutFaqFooter";
import MarqueeBar from "@/components/ecommerce/MarqueeBar";
import PageIntro from "@/components/ecommerce/PageIntro";
import ProductCard from "@/components/ecommerce/ProductCard";
import ReassuranceStrip from "@/components/ecommerce/ReassuranceStrip";
import SiteHeader from "@/components/ecommerce/SiteHeader";
import { PackSection } from "@/components/ecommerce/ProductSections";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Boutique | Na Nah N’hair",
  description: "Choisis ton sérum Na Nah N’hair ou le pack complet selon ton besoin capillaire.",
};

const filters = ["Tous", "Nutrition", "Pousse & vitalité", "Brillance", "Pack"];

export default function BoutiquePage() {
  return (
    <div className="min-h-screen bg-white text-[var(--color-ink)]">
      <MarqueeBar />
      <SiteHeader />
      <main>
        <PageIntro
          eyebrow="Boutique"
          title="Choisis ton mix capillaire"
          text="Des sérums simples à comprendre, faciles à alterner et pensés pour accompagner tes besoins du moment."
        />
        <section className="bg-white px-5 pb-16 lg:px-8 lg:pb-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-7 flex gap-2 overflow-x-auto pb-2">
              {filters.map((filter) => (
                <span key={filter} className="shrink-0 rounded-full border border-[var(--color-lavender-mist)] bg-[var(--color-lavender-soft)] px-4 py-2 text-sm font-black text-[var(--color-deep-violet)]">
                  {filter}
                </span>
              ))}
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
        <PackSection />
        <ReassuranceStrip />
      </main>
      <SiteFooter />
    </div>
  );
}
