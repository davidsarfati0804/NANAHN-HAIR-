"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { quiz } from "@/content/site";
import type { SerumId } from "@/lib/catalog";
import { quizResult } from "@/lib/quiz";
import { BrandText } from "@/components/BrandName";

// Délai entre le clic et la question suivante (le temps de voir la pastille choisie)
const ADVANCE_MS = 300;

// Une question par écran (modification 20). Réponses = groupe de boutons radio :
// flèches pour se déplacer, Espace ou Entrée pour choisir. La pastille choisie reste lavande
// (couleur neutre) pour ne pas révéler le résultat.
export default function Quiz() {
  const router = useRouter();
  const total = quiz.questions.length;
  const [answers, setAnswers] = useState<Array<SerumId | undefined>>(() => Array(total).fill(undefined));
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"next" | "back">("next");
  const [locked, setLocked] = useState(false);
  const [focusIndex, setFocusIndex] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const options = useRef<Array<HTMLButtonElement | null>>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const moved = useRef(false);
  const current = quiz.questions[step];

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  // À chaque nouvel écran : le titre de la question reçoit le focus (lecteurs d'écran)
  useEffect(() => {
    if (!moved.current) return;
    // preventScroll : le focus ne doit pas faire glisser la page sur le côté (constaté sur iPhone)
    heading.current?.focus({ preventScroll: true });
  }, [step]);

  const choose = (product: SerumId) => {
    if (locked) return;
    const next = [...answers];
    next[step] = product;
    setAnswers(next);
    setLocked(true);
    timer.current = setTimeout(() => {
      if (step === total - 1) {
        router.push(`/quiz/resultat/${quizResult(next as SerumId[])}`);
        return;
      }
      moved.current = true;
      setDirection("next");
      setStep(step + 1);
      setFocusIndex(0);
      setLocked(false);
    }, ADVANCE_MS);
  };

  const back = () => {
    if (step === 0 || locked) return;
    moved.current = true;
    setDirection("back");
    const previous = quiz.questions[step - 1];
    setFocusIndex(Math.max(0, previous.answers.findIndex((a) => a.product === answers[step - 1])));
    setStep(step - 1);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = current.answers.length;
    const go = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (go) {
      e.preventDefault();
      const j = (i + go + n) % n;
      setFocusIndex(j);
      options.current[j]?.focus({ preventScroll: true });
    }
  };

  const selected = answers[step];
  const progressLabel = quiz.progress(step + 1, total);

  return (
    <div className="relative isolate">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-fabulous opacity-40 blur-3xl" />
        <div className="absolute -right-10 top-0 h-80 w-80 rounded-full bg-miraculous opacity-50 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-72 w-72 rounded-full bg-luxurious opacity-40 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-3xl px-4 pb-8 pt-5 sm:px-6 sm:py-16">
        <h1 className="text-center text-2xl sm:text-4xl">
          <BrandText text={quiz.title} tone="logo" />
        </h1>

        {/* Progression : en haut, avance à chaque réponse */}
        <div className="mt-4 sm:mt-8">
          <p className="surtitre text-center" aria-hidden>
            {progressLabel}
          </p>
          <div
            className="mt-2 h-2.5 overflow-hidden sm:mt-3 rounded-full bg-white/80 ring-1 ring-lavender"
            role="progressbar"
            aria-label="Progression du quiz"
            aria-valuemin={1}
            aria-valuemax={total}
            aria-valuenow={step + 1}
            aria-valuetext={progressLabel}
          >
            <div
              className="h-full rounded-full bg-deep-violet transition-[width] duration-300 motion-reduce:transition-none"
              style={{ width: `${((step + 1) / total) * 100}%` }}
            />
          </div>
        </div>

        <div key={step} className={`mt-5 sm:mt-10 ${direction === "next" ? "quiz-slide-next" : "quiz-slide-back"}`}>
          <h2 ref={heading} id={`question-${step}`} tabIndex={-1} className="titre-h2 text-center outline-none max-sm:text-[2rem]">
            {current.question}
          </h2>
          <div role="radiogroup" aria-labelledby={`question-${step}`} className="mt-4 grid gap-2 sm:mt-8 sm:gap-3">
            {current.answers.map((a, i) => {
              const checked = selected === a.product;
              const tabbable = selected ? checked : i === focusIndex;
              return (
                <button
                  key={a.text}
                  ref={(el) => {
                    options.current[i] = el;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={checked}
                  tabIndex={tabbable ? 0 : -1}
                  onClick={() => choose(a.product)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={`min-h-14 w-full rounded-full border-2 px-6 py-2.5 text-center text-base font-bold leading-snug sm:py-4 transition-colors sm:text-lg ${
                    checked
                      ? "border-deep-violet bg-lavender text-deep-violet"
                      : "border-deep-violet bg-white text-deep-violet hover:bg-lavender-soft"
                  }`}
                >
                  {a.text}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-3 flex min-h-12 justify-center sm:mt-8">
          {step > 0 && (
            <button
              type="button"
              onClick={back}
              className="min-h-12 rounded-full px-6 text-sm font-bold uppercase tracking-wide text-deep-violet underline underline-offset-4"
            >
              <span aria-hidden>← </span>
              {quiz.previous}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
