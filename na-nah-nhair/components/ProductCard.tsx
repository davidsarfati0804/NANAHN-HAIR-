import Link from "next/link";
import PhotoSlot from "@/components/PhotoSlot";
import type { Product } from "@/content/site";
import type { PublicProduct } from "@/lib/catalog";
import { formatPrice } from "@/lib/money";
import { themeClasses } from "@/lib/theme-classes";

// Carte « personnalité » d'un soin, utilisée sur l'accueil et la page des trois soins
export default function ProductCard({
  product: p,
  shop,
  cta,
  headingLevel: H = "h3",
}: {
  product: Product;
  shop: PublicProduct;
  cta: string;
  headingLevel?: "h2" | "h3";
}) {
  const t = themeClasses[p.slug];
  return (
    <article className={`${t.base} ${t.text} flex h-full flex-col overflow-hidden rounded-[2rem]`}>
      <PhotoSlot photo={p.photo} src={shop.photoUrl} theme={p.slug} className="m-3 aspect-[4/5] rounded-[1.5rem]" />
      <div className="flex flex-1 flex-col p-6 pt-3">
        <H className="text-5xl">{p.shortName}</H>
        <p className="mt-1 text-sm font-bold uppercase tracking-wide">{p.name}</p>
        <p className="mt-4">
          <span className="font-bold">Personnalité : </span>
          {p.personality}
        </p>
        <p className="mt-1">
          <span className="font-bold">Univers : </span>
          {p.universe}
        </p>
        <p className="mt-4 text-lg font-bold">{p.phrase}</p>
        <div className="mt-auto flex items-center justify-between gap-4 pt-6">
          <span className="font-display text-4xl">{formatPrice(shop.priceCents)}</span>
          <Link href={`/soins/${p.slug}`} className={`${t.button} rounded-full px-5 py-3 text-sm font-bold uppercase`}>
            {cta}
            <span className="sr-only"> {p.shortName}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
