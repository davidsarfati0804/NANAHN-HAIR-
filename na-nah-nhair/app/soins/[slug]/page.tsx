import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCart from "@/components/cart/AddToCart";
import JsonLd from "@/components/JsonLd";
import LavenderBox from "@/components/LavenderBox";
import PhotoSlot from "@/components/PhotoSlot";
import ToComplete from "@/components/ToComplete";
import { pack, productBySlug, productPage as l, products } from "@/content/site";
import { formatPrice } from "@/lib/money";
import { productJsonLd } from "@/lib/structured-data";
import { getShopData } from "@/lib/shop-data";
import { capitalize } from "@/lib/typography";
import { themeClasses } from "@/lib/theme-classes";

export const dynamicParams = false;
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = productBySlug(slug);
  return p ? { title: p.name, description: p.description.intro, alternates: { canonical: `/soins/${p.slug}` } } : {};
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = productBySlug(slug);
  if (!p) notFound();
  const { products: shop } = await getShopData();
  const t = themeClasses[p.slug];
  const others = products.filter((o) => o.slug !== p.slug);

  return (
    <article>
      <JsonLd data={productJsonLd({ name: p.name, description: p.description.intro, path: `/soins/${p.slug}`, shop: shop[p.slug] })} />
      <div className={`${t.soft}`}>
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 md:py-16">
          <PhotoSlot
            photo={p.photo}
            src={shop[p.slug].photoUrl}
            theme={p.slug}
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="aspect-[4/5] rounded-[2rem] md:sticky md:top-28"
          />

          <div className={t.text}>
            {p.founder && (
              <p className={`${t.base} inline-block rounded-full px-4 py-2 text-sm font-bold uppercase tracking-wide`}>
                {l.founderBadge}
              </p>
            )}
            <h1 className="mt-4 text-6xl sm:text-7xl">{p.name}</h1>
            <p className="mt-2 font-display text-5xl">
              <span className="sr-only">{l.priceLabel} : </span>
              {formatPrice(shop[p.slug].priceCents)}
            </p>
            <p className="mt-6 text-xl font-bold">{p.phrase}</p>

            <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
              <dt className="font-bold">{l.personalityLabel}</dt>
              <dd>{p.personality}</dd>
              <dt className="font-bold">{l.universeLabel}</dt>
              <dd>{p.universe}</dd>
              <dt className="font-bold">{l.scentLabel}</dt>
              <dd>{p.scent}</dd>
              <dt className="font-bold">{l.volumeLabel}</dt>
              <dd>{p.volume}</dd>
            </dl>
            <p className="mt-4">{capitalize(p.text)}</p>

            <h2 className="mt-8 font-body text-lg font-bold">{l.highlightsTitle}</h2>
            <ul className="mt-3 grid gap-3">
              {p.highlights.map((h) => (
                <li key={h} className={`${t.base} rounded-2xl px-4 py-3 font-bold`}>
                  {h}
                </li>
              ))}
            </ul>

            <AddToCart
              id={p.slug}
              name={p.name}
              available={shop[p.slug].available}
              withQuantity
              className="mt-8"
              buttonClassName={t.button}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 sm:px-6 md:grid-cols-2">
        <LavenderBox as="section" className="md:col-span-2">
          <h2 className="font-body text-2xl font-bold">{l.descriptionTitle}</h2>
          <p className="mt-3">{p.description.intro}</p>
          <p className="mt-3">{p.description.vitamins}</p>
          <p className="mt-3 font-bold">{p.description.helpsTitle}</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            {p.description.helps.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          {p.description.outro && <p className="mt-3">{p.description.outro}</p>}
        </LavenderBox>

        <section className="rounded-3xl border-2 border-lavender-mist p-6 sm:p-8 md:col-span-2">
          <h2 className="font-body text-2xl font-bold text-deep-violet">{l.inciTitle}</h2>
          <p className="mt-3 text-sm leading-relaxed">{p.inci}</p>
          <ul className="mt-3 text-sm">
            {p.inciNotes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border-2 border-lavender-mist p-6 sm:p-8">
          <h2 className="font-body text-2xl font-bold text-deep-violet">{l.usageTitle}</h2>
          <div className="mt-3">{p.usage ? <p>{p.usage}</p> : <ToComplete label={`mode d'emploi ${p.shortName}`} />}</div>
        </section>

        <section className="rounded-3xl border-2 border-lavender-mist p-6 sm:p-8">
          <h2 className="font-body text-2xl font-bold text-deep-violet">{l.precautionsTitle}</h2>
          <div className="mt-3">
            {p.precautions ? <p>{p.precautions}</p> : <ToComplete label={`précautions d'emploi ${p.shortName}`} />}
          </div>
        </section>

        <section className="rounded-3xl border-2 border-lavender-mist p-6 sm:p-8 md:col-span-2">
          <h2 className="font-body text-2xl font-bold text-deep-violet">{l.faqTitle}</h2>
          <div className="mt-3">
            <ToComplete label={`FAQ ${p.shortName} (questions et réponses)`} />
          </div>
        </section>
      </div>

      <section aria-labelledby="autres" className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 id="autres" className="text-5xl text-deep-violet">
          {l.othersTitle}
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {others.map((o) => {
            const ot = themeClasses[o.slug];
            return (
              <li key={o.slug}>
                <Link href={`/soins/${o.slug}`} className={`${ot.base} ${ot.text} block h-full rounded-3xl p-6`}>
                  <span className="block font-display text-4xl">{o.shortName}</span>
                  <span className="mt-1 block text-sm font-bold">{o.phrase}</span>
                  <span className="mt-4 block font-display text-3xl">{formatPrice(shop[o.slug].priceCents)}</span>
                </Link>
              </li>
            );
          })}
          <li>
            <Link href="/pack" className="block h-full rounded-3xl bg-deep-violet p-6 text-white">
              <span className="block font-display text-4xl">{pack.name}</span>
              <span className="mt-4 block font-display text-3xl">{formatPrice(shop.pack.priceCents)}</span>
            </Link>
          </li>
        </ul>
      </section>
    </article>
  );
}
