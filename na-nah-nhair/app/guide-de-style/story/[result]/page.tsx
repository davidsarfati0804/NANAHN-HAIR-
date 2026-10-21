import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { brand, productBySlug, quiz } from "@/content/site";
import { isQuizResult, QUIZ_RESULTS } from "@/lib/quiz";
import { themeClasses } from "@/lib/theme-classes";

// Modèle des images story 1080 x 1920 (modification 20), photographié par scripts/generer-stories.mjs.
// Page cachée, non référencée. Marges de sécurité de 250 px en haut et en bas (interface d'Instagram).
export const metadata: Metadata = { title: "Image story", robots: { index: false, follow: false } };
export const dynamicParams = false;

export function generateStaticParams() {
  return QUIZ_RESULTS.map((result) => ({ result }));
}

export default async function StoryTemplate({ params }: { params: Promise<{ result: string }> }) {
  const { result } = await params;
  if (!isQuizResult(result)) notFound();
  const p = productBySlug(result)!;
  const t = themeClasses[result];
  const s = quiz.story;
  return (
    <div className="overflow-x-auto">
      <div
        id="story"
        className={`${t.base} ${t.text} flex flex-col items-center justify-between text-center`}
        style={{ width: 1080, height: 1920, padding: "250px 90px" }}
      >
        <p className="font-bold uppercase" style={{ fontSize: 40, letterSpacing: "0.25em", lineHeight: 1.3 }}>
          {s.kicker}
        </p>
        <div>
          <p className={`font-display ${t.name}`} style={{ fontSize: 230, lineHeight: 0.9, textWrap: "balance" }}>
            {quiz.result.iAm(p.shortName)}
          </p>
          <p className="mt-12 font-light" style={{ fontSize: 54, lineHeight: 1.35 }}>
            {p.phrase}
          </p>
        </div>
        <div className="flex flex-col items-center">
          <div className="rounded-[48px] bg-logo-yellow" style={{ padding: "34px 52px", transform: "rotate(-3deg)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- logo vectoriel, police du logo */}
            <img src={brand.logoSvg.src} alt={brand.logo.alt} width={340} height={Math.round((340 * brand.logoSvg.height) / brand.logoSvg.width)} />
          </div>
          <p className="mt-10 font-bold" style={{ fontSize: 38, lineHeight: 1.3 }}>
            {s.quizAt}
            <span className="mt-3 block">
              <span className="whitespace-nowrap rounded-lg bg-logo-yellow px-2 text-deep-violet">{s.siteTodo}</span>
            </span>
          </p>
          <p className="mt-4 font-bold" style={{ fontSize: 34 }}>
            <span className="whitespace-nowrap rounded-lg bg-logo-yellow px-2 text-deep-violet">{s.instagramTodo}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
