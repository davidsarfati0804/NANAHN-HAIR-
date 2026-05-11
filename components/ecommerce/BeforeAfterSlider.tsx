"use client";

import Image from "next/image";
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
              Des routines qui se voient
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

        <article className="grid overflow-hidden rounded-[1.5rem] border border-[var(--color-lavender-mist)] bg-[var(--color-blush)] shadow-[0_18px_45px_rgba(53,32,95,0.08)] lg:grid-cols-[1.08fr_0.92fr]">
          <div className="bg-white p-3 sm:p-5">
            <div className="relative aspect-square overflow-hidden rounded-[1.1rem] bg-[var(--color-blush)]">
              <Image
                src={item.image}
                alt={`${item.name} Na Nah N'hair avant après`}
                fill
                priority={active === 0}
                sizes="(min-width: 1024px) 54vw, 100vw"
                className="object-contain"
                style={{ objectPosition: item.imagePosition }}
              />
            </div>
          </div>
          <div className="flex flex-col justify-center p-6 md:p-9">
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

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {beforeAfterItems.map((result, index) => (
            <button
              key={result.name}
              onClick={() => setActive(index)}
              className={`grid grid-cols-[86px_1fr] items-center gap-3 rounded-[1.2rem] border p-2 text-left transition ${
                active === index
                  ? "border-[var(--color-lavender)] bg-[var(--color-lavender-soft)]"
                  : "border-[var(--color-lavender-mist)] bg-white hover:border-[var(--color-lavender)]"
              }`}
              type="button"
            >
              <span className="relative h-20 overflow-hidden rounded-[0.9rem] bg-white">
                <Image
                  src={result.image}
                  alt=""
                  fill
                  sizes="86px"
                  className="object-cover"
                  style={{ objectPosition: result.imagePosition }}
                />
              </span>
              <span>
                <span className="block text-sm font-black text-[var(--color-deep-violet)]">{result.name}</span>
                <span className="mt-1 block text-xs font-bold text-[var(--color-plum)]">{result.product}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
