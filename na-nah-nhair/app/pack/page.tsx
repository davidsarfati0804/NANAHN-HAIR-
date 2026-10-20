import type { Metadata } from "next";
import Link from "next/link";
import ButtonLink from "@/components/ButtonLink";
import AddToCart from "@/components/cart/AddToCart";
import JsonLd from "@/components/JsonLd";
import LavenderBox from "@/components/LavenderBox";
import PhotoSlot from "@/components/PhotoSlot";
import { emotionalConcept, pack, productPage, products } from "@/content/site";
import { formatPrice } from "@/lib/money";
import { productJsonLd } from "@/lib/structured-data";
import { getShopData } from "@/lib/shop-data";
import { capitalize } from "@/lib/typography";
import { themeClasses } from "@/lib/theme-classes";
import { BrandText } from "@/components/BrandName";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: pack.name,
  alternates: { canonical: "/pack" },
  description: `${pack.contentTitle} : Fabulous, Miraculous et Luxurious.`,
};

export default async function PackPage() {
  const { products: shop } = await getShopData();
  return (
    <div className="section">
      <JsonLd
        data={productJsonLd({ name: pack.name, description: pack.content.map((c) => `${c.product} : ${c.text}`).join(" "), path: "/pack", shop: shop.pack })}
      />
      <div className="grid gap-10 md:grid-cols-2">
        <PhotoSlot photo={pack.photo} src={shop.pack.photoUrl} priority className="aspect-square rounded-[2rem]" />
        <div>
          <h1 className="nom-produit-grand">{pack.name}</h1>
          <p className="mt-2 nom-produit-grand">{formatPrice(shop.pack.priceCents)}</p>
          <p className="mt-6 accroche">{emotionalConcept.lines.join(" ")}</p>

          <h2 className="mt-8 titre-h3">{pack.contentTitle}</h2>
          <ol className="mt-3 grid gap-3">
            {pack.content.map((c, i) => {
              const p = products.find((x) => x.shortName === c.product)!;
              const t = themeClasses[p.slug];
              return (
                <li key={c.product} className={`${t.base} ${t.text} rounded-2xl px-4 py-3`}>
                  <span className="font-bold">
                    {i + 1}. <Link href={`/soins/${p.slug}`} className="inline-block py-1 underline underline-offset-4">{c.product}</Link>
                  </span>{" "}
                  : {c.text}
                </li>
              );
            })}
          </ol>

          <LavenderBox className="mt-6">
            <h2 className="titre-h3">{pack.usageTitle}</h2>
            <p className="mt-2">{capitalize(pack.usage)}</p>
          </LavenderBox>

          <AddToCart id="pack" name={pack.name} available={shop.pack.available} withQuantity className="mt-8" />
          <ButtonLink href={productPage.quizCta.href} variant="secondary" className="mt-3">
            <BrandText text={productPage.quizCta.label} />
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
