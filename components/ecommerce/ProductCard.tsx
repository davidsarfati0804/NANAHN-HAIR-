import Image from "next/image";
import Link from "next/link";
import { Droplets } from "lucide-react";
import type { Product } from "@/data/products";
import AddToCartButton from "./AddToCartButton";

type ProductCardProps = {
  product: Product;
  compact?: boolean;
};

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-[1.5rem] border border-[var(--color-lavender-mist)] bg-white p-4 shadow-[0_14px_34px_rgba(53,32,95,0.07)] transition hover:-translate-y-1">
      <Link href={`/produits/${product.id}`} className="relative aspect-[4/5] overflow-hidden rounded-[1.1rem] bg-[var(--color-lavender-soft)]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
          style={{ objectPosition: product.imagePosition }}
        />
      </Link>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-[var(--color-lavender-soft)] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[var(--color-deep-violet)]">
            <Droplets size={13} />
            {product.scent}
          </p>
          <h3 className="mt-3 text-2xl font-black text-[var(--color-deep-violet)]">{product.name}</h3>
        </div>
        <p className="shrink-0 rounded-full bg-[var(--color-pantone-7499)] px-3 py-2 text-sm font-black text-[var(--color-deep-violet)]">
          {product.price}
        </p>
      </div>

      <p className="mt-3 font-black text-[var(--color-plum)]">{product.headline}</p>
      {!compact && <p className="mt-2 flex-1 text-sm leading-6 text-[var(--color-ink)]">{product.description}</p>}

      <div className="mt-5 grid gap-2">
        <AddToCartButton item={product} />
        <Link href={`/produits/${product.id}`} className="rounded-full border border-[var(--color-lavender)] px-5 py-3 text-center text-sm font-bold text-[var(--color-deep-violet)] transition hover:bg-[var(--color-lavender-soft)]">
          Voir le produit
        </Link>
      </div>
    </article>
  );
}
