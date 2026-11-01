import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import StoryShare from "@/components/quiz/StoryShare";
import { productBySlug, quiz } from "@/content/site";
import { isQuizResult, QUIZ_RESULTS } from "@/lib/quiz";
import { themeClasses } from "@/lib/theme-classes";

export const dynamicParams = false;

export function generateStaticParams() {
  return QUIZ_RESULTS.map((result) => ({ result }));
}

export async function generateMetadata({ params }: { params: Promise<{ result: string }> }): Promise<Metadata> {
  const { result } = await params;
  const p = productBySlug(result);
  return { title: `${quiz.result.kicker} : ${p?.shortName ?? ""}`, robots: { index: false } };
}

// Écran résultat (modification 20) : fond de la couleur du soin, aucune photo de flacon
export default async function QuizResultPage({ params }: { params: Promise<{ result: string }> }) {
  const { result } = await params;
  if (!isQuizResult(result)) notFound();
  const p = productBySlug(result)!;
  const t = themeClasses[result];
  const { result: r } = quiz;

  return (
    <div className={`${t.base} ${t.text}`}>
      <div className="mx-auto flex min-h-[calc(100svh-8rem)] max-w-3xl flex-col items-center justify-center px-4 py-10 text-center sm:px-6 sm:py-20">
        <p className="surtitre">{r.kicker}</p>
        <h1 className={`apparition mt-4 font-display text-[clamp(3.25rem,15vw,8.5rem)] leading-[0.9] ${t.name}`}>{r.iAm(p.shortName)}</h1>
        <p className="mt-6 max-w-xl accroche">{p.phrase}</p>

        <div className="mt-8 flex w-full sm:mt-10 flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row">
          <Link href={`/soins/${p.slug}`} className={t.button}>
            {r.discoverCta(p.shortName)}
          </Link>
          <StoryShare slug={p.slug} name={p.shortName} />
        </div>

        <p className="mt-8 max-w-md text-lg font-bold sm:mt-12">
          <Link href={r.finalHref} className="underline underline-offset-4">
            {r.finalMessage}
          </Link>
        </p>

        <Link href="/quiz" className="mt-4 inline-block py-3 text-sm font-bold uppercase tracking-wide underline underline-offset-4 sm:mt-6">
          {quiz.restart}
        </Link>
      </div>
    </div>
  );
}
