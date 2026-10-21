import type { Metadata } from "next";
import ButtonLink from "@/components/ButtonLink";
import PhotoSlot from "@/components/PhotoSlot";
import ProductCard from "@/components/ProductCard";
import TrioHeading from "@/components/home/TrioHeading";
import { pack, products, productPage, soinsPage } from "@/content/site";
import { formatPrice } from "@/lib/money";
import { getShopData } from "@/lib/shop-data";
import { BrandText } from "@/components/BrandName";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/soins" },
  title: soinsPage.title,
  description: soinsPage.intro,
};

export default async function SoinsPage() {
  const { products: shop } = await getShopData();
  return (
    <div className="section">
      <h1 className="titre-h1">{soinsPage.title}</h1>
      <p className="mt-4 max-w-xl accroche">{soinsPage.intro}</p>
      <ButtonLink href={soinsPage.quizCta.href} className="mt-6">
        <BrandText text={soinsPage.quizCta.label} />
      </ButtonLink>

      <section aria-labelledby="trio" className="mt-16">
        <TrioHeading />
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <li key={p.slug}>
            <ProductCard product={p} shop={shop[p.slug]} cta={soinsPage.cta} />
          </li>
        ))}
      </ul>
      </section>

      <section aria-labelledby="pack" className="mt-16 grid items-center gap-8 rounded-[2rem] bg-lavender p-6 text-deep-violet sm:p-10 md:grid-cols-[1fr_1.4fr]">
        <PhotoSlot photo={pack.photo} src={shop.pack.photoUrl} className="aspect-[4/5] rounded-[1.5rem] bg-white" sizes="(max-width: 640px) 100vw, 25vw" />
        <div>
          <p className="surtitre">{productPage.packTitle}</p>
          <h2 id="pack" className="mt-2 titre-h2">
            {pack.name}
          </h2>
          <p className="mt-2 nom-produit">{formatPrice(shop.pack.priceCents)}</p>
          <ul className="mt-4 space-y-1">
            {pack.content.map((c) => (
              <li key={c.product}>
                <span className="font-bold">{c.product}</span> : {c.text}
              </li>
            ))}
          </ul>
          <ButtonLink href="/pack" className="mt-6">
            {productPage.packCta}
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
