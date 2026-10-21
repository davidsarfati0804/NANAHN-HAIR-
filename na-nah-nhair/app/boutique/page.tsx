import type { Metadata } from "next";
import Link from "next/link";
import AddToCart from "@/components/cart/AddToCart";
import PhotoSlot from "@/components/PhotoSlot";
import { brand, pack, products, shop as texts } from "@/content/site";
import { formatPrice } from "@/lib/money";
import { getShopData } from "@/lib/shop-data";
import { themeClasses } from "@/lib/theme-classes";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  alternates: { canonical: "/boutique" }, title: texts.title, description: texts.intro };

export default async function BoutiquePage() {
  const { products: shop, freeShipping, freeShippingThresholdCents } = await getShopData();
  return (
    <div className="section">
      <h1 className="titre-h1">{texts.title}</h1>
      <p className="mt-3 accroche">{texts.intro}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <p className="rounded-2xl bg-lavender px-4 py-2 text-sm font-bold text-deep-violet">
          {freeShipping ? texts.freeShipping : texts.freeShippingFrom(formatPrice(freeShippingThresholdCents))}
        </p>
        <p className="rounded-2xl bg-lavender px-4 py-2 text-sm font-bold text-deep-violet">{brand.madeIn}</p>
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-6 lg:grid-cols-4">
        {products.map((p) => {
          const t = themeClasses[p.slug];
          const s = shop[p.slug];
          return (
            <li key={p.slug} className={`${t.base} ${t.text} flex flex-col rounded-3xl p-2 sm:rounded-[2rem] sm:p-3`}>
              <Link href={`/soins/${p.slug}`} className="block">
                <PhotoSlot photo={p.photo} src={s.photoUrl} theme={p.slug} className="aspect-[4/5] rounded-[1.5rem]" sizes="(max-width: 640px) 50vw, 25vw" />
              </Link>
              <div className="flex flex-1 flex-col p-2 sm:p-3">
                <h2 className={`nom-produit max-sm:text-[1.75rem] ${t.name}`}>
                  <Link href={`/soins/${p.slug}`}>{p.shortName}</Link>
                </h2>
                <p className="text-[0.8125rem] font-bold uppercase leading-snug">{p.name} · {p.volume}</p>
                <p className="mt-2 text-sm font-bold">{p.phrase}</p>
                <p className="mt-auto pt-3 nom-produit max-sm:text-[1.75rem] sm:pt-4">{formatPrice(s.priceCents)}</p>
                <AddToCart id={p.slug} name={p.name} available={s.available} className="mt-2" buttonClassName={`${t.button} w-full max-sm:px-2 max-sm:text-[0.75rem]`} />
              </div>
            </li>
          );
        })}
        <li className="flex flex-col rounded-3xl bg-lavender p-2 text-deep-violet sm:rounded-[2rem] sm:p-3">
          <Link href="/pack" className="block">
            <PhotoSlot photo={pack.photo} src={shop.pack.photoUrl} className="aspect-[4/5] rounded-[1.5rem] bg-white" sizes="(max-width: 640px) 50vw, 25vw" />
          </Link>
          <div className="flex flex-1 flex-col p-2 sm:p-3">
            <h2 className="nom-produit max-sm:text-[1.75rem]">
              <Link href="/pack">{pack.name}</Link>
            </h2>
            <p className="mt-2 text-sm font-bold">{pack.contentShort}</p>
            <p className="mt-auto pt-3 nom-produit max-sm:text-[1.75rem] sm:pt-4">{formatPrice(shop.pack.priceCents)}</p>
            <AddToCart id="pack" name={pack.name} available={shop.pack.available} className="mt-2" buttonClassName="w-full bg-deep-violet text-white hover:bg-plum max-sm:px-2 max-sm:text-[0.75rem]" />
          </div>
        </li>
      </ul>
    </div>
  );
}
