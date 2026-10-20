import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCart from "@/components/cart/AddToCart";
import ButtonLink from "@/components/ButtonLink";
import LavenderBox from "@/components/LavenderBox";
import PhotoSlot from "@/components/PhotoSlot";
import ShareButton from "@/components/ShareButton";
import { pack, productBySlug, productPage, quiz } from "@/content/site";
import { formatPrice } from "@/lib/money";
import { isQuizResult, QUIZ_RESULTS } from "@/lib/quiz";
import { getShopData } from "@/lib/shop-data";
import { capitalize } from "@/lib/typography";
import { themeClasses } from "@/lib/theme-classes";
import { BrandText } from "@/components/BrandName";

export const dynamic = "force-dynamic";
export const dynamicParams = false;

export function generateStaticParams() {
  return QUIZ_RESULTS.map((result) => ({ result }));
}

export async function generateMetadata({ params }: { params: Promise<{ result: string }> }): Promise<Metadata> {
  const { result } = await params;
  const name = result === "pack" ? pack.name : productBySlug(result)?.shortName;
  return { title: `${quiz.result.kicker} : ${name}`, robots: { index: false } };
}

export default async function QuizResultPage({ params }: { params: Promise<{ result: string }> }) {
  const { result } = await params;
  if (!isQuizResult(result)) notFound();
  const { products: shop } = await getShopData();
  const miraculous = productBySlug("miraculous")!;
  const { result: r } = quiz;

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-plum">
        <BrandText text={r.kicker} />
      </p>

      {result === "pack" ? (
        <section className="mt-4 grid gap-8 rounded-[2rem] bg-lavender p-6 text-deep-violet sm:p-10 md:grid-cols-2 [&>*]:min-w-0">
          <PhotoSlot photo={pack.photo} src={shop.pack.photoUrl} className="aspect-square rounded-[1.5rem] bg-white" />
          <div>
            <h1 className="text-[clamp(2.75rem,11vw,4.5rem)] md:text-[clamp(2.75rem,6vw,4.5rem)]">{r.packTitle}</h1>
            <p className="mt-4 text-lg">{r.packText}</p>
            <h2 className="mt-6 text-4xl">{pack.name}</h2>
            <p className="font-display text-5xl">{formatPrice(shop.pack.priceCents)}</p>
            <ul className="mt-3 space-y-1">
              {pack.content.map((c) => (
                <li key={c.product}>
                  <span className="font-bold">{c.product}</span> : {c.text}
                </li>
              ))}
            </ul>
            <AddToCart id="pack" name={pack.name} available={shop.pack.available} className="mt-6" />
            <Link href="/pack" className="mt-2 inline-block py-2 font-bold underline underline-offset-4">
              {r.productCta}
            </Link>
          </div>
        </section>
      ) : (
        <ProductResult slug={result} shop={shop} />
      )}

      <LavenderBox as="section" className="mt-10">
        <h2 className="text-4xl sm:text-5xl">{r.founderTitle}</h2>
        <p className="mt-3">{capitalize(miraculous.text)}</p>
        <p className="mt-2 font-bold">{miraculous.phrase}</p>
        <ButtonLink href="/soins/miraculous" className="mt-5">
          {r.founderCta}
        </ButtonLink>
      </LavenderBox>

      <section className="mt-10 rounded-[2rem] bg-deep-violet px-6 py-14 text-center text-white">
        <p className="font-display text-5xl leading-none sm:text-7xl">{r.finalMessage}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href={r.finalCta.href} variant="light">
            {r.finalCta.label}
          </ButtonLink>
          <ButtonLink href="/quiz" variant="custom" className="border-2 border-white text-white hover:bg-plum">
            {quiz.restart}
          </ButtonLink>
        </div>
        <ShareButton name={result === "pack" ? pack.name : productBySlug(result)!.shortName} className="mt-6" />
      </section>
    </div>
  );
}

async function ProductResult({
  slug,
  shop,
}: {
  slug: "fabulous" | "miraculous" | "luxurious";
  shop: Awaited<ReturnType<typeof getShopData>>["products"];
}) {
  const p = productBySlug(slug)!;
  const t = themeClasses[slug];
  return (
    <section className={`${t.base} ${t.text} mt-4 grid gap-8 rounded-[2rem] p-6 sm:p-10 md:grid-cols-2 [&>*]:min-w-0`}>
      <PhotoSlot photo={p.photo} src={shop[slug].photoUrl} theme={slug} className="aspect-[4/5] rounded-[1.5rem]" />
      <div>
        <h1 className="text-[clamp(3rem,14vw,6rem)] md:text-[clamp(3rem,7vw,6rem)]">{p.shortName}</h1>
        <p className="mt-1 text-sm font-bold uppercase tracking-wide">{p.name}</p>
        <p className="mt-6 text-2xl font-bold">{p.phrase}</p>
        <p className="mt-4">
          <span className="font-bold">{productPage.personalityPrefix}</span>
          {p.personality}
        </p>
        <p className="mt-1">
          <span className="font-bold">{productPage.universePrefix}</span>
          {p.universe}
        </p>
        <p className="mt-4">{capitalize(p.text)}</p>
        <p className="mt-6 font-display text-5xl">{formatPrice(shop[slug].priceCents)}</p>
        <AddToCart id={slug} name={p.name} available={shop[slug].available} className="mt-4" buttonClassName={t.button} />
        <Link href={`/soins/${slug}`} className="mt-2 inline-block py-2 font-bold underline underline-offset-4">
          {quiz.result.productCta}
        </Link>
      </div>
    </section>
  );
}
