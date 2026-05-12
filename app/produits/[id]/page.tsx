import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/ecommerce/AboutFaqFooter";
import AddToCartButton from "@/components/ecommerce/AddToCartButton";
import MarqueeBar from "@/components/ecommerce/MarqueeBar";
import ProductCard from "@/components/ecommerce/ProductCard";
import ReassuranceStrip from "@/components/ecommerce/ReassuranceStrip";
import SiteHeader from "@/components/ecommerce/SiteHeader";
import { UsageGuidePanel } from "@/components/ecommerce/UsageGuide";
import { products } from "@/data/products";
import { inciItems } from "@/data/site";

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

  const inci = inciItems.find((item) => item.title === product.inciTitle);
  const recommended = products.filter((item) => item.id !== product.id).slice(0, 2);

  return (
    <div className="min-h-screen bg-white text-[var(--color-ink)]">
      <MarqueeBar />
      <SiteHeader />
      <main>
        <section className="px-5 py-12 lg:px-8 lg:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="relative min-h-[520px] overflow-hidden rounded-[1.5rem] border border-[var(--color-lavender-mist)] bg-[var(--color-lavender-soft)]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="object-cover"
              style={{ objectPosition: product.imagePosition }}
            />
          </div>
          <section>
            <Link
              href="/boutique"
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
            <p className="mt-6 text-2xl font-black text-[var(--color-plum)]">
              {product.headline}
            </p>
            <p className="mt-6 max-w-2xl text-xl font-bold leading-9 text-[var(--color-ink)]">
              {product.description}
            </p>
            <ul className="mt-6 grid items-stretch gap-3 sm:grid-cols-3">
              {product.benefits.map((benefit) => (
                <li key={benefit} className="flex min-h-24 items-center justify-center rounded-[1rem] bg-[var(--color-lavender-soft)] px-4 py-4 text-center text-sm font-black leading-5 text-[var(--color-deep-violet)]">
                  <span className="max-w-[13rem]">{benefit}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 max-w-sm">
              <AddToCartButton item={product} />
            </div>
            <div className="mt-8 rounded-[1.5rem] bg-[var(--color-lavender-soft)] p-6 text-[var(--color-deep-violet)]">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[var(--color-plum)]">
                Contenance
              </p>
              <p className="mt-3 leading-7">
                30 mL - 1.01 fl.oz
              </p>
            </div>
          </section>
        </div>
        </section>

        <section className="bg-white px-5 pb-16 lg:px-8 lg:pb-20">
          <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-plum)]">Détails</p>
              <h2 className="mt-3 text-4xl font-black text-[var(--color-deep-violet)] md:text-5xl">
                Tout savoir avant d’ajouter au panier
              </h2>
            </div>
            <div className="grid gap-4">
              <details open className="group rounded-[1.2rem] bg-[var(--color-lavender-soft)] p-5 text-[var(--color-deep-violet)]">
                <summary className="cursor-pointer list-none font-black">Description complète</summary>
                <p className="mt-3 whitespace-pre-line leading-7">{product.fullDescription}</p>
              </details>
              <details className="group rounded-[1.2rem] bg-[var(--color-lavender-soft)] p-5 text-[var(--color-deep-violet)]">
                <summary className="cursor-pointer list-none font-black">Mode d’utilisation</summary>
                <div className="mt-5">
                  <UsageGuidePanel productName={product.name} />
                </div>
              </details>
              <details className="group rounded-[1.2rem] bg-[var(--color-lavender-soft)] p-5 text-[var(--color-deep-violet)]">
                <summary className="cursor-pointer list-none font-black">Ingrédients</summary>
                <p className="mt-3 whitespace-pre-line text-sm leading-7">{inci?.text}</p>
              </details>
              <details className="group rounded-[1.2rem] bg-[var(--color-lavender-soft)] p-5 text-[var(--color-deep-violet)]">
                <summary className="cursor-pointer list-none font-black">Livraison & retours</summary>
                <p className="mt-3 leading-7">
                  Les informations finales seront confirmées avant l’ouverture officielle des commandes.
                </p>
              </details>
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-blush)] px-5 py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-4xl font-black text-[var(--color-deep-violet)] md:text-5xl">À associer avec</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {recommended.map((item) => (
                <ProductCard key={item.id} product={item} compact />
              ))}
            </div>
          </div>
        </section>

        <ReassuranceStrip />
      </main>
      <SiteFooter />
    </div>
  );
}
