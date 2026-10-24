import Image from "next/image";
import RichText from "@/components/RichText";
import Link from "next/link";
import ButtonLink from "@/components/ButtonLink";
import JsonLd from "@/components/JsonLd";
import LavenderBox from "@/components/LavenderBox";
import PhotoSlot from "@/components/PhotoSlot";
import StoryCards from "@/components/home/StoryCards";
import TrioHeading from "@/components/home/TrioHeading";
import TrioSelector from "@/components/home/TrioSelector";
import HeroBottles from "@/components/home/HeroBottles";
import SwipeList from "@/components/SwipeList";
import ToComplete from "@/components/ToComplete";
import { brand, emotionalConcept, home, pack, productPage, products } from "@/content/site";
import type { ProductId, PublicProduct } from "@/lib/catalog";
import { formatPrice } from "@/lib/money";
import { getShopData } from "@/lib/shop-data";
import { organizationJsonLd } from "@/lib/structured-data";
import { themeClasses } from "@/lib/theme-classes";
import { BrandText } from "@/components/BrandName";

export const dynamic = "force-dynamic";

type Shop = Record<ProductId, PublicProduct>;

export default async function HomePage() {
  const { products: shop, freeShipping } = await getShopData();
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <Hero freeShipping={freeShipping} />
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

// Premier écran (modification 22) : titre réduit, trois flacons, bouton principal visibles sans défiler
function Hero({ freeShipping }: { freeShipping: boolean }) {
  const { hero } = home;
  const reassurance = [...hero.reassurance, ...(freeShipping ? [hero.reassuranceShipping] : [])];
  return (
    <section className="relative isolate">
      {/* Fond dégradé : les couleurs des soins (débordement coupé sur ce calque seulement : la page ne peut pas glisser) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-fabulous opacity-60 blur-3xl" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-miraculous opacity-60 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-luxurious opacity-50 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-6 px-4 pb-6 pt-5 text-center sm:px-6 sm:pt-10 lg:grid-cols-2 lg:gap-12 lg:pb-10 lg:pt-14 lg:text-left">
        <div className="flex flex-col items-center lg:items-start">
          <div className="relative">
            {/* Police du logo non identifiable : logo vectorisé (SVG) + vrai titre h1 masqué pour le référencement */}
            <h1 className="sr-only">{brand.logo.alt}</h1>
            <Image
              src={brand.logoSvg.src}
              width={brand.logoSvg.width}
              height={brand.logoSvg.height}
              alt={brand.logo.alt}
              priority
              unoptimized
              className="h-[min(18svh,9rem)] w-auto sm:h-40 lg:h-48"
            />
          </div>
          <p className="mt-3 text-lg font-bold text-deep-violet sm:text-2xl">
            <BrandText text={hero.signature} tone="logo" />
          </p>
          <p className="mt-1 max-w-md text-sm font-light leading-snug sm:text-lg">{hero.subtitle}</p>

          <HeroBottles className="mt-3 w-full max-w-[15rem] sm:max-w-xs lg:hidden" />

          <div className="mt-5 flex w-full flex-col items-center sm:w-auto">
            <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:items-start">
              <div className="flex w-full flex-col items-center sm:w-auto">
                <ButtonLink href={hero.primaryCta.href} className="w-full sm:w-auto sm:whitespace-nowrap">
                  <BrandText text={hero.primaryCta.label} />
                </ButtonLink>
                <p className="mt-1 text-[0.8125rem] text-deep-violet">{hero.quizHint}</p>
              </div>
              <ButtonLink href={hero.secondaryCta.href} variant="secondary" className="w-full sm:w-auto sm:whitespace-nowrap">
                {hero.secondaryCta.label}
              </ButtonLink>
            </div>
            <p className="mt-4 text-center text-[0.8125rem] font-bold text-deep-violet">{reassurance.join(" · ")}</p>
          </div>
        </div>

        <HeroBottles className="mx-auto hidden w-full max-w-md lg:flex" />

        <a
          href={hero.scrollCta.href}
          className="mx-auto inline-flex min-h-11 items-center gap-2 text-sm font-bold text-deep-violet underline-offset-4 hover:underline lg:col-span-2"
        >
          {hero.scrollCta.label}
          <span aria-hidden className="fleche-rebond inline-block">
            ↓
          </span>
        </a>
      </div>
    </section>
  );
}

function SectionTitle({ kicker, title, id }: { kicker: string; title: string; id?: string }) {
  return (
    <div className="mb-6 sm:mb-10">
      <p className="surtitre">{kicker}</p>
      <h2 id={id} className="mt-2 titre-h2">
        {title}
      </h2>
    </div>
  );
}

function Trio({ shop }: { shop: Shop }) {
  return (
    <section aria-labelledby="trio" className="section">
      <TrioHeading />
      <TrioSelector prices={trioPrices(shop)} />
    </section>
  );
}

function trioPrices(shop: Shop) {
  return { fabulous: formatPrice(shop.fabulous.priceCents), miraculous: formatPrice(shop.miraculous.priceCents), luxurious: formatPrice(shop.luxurious.priceCents) };
}

function Concept() {
  const chips = ["fabulous", "miraculous", "luxurious"] as const;
  return (
    <section className="section">
      <LavenderBox as="div" className="px-5 py-10 text-center sm:px-12 sm:py-20">
        {/* Citation centrée, lignes équilibrées, marges égales même sur mobile */}
        <h2 className="mx-auto max-w-[18ch] text-center text-[clamp(2.5rem,10vw,5.5rem)] [text-wrap:balance]">
          {emotionalConcept.title}
        </h2>
        <ul className="mt-6 flex flex-wrap justify-center gap-2 sm:mt-10 sm:gap-3">
          {emotionalConcept.lines.map((line, i) => {
            const theme = chips[i];
            return (
              <li
                key={line}
                className={`rounded-full px-5 py-2 text-base font-bold sm:px-6 sm:py-3 sm:text-xl ${
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
      </LavenderBox>
    </section>
  );
}

function Products({ shop }: { shop: Shop }) {
  return (
    <section aria-labelledby="soins" className="section">
      <SectionTitle kicker={home.products.kicker} title={home.products.title} id="soins" />
      {/* 7 lignes communes aux trois cartes : nom, 3 bénéfices, odeur, contenance, lien prix (modification 41) */}
      <SwipeList
        label={home.products.title}
        rows={7}
        cards={products.map((p) => {
          const t = themeClasses[p.slug];
          return {
            key: p.slug,
            className: `rounded-[2rem] border-2 ${t.border} p-5 md:p-6`,
            content: (
              <>
                <h3>
                  <span className={`block nom-produit max-sm:text-[2rem] ${t.name}`}>{p.shortName}</span>
                  <span className="mt-1 block font-body text-sm font-bold uppercase tracking-wide"> {productPage.serumLabel}</span>
                </h3>
                <ul className="contents">
                  {p.highlights.map((h, i) => (
                    <li
                      key={h}
                      className={`${t.soft} ${t.text} flex items-center rounded-2xl px-3 py-2 font-bold md:px-4 md:py-3 ${i === 0 ? "mt-4 md:mt-5" : "mt-2 md:mt-3"}`}
                    >
                      {h}
                    </li>
                  ))}
                </ul>
                <dl className="contents text-sm">
                  <div className="mt-5 grid grid-cols-[6.5rem_1fr] gap-2 text-sm">
                    <dt className="font-bold">{home.products.scentLabel}</dt>
                    <dd>{p.scent}</dd>
                  </div>
                  <div className="mt-2 grid grid-cols-[6.5rem_1fr] gap-2 text-sm">
                    <dt className="font-bold">{home.products.volumeLabel}</dt>
                    <dd>{p.volume}</dd>
                  </div>
                </dl>
                <Link
                  href={`/soins/${p.slug}`}
                  className={`mt-3 inline-flex min-h-11 items-center self-start font-bold underline underline-offset-4 ${t.text}`}
                >
                  {p.shortName} · {formatPrice(shop[p.slug].priceCents)}
                </Link>
              </>
            ),
          };
        })}
      />
    </section>
  );
}

function Pack({ shop }: { shop: Shop }) {
  return (
    <section aria-labelledby="pack" className="section">
      <div className="grid items-center gap-6 md:grid-cols-2 md:gap-8">
        <PhotoSlot photo={pack.photo} src={shop.pack.photoUrl} className="mx-auto aspect-[4/5] w-full max-w-[14rem] rounded-[2rem] md:max-w-md" sizes="(max-width: 768px) 100vw, 50vw" />
        <div>
          <SectionTitle kicker={home.pack.kicker} title={pack.name} id="pack" />
          <p className="-mt-3 nom-produit sm:-mt-6">{formatPrice(shop.pack.priceCents)}</p>
          <LavenderBox className="mt-4 md:mt-6">
            <h3 className="titre-h3">{pack.contentTitle}</h3>
            <ol className="mt-3 space-y-2">
              {pack.content.map((item) => (
                <li key={item.product}>
                  <span className="font-bold">{item.product}</span> : {item.text}
                </li>
              ))}
            </ol>
            <h3 className="mt-5 titre-h3">{pack.usageTitle}</h3>
            <p className="mt-2">
              <RichText text={pack.usage} />
            </p>
          </LavenderBox>
          <ButtonLink href="/pack" className="mt-4 md:mt-6">
            {home.pack.cta}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

function StoryTeaser() {
  const s = home.story;
  return (
    <section aria-labelledby="histoire" className="overflow-hidden">
      <div className="section">
        <div className="text-center">
          <p className="surtitre">{s.kicker}</p>
          <h2 id="histoire" className="mt-3 titre-h2">
            {s.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-4 inline-block -rotate-2 rounded-md bg-logo-yellow px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-deep-violet">
            {s.sticker}
          </p>
        </div>
        <div className="mt-6 sm:mt-10">
          <StoryCards />
        </div>
        <p className="mt-4 text-center sm:mt-6">
          <Link href={s.readMore.href} className="inline-flex min-h-11 items-center font-bold text-deep-violet underline underline-offset-4">
            {s.readMore.label}
          </Link>
        </p>
      </div>
    </section>
  );
}

function Reasons() {
  return (
    <section aria-labelledby="raisons" className="section">
      <h2 id="raisons" className="mb-6 titre-h2 sm:mb-10">
        <BrandText text={home.reasons.title} tone="logo" />
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5">
        {home.reasons.items.map((r) => (
          <li key={r.title} className="rounded-3xl bg-lavender p-4 text-deep-violet sm:p-5">
            <h3 className="titre-h3">{r.title}</h3>
            {r.text && <p className="mt-2 text-sm">{r.text}</p>}
            {r.lines && (
              <ul className="mt-2 space-y-1 text-sm">
                {r.lines.map((l) => (
                  <li key={l.product}>
                    <span className="font-bold">{l.product}</span> : {l.text}
                  </li>
                ))}
              </ul>
            )}
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
    <section className="section">
      <div className="rounded-[2rem] bg-deep-violet px-6 py-10 text-center text-white sm:py-16">
        <h2 className="titre-h2 text-white">{finalCta.title}</h2>
        <p className="mt-4 accroche">{finalCta.text}</p>
        <ButtonLink href={finalCta.cta.href} variant="light" className="mt-6 sm:mt-8">
          {finalCta.cta.label}
        </ButtonLink>
      </div>
    </section>
  );
}
