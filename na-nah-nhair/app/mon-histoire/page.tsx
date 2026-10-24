import type { Metadata } from "next";
import Link from "next/link";
import ButtonLink from "@/components/ButtonLink";
import { emotionalConcept, productBySlug, story, storyPage } from "@/content/site";
import { BrandText } from "@/components/BrandName";

export const metadata: Metadata = {
  alternates: { canonical: "/mon-histoire" },
  title: story.title,
  description: story.paragraphs[0],
};

export default function StoryPage() {
  const miraculous = productBySlug("miraculous")!;

  return (
    <article>
      <header className="relative isolate bg-lavender-soft">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-miraculous opacity-70 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-28">
          <p className="surtitre">{storyPage.kicker}</p>
          <h1 className="mt-4 titre-h1">{story.heading}</h1>
        </div>
      </header>

      <div className="mx-auto max-w-2xl space-y-6 px-4 py-10 text-lg sm:space-y-8 sm:py-16 leading-relaxed sm:px-6 sm:text-xl">
        {story.paragraphs.map((para) => (
          <p key={para}>
            <BrandText text={para} />
          </p>
        ))}
      </div>

      <section className="mx-auto max-w-4xl px-4 sm:px-6">
        <blockquote className="rounded-[2rem] bg-deep-violet px-6 py-10 text-center text-white sm:px-12 sm:py-14">
          {/* Nom de marque dans la police et le violet du logo : contraste 3,1 sur violet foncé, AA en grand texte */}
          <p className="font-display text-[2rem] leading-none sm:text-6xl">
            <BrandText text={story.closing} tone="logo" />
          </p>
        </blockquote>
      </section>

      <section className="mx-auto mt-10 max-w-4xl sm:mt-16 px-4 sm:px-6">
        <div className="rounded-[2rem] bg-miraculous p-6 text-miraculous-deep sm:p-12">
          <h2 className="titre-h2">{storyPage.founderTitle}</h2>
          <p className="mt-4">{storyPage.founderText}</p>
          <p className="mt-4 accroche">{miraculous.phrase}</p>
          <Link href="/soins/miraculous" className="mt-6 inline-block rounded-full bg-miraculous-deep px-6 py-3 text-sm font-bold uppercase text-white">
            {storyPage.founderCta}
          </Link>
        </div>
      </section>

      {/* Manifeste (manifeste.html / manifeste.css fournis) */}
      <section className="mt-10 px-4 sm:mt-16 sm:px-6">
        <div className="manifeste">
          <div className="manifeste__cadre">
            <h2 className="manifeste__citation">{emotionalConcept.quote}</h2>
          </div>
          <ul className="manifeste__soins">
            {emotionalConcept.lines.slice(0, 3).map((line, i) => (
              <li key={line} className={`manifeste__soin manifeste__soin--${["fabulous", "miraculous", "luxurious"][i]}`}>
                {line}
              </li>
            ))}
          </ul>
          <p className="manifeste__trois">{emotionalConcept.lines[3]}</p>
          <ButtonLink href={storyPage.shopCta.href} className="mt-7">
            {storyPage.shopCta.label}
          </ButtonLink>
        </div>
      </section>
    </article>
  );
}
