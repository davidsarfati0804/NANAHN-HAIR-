import type { Metadata } from "next";
import Link from "next/link";
import ButtonLink from "@/components/ButtonLink";
import { emotionalConcept, productBySlug, story, storyPage } from "@/content/site";
import { formatPrice } from "@/lib/money";
import { getShopData } from "@/lib/shop-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: story.title,
  description: story.paragraphs[0],
};

export default async function StoryPage() {
  const { products: shop } = await getShopData();
  const miraculous = productBySlug("miraculous")!;
  const [first, ...rest] = story.paragraphs;
  const last = rest.pop()!;

  return (
    <article>
      <header className="relative overflow-hidden bg-lavender-soft">
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-miraculous opacity-70 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-plum">{storyPage.kicker}</p>
          <h1 className="mt-4 text-6xl text-deep-violet sm:text-8xl">{first}</h1>
        </div>
      </header>

      <div className="mx-auto max-w-2xl space-y-8 px-4 py-16 text-lg leading-relaxed sm:px-6 sm:text-xl">
        {rest.map((para) => (
          <p key={para}>{para}</p>
        ))}
      </div>

      <section className="mx-auto max-w-4xl px-4 sm:px-6">
        <blockquote className="rounded-[2rem] bg-deep-violet px-6 py-14 text-center text-white sm:px-12">
          <p className="font-display text-4xl leading-none sm:text-6xl">{last}</p>
        </blockquote>
      </section>

      <section className="mx-auto mt-16 max-w-4xl px-4 sm:px-6">
        <div className="rounded-[2rem] bg-miraculous p-8 text-miraculous-deep sm:p-12">
          <h2 className="text-5xl">{storyPage.founderTitle}</h2>
          <p className="mt-4 text-lg">{miraculous.text.charAt(0).toUpperCase() + miraculous.text.slice(1)}</p>
          <p className="mt-4 text-xl font-bold">{miraculous.phrase}</p>
          <Link href="/soins/miraculous" className="mt-6 inline-block rounded-full bg-miraculous-deep px-6 py-3 text-sm font-bold uppercase text-white">
            {miraculous.shortName} · {formatPrice(shop.miraculous.priceCents)}
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-4xl px-4 text-center sm:px-6">
        <h2 className="text-5xl text-deep-violet sm:text-6xl">{emotionalConcept.title}</h2>
        <p className="mt-4 text-lg font-bold">{emotionalConcept.lines.join(" ")}</p>
        <ButtonLink href={storyPage.shopCta.href} className="mt-8">
          {storyPage.shopCta.label}
        </ButtonLink>
      </section>
    </article>
  );
}
