import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ButtonLink from "@/components/ButtonLink";
import AddToCart from "@/components/cart/AddToCart";
import JsonLd from "@/components/JsonLd";
import PhotoSlot from "@/components/PhotoSlot";
import UsageGuide from "@/components/product/UsageGuide";
import Fold from "@/components/product/Fold";
import StickyBuyBar from "@/components/product/StickyBuyBar";
import ToComplete from "@/components/ToComplete";
import { pack, productBySlug, productPage as l, products } from "@/content/site";
import { formatPrice } from "@/lib/money";
import { productJsonLd } from "@/lib/structured-data";
import { getShopData } from "@/lib/shop-data";
import { capitalize } from "@/lib/typography";
import { themeClasses } from "@/lib/theme-classes";
import { BrandText } from "@/components/BrandName";

export const dynamicParams = false;
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = productBySlug(slug);
  return p
    ? {
        title: p.name,
        description: p.description.intro,
        alternates: { canonical: `/soins/${p.slug}` },
        openGraph: { images: [{ url: `/images/produits/${p.slug}-1200.jpg`, width: 1200, height: 1500, alt: p.photo.alt }] },
      }
    : {};
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = productBySlug(slug);
  if (!p) notFound();
  const { products: shop } = await getShopData();
  const t = themeClasses[p.slug];
  const others = products.filter((o) => o.slug !== p.slug);
  // Blocs encadrés : ton moyen du soin (plus soutenu que le fond clair de la page), texte foncé du soin
  const block = `${t.base} ${t.text} rounded-3xl p-6 sm:p-8`;
  const foldTone = `${t.base} ${t.text}`;

  return (
    <article className={`${t.soft} ${t.text} pb-20 md:pb-0`}>
      {/* Toute la fiche aux couleurs du soin, ton sur ton (modification 46) */}
      <JsonLd data={productJsonLd({ name: p.name, description: p.description.intro, path: `/soins/${p.slug}`, shop: shop[p.slug] })} />
      <div className={`${t.soft}`}>
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 md:grid-cols-2 md:gap-10 md:py-16">
          <PhotoSlot
            photo={p.photo}
            src={shop[p.slug].photoUrl}
            theme={p.slug}
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="mx-auto aspect-[4/5] w-full max-w-[16rem] rounded-[2rem] md:sticky md:top-28 md:max-w-none"
          />

          <div className={t.text}>
            {p.founder && (
              <p className={`${t.base} inline-block rounded-full px-4 py-2 text-sm font-bold uppercase tracking-wide`}>
                {l.founderBadge}
              </p>
            )}
            <h1 className="mt-4">
              <span className={`block nom-produit-grand ${t.name}`}>{p.shortName}</span>
              <span className="mt-1 block font-body text-sm font-bold uppercase tracking-wide"> {l.serumLabel}</span>
            </h1>
            <p className="mt-2 nom-produit-grand">
              <span className="sr-only">{l.priceLabel} : </span>
              {formatPrice(shop[p.slug].priceCents)}
            </p>
            <p className="mt-4 accroche md:mt-6">{p.phrase}</p>

            <p className="mt-4 md:mt-6">{p.iAm}</p>
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
              <dt className="font-bold">{l.scentLabel}</dt>
              <dd>{p.scent}</dd>
              <dt className="font-bold">{l.volumeLabel}</dt>
              <dd>{p.volume}</dd>
            </dl>
            <p className="mt-4">{capitalize(p.text)}</p>

            <h2 className="mt-6 titre-h3 md:mt-8">{l.highlightsTitle}</h2>
            <ul className="mt-3 grid gap-2 md:gap-3">
              {p.highlights.map((h) => (
                <li key={h} className={`${t.base} rounded-2xl px-4 py-2 font-bold md:py-3`}>
                  {h}
                </li>
              ))}
            </ul>

            <div id="achat" />
            <AddToCart
              id={p.slug}
              name={p.name}
              available={shop[p.slug].available}
              withQuantity
              className="mt-6 md:mt-8"
              buttonClassName={t.button}
            />
            <ButtonLink href={l.quizCta.href} variant="secondary" className="mt-3">
              <BrandText text={l.quizCta.label} />
            </ButtonLink>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-8 sm:gap-6 sm:px-6 sm:py-24 md:grid-cols-2">
        <section className={`${block} md:col-span-2`}>
          <h2 className="titre-h3">{l.descriptionTitle}</h2>
          <p className="mt-3">{p.description.intro}</p>
          <p className="mt-3">{p.description.vitamins}</p>
          <p className="mt-3 font-bold">{p.description.helpsTitle}</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            {p.description.helps.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          {p.description.outro && <p className="mt-3">{p.description.outro}</p>}
        </section>

        <Fold title={l.inciTitle} tone={foldTone} className="md:col-span-2">
          <p className="text-sm leading-relaxed">{p.inci}</p>
          <ul className="mt-3 text-sm">
            {p.inciNotes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </Fold>

        {/* Mode d'emploi fourni : il contient aussi les précautions, affiché sur toute la largeur */}
        <Fold title={l.usageTitle} tone={foldTone} className={p.usage ? "md:col-span-2" : ""}>
          {p.usage ? <UsageGuide guide={p.usage} theme={p.slug} /> : <ToComplete label={`mode d'emploi ${p.shortName}`} />}
        </Fold>

        {!p.usage && (
          <section className={block}>
            <h2 className="titre-h3">{l.precautionsTitle}</h2>
            <div className="mt-3">
              {p.precautions ? <p>{p.precautions}</p> : <ToComplete label={`précautions d'emploi ${p.shortName}`} />}
            </div>
          </section>
        )}

        <Fold title={l.faqTitle} tone={foldTone} className="md:col-span-2">
          <ToComplete label={`FAQ ${p.shortName} (questions et réponses)`} />
        </Fold>
      </div>

      <section aria-labelledby="autres" className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 id="autres" className="titre-h2">
          {l.othersTitle}
        </h2>
        <ul className="mt-4 grid gap-3 sm:mt-6 sm:grid-cols-3 sm:gap-4">
          {others.map((o) => {
            const ot = themeClasses[o.slug];
            return (
              <li key={o.slug}>
                <Link href={`/soins/${o.slug}`} className={`${ot.base} ${ot.text} flex h-full flex-wrap items-baseline justify-between gap-x-4 rounded-3xl p-5 sm:block sm:p-6`}>
                  <span className={`nom-produit ${themeClasses[o.slug].name}`}>{o.shortName}</span>
                  <span className="order-last mt-1 block w-full text-sm font-bold sm:order-none">{o.phrase}</span>
                  <span className="block nom-produit sm:mt-4">{formatPrice(shop[o.slug].priceCents)}</span>
                </Link>
              </li>
            );
          })}
          <li>
            <Link href="/pack" className="flex h-full flex-wrap items-baseline justify-between gap-x-4 rounded-3xl bg-deep-violet p-5 text-white sm:block sm:p-6">
              <span className="block nom-produit">{pack.name}</span>
              <span className="block nom-produit sm:mt-4">{formatPrice(shop.pack.priceCents)}</span>
            </Link>
          </li>
        </ul>
      </section>
      <StickyBuyBar
        id={p.slug}
        name={p.shortName}
        price={formatPrice(shop[p.slug].priceCents)}
        available={shop[p.slug].available}
        targetId="achat"
        buttonClassName={t.button}
      />
    </article>
  );
}
