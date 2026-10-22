import Link from "next/link";
import PhotoSlot from "@/components/PhotoSlot";
import { productPage, type Product } from "@/content/site";
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
      <PhotoSlot photo={p.photo} src={shop.photoUrl} theme={p.slug} className="mx-auto mt-3 aspect-[4/5] w-[calc(100%-1.5rem)] max-w-[14rem] rounded-[1.5rem] sm:m-3 sm:w-auto sm:max-w-none" sizes="(max-width: 640px) 224px, 33vw" />
      <div className="flex flex-1 flex-col p-5 pt-3 sm:p-6 sm:pt-3">
        <H>
          <span className={`nom-produit ${t.name}`}>{p.shortName}</span>
        </H>
        <p className="mt-1 text-sm font-bold uppercase tracking-wide">{productPage.serumLabel}</p>
        <p className="mt-3 sm:mt-4">{p.iAm}</p>
        <p className="mt-3 accroche sm:mt-4">{p.phrase}</p>
        <div className="mt-auto flex items-center justify-between gap-4 pt-4 sm:pt-6">
          <span className="nom-produit">{formatPrice(shop.priceCents)}</span>
          <Link href={`/soins/${p.slug}`} className={`${t.button}`}>
            {cta}
            <span className="sr-only"> {p.shortName}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
