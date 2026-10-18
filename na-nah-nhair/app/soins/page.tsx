import type { Metadata } from "next";
import ButtonLink from "@/components/ButtonLink";
import PhotoSlot from "@/components/PhotoSlot";
import ProductCard from "@/components/ProductCard";
import { pack, products, productPage, soinsPage } from "@/content/site";

export const metadata: Metadata = {
  title: soinsPage.title,
  description: soinsPage.intro,
};

export default function SoinsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <h1 className="text-7xl text-deep-violet sm:text-8xl">{soinsPage.title}</h1>
      <p className="mt-4 max-w-xl text-lg">{soinsPage.intro}</p>
      <ButtonLink href={soinsPage.quizCta.href} className="mt-6">
        {soinsPage.quizCta.label}
      </ButtonLink>

      <ul className="mt-12 grid gap-6 md:grid-cols-3">
        {products.map((p) => (
          <li key={p.slug}>
            <ProductCard product={p} cta={soinsPage.cta} headingLevel="h2" />
          </li>
        ))}
      </ul>

      <section aria-labelledby="pack" className="mt-16 grid items-center gap-8 rounded-[2rem] bg-lavender p-6 text-deep-violet sm:p-10 md:grid-cols-[1fr_1.4fr]">
        <PhotoSlot photo={pack.photo} className="aspect-square rounded-[1.5rem] bg-white" />
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em]">{productPage.packTitle}</p>
          <h2 id="pack" className="mt-2 text-6xl">
            {pack.name}
          </h2>
          <p className="mt-2 font-display text-5xl">{pack.price}</p>
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
