import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/ecommerce/AboutFaqFooter";
import AddToCartButton from "@/components/ecommerce/AddToCartButton";
import ImagePlaceholder from "@/components/ecommerce/ImagePlaceholder";
import MarqueeBar from "@/components/ecommerce/MarqueeBar";
import SiteHeader from "@/components/ecommerce/SiteHeader";
import { products } from "@/data/products";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((item) => item.id === id);

  if (!product) {
    return {
      title: "Produit introuvable",
    };
  }

  return {
    title: product.name,
    description: product.description,
  };
}

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = products.find((item) => item.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white text-[var(--color-ink)]">
      <MarqueeBar />
      <SiteHeader />
      <main className="px-5 py-12 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          {/* TODO: remplacer par les vraies photos produit et détails composition. */}
          <ImagePlaceholder label={`Photo ${product.name}`} className="min-h-[520px]" />
          <section>
            <Link
              href="/#boutique"
              className="text-sm font-black uppercase tracking-[0.16em] text-[var(--color-plum)]"
            >
              Retour boutique
            </Link>
            <h1 className="mt-5 text-5xl font-black leading-none text-[var(--color-deep-violet)] md:text-7xl">
              {product.name}
            </h1>
            <p className="mt-5 inline-flex rounded-full bg-[var(--color-lavender-soft)] px-4 py-2 font-black text-[var(--color-deep-violet)]">
              Odeur : {product.scent}
            </p>
            <p className="mt-6 text-4xl font-black text-[var(--color-deep-violet)]">
              {product.price}
            </p>
            <p className="mt-6 max-w-2xl text-xl font-bold leading-9 text-[var(--color-ink)]">
              {product.description}
            </p>
            <div className="mt-8 max-w-sm">
              <AddToCartButton item={product} />
            </div>
            <div className="mt-8 rounded-[2rem] bg-[var(--color-blush)] p-6">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[var(--color-plum)]">
                À compléter
              </p>
              <p className="mt-3 leading-7 text-[var(--color-ink)]">
                TODO: ajouter composition, conseils d’utilisation, précautions, contenance et informations de livraison.
              </p>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
