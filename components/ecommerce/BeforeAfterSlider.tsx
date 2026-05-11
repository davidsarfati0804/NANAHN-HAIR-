"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { beforeAfterItems } from "@/data/site";

export default function BeforeAfterSlider() {
  const [active, setActive] = useState(0);
  const item = beforeAfterItems[active];

  const goTo = (direction: number) => {
    setActive((current) => (current + direction + beforeAfterItems.length) % beforeAfterItems.length);
  };

  return (
    <section id="resultats" className="bg-white px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-plum)]">Avant / Après</p>
            <h2 className="mt-3 text-4xl font-black text-[var(--color-deep-violet)] md:text-6xl">
              Résultats réels, routines réelles
            </h2>
          </div>
          <div className="flex gap-3">
            <button onClick={() => goTo(-1)} className="grid h-12 w-12 place-items-center rounded-full border border-[var(--color-lavender)] text-[var(--color-deep-violet)]" aria-label="Résultat précédent">
              <ChevronLeft size={22} />
            </button>
            <button onClick={() => goTo(1)} className="grid h-12 w-12 place-items-center rounded-full bg-[var(--color-lavender)] text-white" aria-label="Résultat suivant">
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        <article className="grid overflow-hidden rounded-[2rem] border border-[var(--color-lavender-mist)] bg-[var(--color-lavender-soft)] shadow-[0_18px_45px_rgba(53,32,95,0.08)] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-3 p-4 sm:grid-cols-2">
            {/* TODO: remplacer les placeholders par les vraies photos avant/après, avec droits d’utilisation. */}
            {["Avant", "Après"].map((label) => (
              <div key={label} className="relative grid min-h-80 place-items-center overflow-hidden rounded-[1.5rem] bg-white text-[var(--color-deep-violet)]">
                <div className="absolute left-4 top-4 rounded-full bg-[var(--color-deep-violet)] px-4 py-2 text-sm font-black text-white">
                  {label}
                </div>
                <div className="h-40 w-40 rounded-full border-[18px] border-[var(--color-lavender)] bg-[var(--color-blush)]" />
              </div>
            ))}
          </div>
          <div className="flex flex-col justify-center p-7 md:p-10">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-plum)]">{item.duration}</p>
            <h3 className="mt-3 text-3xl font-black text-[var(--color-deep-violet)]">{item.name}</h3>
            <dl className="mt-6 grid gap-3 text-sm">
              <div className="flex justify-between gap-4 rounded-2xl bg-white px-4 py-3">
                <dt className="font-bold text-[var(--color-plum)]">Produit</dt>
                <dd className="text-right font-black text-[var(--color-deep-violet)]">{item.product}</dd>
              </div>
              <div className="flex justify-between gap-4 rounded-2xl bg-white px-4 py-3">
                <dt className="font-bold text-[var(--color-plum)]">Type de cheveux</dt>
                <dd className="text-right font-black text-[var(--color-deep-violet)]">{item.hairType}</dd>
              </div>
            </dl>
            <blockquote className="mt-6 text-xl font-bold leading-8 text-[var(--color-ink)]">“{item.quote}”</blockquote>
            <p className="mt-6 text-sm leading-6 text-[var(--color-ink)]">
              Les résultats peuvent varier selon les personnes, la régularité d’utilisation et la nature des cheveux.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
