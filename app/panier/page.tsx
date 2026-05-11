import type { Metadata } from "next";
import { SiteFooter } from "@/components/ecommerce/AboutFaqFooter";
import CartPageClient from "@/components/ecommerce/CartPageClient";
import MarqueeBar from "@/components/ecommerce/MarqueeBar";
import SiteHeader from "@/components/ecommerce/SiteHeader";

export const metadata: Metadata = {
  title: "Panier",
  description: "Retrouve les produits Na Nah N’hair ajoutés à ton panier.",
};

export default function PanierPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--color-ink)]">
      <MarqueeBar />
      <SiteHeader />
      <CartPageClient />
      <SiteFooter />
    </div>
  );
}
