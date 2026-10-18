import Link from "next/link";
import ButtonLink from "@/components/ButtonLink";
import LavenderBox from "@/components/LavenderBox";
import PhotoSlot from "@/components/PhotoSlot";
import ProductCard from "@/components/ProductCard";
import ToComplete from "@/components/ToComplete";
import { emotionalConcept, home, pack, products, story } from "@/content/site";
import type { ProductId, PublicProduct } from "@/lib/catalog";
import { formatPrice } from "@/lib/money";
import { getShopData } from "@/lib/shop-data";
import { capitalize } from "@/lib/typography";
import { themeClasses } from "@/lib/theme-classes";

export const dynamic = "force-dynamic";

type Shop = Record<ProductId, PublicProduct>;

export default async function HomePage() {
  const { products: shop } = await getShopData();
  return (
    <>
      <Hero />
      <Trio shop={shop} />
      <Concept />
      <Products shop={shop} />
      <Pack shop={shop} />
      <StoryTeaser />
      <Reasons />
      <FinalCta />
    </>
  );
}

function Hero() {
  const { hero } = home;
  return (
    <section className="relative overflow-hidden">
      {/* Effet graphique : les trois couleurs des soins */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-fabulous opacity-60 blur-3xl" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-miraculous opacity-60 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-luxurious opacity-50 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.2fr_1fr] md:pt-20">
        <div>
          <h1 className="text-[clamp(5.5rem,22vw,11rem)] leading-[0.82] text-deep-violet">
            {hero.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-6 text-2xl font-bold text-plum sm:text-3xl">{hero.signature}</p>
          <p className="mt-3 max-w-md text-lg">{hero.subtitle}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href={hero.primaryCta.href}>{hero.primaryCta.label}</ButtonLink>
            <ButtonLink href={hero.secondaryCta.href} variant="secondary">
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>
        </div>

        <ul className="grid gap-4">
          {products.map((p, i) => {
            const t = themeClasses[p.slug];
            return (
              <li
                key={p.slug}
                className={`${t.base} ${t.text} rounded-full px-8 py-5 shadow-sm ${
                  i === 1 ? "lg:ml-8 lg:-mr-2" : "lg:mr-6"
                }`}
              >
                <span className="block font-display text-4xl sm:text-5xl">{p.shortName}</span>
                <span className="block text-sm font-bold">{p.phrase}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function SectionTitle({ kicker, title, id }: { kicker: string; title: string; id?: string }) {
  return (
    <div className="mb-10">
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-plum">{kicker}</p>
      <h2 id={id} className="mt-2 text-6xl text-deep-violet sm:text-7xl">
        {title}
      </h2>
    </div>
  );
}

function Trio({ shop }: { shop: Shop }) {
  return (
    <section aria-labelledby="trio" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionTitle kicker={home.trio.kicker} title={home.trio.title} id="trio" />
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <li key={p.slug}>
            <ProductCard product={p} shop={shop[p.slug]} cta={home.trio.cta} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function Concept() {
  const chips = ["fabulous", "miraculous", "luxurious"] as const;
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <LavenderBox as="div" className="px-6 py-14 text-center sm:px-12 sm:py-20">
        <h2 className="text-6xl sm:text-8xl">{emotionalConcept.title}</h2>
        <ul className="mt-10 flex flex-wrap justify-center gap-3">
          {emotionalConcept.lines.map((line, i) => {
            const theme = chips[i];
            return (
              <li
                key={line}
                className={`rounded-full px-6 py-3 text-lg font-bold sm:text-xl ${
                  theme
                    ? `${themeClasses[theme].base} ${themeClasses[theme].text}`
                    : "bg-deep-violet text-white"
                }`}
              >
                {line}
              </li>
            );
          })}
        </ul>
        <p className="mx-auto mt-8 max-w-xl">{emotionalConcept.note}</p>
      </LavenderBox>
    </section>
  );
}

function Products({ shop }: { shop: Shop }) {
  return (
    <section aria-labelledby="soins" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <SectionTitle kicker={home.products.kicker} title={home.products.title} id="soins" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => {
          const t = themeClasses[p.slug];
          return (
            <article key={p.slug} className={`rounded-[2rem] border-2 ${t.border} p-6`}>
              <h3 className={`text-4xl ${t.text}`}>{p.name}</h3>
              <ul className="mt-5 space-y-3">
                {p.highlights.map((h) => (
                  <li key={h} className={`${t.soft} ${t.text} rounded-2xl px-4 py-3 font-bold`}>
                    {h}
                  </li>
                ))}
              </ul>
              <dl className="mt-5 grid grid-cols-2 gap-2 text-sm">
                <dt className="font-bold">{home.products.scentLabel}</dt>
                <dd>{p.scent}</dd>
                <dt className="font-bold">{home.products.volumeLabel}</dt>
                <dd>{p.volume}</dd>
              </dl>
              <Link
                href={`/soins/${p.slug}`}
                className={`mt-4 inline-block py-2 font-bold underline underline-offset-4 ${t.text}`}
              >
                {p.shortName} · {formatPrice(shop[p.slug].priceCents)}
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Pack({ shop }: { shop: Shop }) {
  return (
    <section aria-labelledby="pack" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid items-center gap-8 md:grid-cols-2">
        <PhotoSlot photo={pack.photo} src={shop.pack.photoUrl} className="aspect-square rounded-[2rem]" />
        <div>
          <SectionTitle kicker={home.pack.kicker} title={pack.name} id="pack" />
          <p className="-mt-6 font-display text-5xl text-plum">{formatPrice(shop.pack.priceCents)}</p>
          <LavenderBox className="mt-6">
            <h3 className="font-body text-lg font-bold">{pack.contentTitle}</h3>
            <ol className="mt-3 space-y-2">
              {pack.content.map((item) => (
                <li key={item.product}>
                  <span className="font-bold">{item.product}</span> : {item.text}
                </li>
              ))}
            </ol>
            <h3 className="mt-5 font-body text-lg font-bold">{pack.usageTitle}</h3>
            <p className="mt-2">{capitalize(pack.usage)}</p>
          </LavenderBox>
          <ButtonLink href="/pack" className="mt-6">
            {home.pack.cta}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

function StoryTeaser() {
  return (
    <section aria-labelledby="histoire" className="bg-lavender-soft">
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-plum">{home.story.kicker}</p>
        <h2 id="histoire" className="mt-3 text-5xl text-deep-violet sm:text-6xl">
          {story.paragraphs[0]}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg">{story.paragraphs[1]}</p>
        <ButtonLink href="/mon-histoire" variant="secondary" className="mt-8">
          {home.story.cta}
        </ButtonLink>
      </div>
    </section>
  );
}

function Reasons() {
  return (
    <section aria-labelledby="raisons" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h2 id="raisons" className="mb-10 text-5xl text-deep-violet sm:text-6xl">
        {home.reasons.title}
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {home.reasons.items.map((r) => (
          <li key={r.title} className="rounded-3xl bg-lavender p-5 text-deep-violet">
            <h3 className="font-body text-lg font-bold leading-tight">{r.title}</h3>
            {r.text && <p className="mt-2 text-sm">{r.text}</p>}
            {r.todo && <ToComplete label={r.todo} className="mt-2 text-xs" />}
          </li>
        ))}
      </ul>
    </section>
  );
}

function FinalCta() {
  const { finalCta } = home;
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="rounded-[2rem] bg-deep-violet px-6 py-16 text-center text-white">
        <h2 className="text-6xl sm:text-8xl">{finalCta.title}</h2>
        <p className="mt-4 text-xl font-bold">{finalCta.text}</p>
        <ButtonLink href={finalCta.cta.href} variant="light" className="mt-8">
          {finalCta.cta.label}
        </ButtonLink>
      </div>
    </section>
  );
}
