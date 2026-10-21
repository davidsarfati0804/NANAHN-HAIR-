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

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => {
          const t = themeClasses[p.slug];
          const s = shop[p.slug];
          return (
            <li key={p.slug} className={`${t.base} ${t.text} flex flex-col rounded-[2rem] p-3`}>
              <Link href={`/soins/${p.slug}`} className="block">
                <PhotoSlot photo={p.photo} src={s.photoUrl} theme={p.slug} className="aspect-[4/5] rounded-[1.5rem]" sizes="(max-width: 640px) 100vw, 25vw" />
              </Link>
              <div className="flex flex-1 flex-col p-3">
                <h2 className={`nom-produit ${t.name}`}>
                  <Link href={`/soins/${p.slug}`}>{p.shortName}</Link>
                </h2>
                <p className="text-xs font-bold uppercase">{p.name} · {p.volume}</p>
                <p className="mt-2 text-sm font-bold">{p.phrase}</p>
                <p className="mt-auto pt-4 nom-produit">{formatPrice(s.priceCents)}</p>
                <AddToCart id={p.slug} name={p.name} available={s.available} className="mt-2" buttonClassName={`${t.button} w-full`} />
              </div>
            </li>
          );
        })}
        <li className="flex flex-col rounded-[2rem] bg-lavender p-3 text-deep-violet">
          <Link href="/pack" className="block">
            <PhotoSlot photo={pack.photo} src={shop.pack.photoUrl} className="aspect-[4/5] rounded-[1.5rem] bg-white" sizes="(max-width: 640px) 100vw, 25vw" />
          </Link>
          <div className="flex flex-1 flex-col p-3">
            <h2 className="nom-produit">
              <Link href="/pack">{pack.name}</Link>
            </h2>
            <p className="mt-2 text-sm font-bold">{pack.contentShort}</p>
            <p className="mt-auto pt-4 nom-produit">{formatPrice(shop.pack.priceCents)}</p>
            <AddToCart id="pack" name={pack.name} available={shop.pack.available} className="mt-2" buttonClassName="w-full bg-deep-violet text-white hover:bg-plum" />
          </div>
        </li>
      </ul>
    </div>
  );
}
