"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { quiz } from "@/content/site";
import type { SerumId } from "@/lib/catalog";
import { quizResult } from "@/lib/quiz";
import { BrandText } from "@/components/BrandName";

export default function Quiz() {
  const router = useRouter();
  const [answers, setAnswers] = useState<SerumId[]>([]);
  const heading = useRef<HTMLHeadingElement>(null);
  const total = quiz.questions.length;
  const step = Math.min(answers.length, total - 1);
  const current = quiz.questions[step];
  const done = answers.length === total;

  const choose = (product: SerumId) => {
    if (done) return;
    const next = [...answers, product];
    setAnswers(next);
    if (next.length === total) {
      router.push(`/quiz/resultat/${quizResult(next)}`);
    } else {
      requestAnimationFrame(() => heading.current?.focus());
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-fabulous opacity-40 blur-3xl" />
        <div className="absolute -right-10 top-0 h-80 w-80 rounded-full bg-miraculous opacity-50 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 rounded-full bg-luxurious opacity-40 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <h1 className="text-6xl text-deep-violet sm:text-8xl"><BrandText text={quiz.title} tone="logo" />
        </h1>
        <p className="mt-3 text-lg">{quiz.intro}</p>

        <div className="mt-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-plum" aria-live="polite">
            {quiz.progress(step + 1, total)}
          </p>
          <div
            className="mt-3 h-2 overflow-hidden rounded-full bg-lavender-mist"
            role="progressbar"
            aria-label="Progression du quiz"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={answers.length}
          >
            <div className="h-full rounded-full bg-deep-violet transition-all" style={{ width: `${(answers.length / total) * 100}%` }} />
          </div>

          <fieldset className="mt-8" disabled={done}>
            <legend>
              <h2 ref={heading} tabIndex={-1} className="text-5xl text-deep-violet outline-none sm:text-6xl">
                {current.question}
              </h2>
            </legend>
            <ul className="mt-6 grid gap-3">
              {current.answers.map((a) => (
                  <li key={a.text}>
                    <button
                      type="button"
                      onClick={() => choose(a.product)}
                      className="w-full rounded-3xl border-2 border-deep-violet bg-white px-6 py-5 text-left text-lg font-bold text-deep-violet transition-colors hover:bg-lavender-soft focus-visible:bg-lavender-soft"
                    >
                      {a.text}
                    </button>
                  </li>
                ))}
            </ul>
          </fieldset>

          {answers.length > 0 && !done && (
            <button
              type="button"
              onClick={() => {
                setAnswers(answers.slice(0, -1));
                requestAnimationFrame(() => heading.current?.focus());
              }}
              className="mt-6 text-sm font-bold text-plum underline underline-offset-4"
            >
              {quiz.previous}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
