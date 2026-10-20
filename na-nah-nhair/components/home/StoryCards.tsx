"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import PhotoSlot from "@/components/PhotoSlot";
import { home } from "@/content/site";
import { themeClasses } from "@/lib/theme-classes";

const s = home.story;
const cardStyles = [
  "bg-logo-yellow", // Le défi
  "bg-lavender-soft", // Le bureau
  "border-2 border-lavender bg-white", // Les trois soins
];

// Trois cartes : défilement au doigt sur téléphone (scroll-snap), côte à côte sur grand écran
export default function StoryCards() {
  const list = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = list.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
      },
      { root, threshold: 0.6 },
    );
    root.querySelectorAll("li").forEach((li) => observer.observe(li));
    return () => observer.disconnect();
  }, []);

  const goTo = (i: number) => {
    const li = list.current?.children[i] as HTMLElement | undefined;
    li?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  return (
    <div>
      <ul
        ref={list}
        tabIndex={0}
        aria-label={s.regionLabel}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0"
      >
        {s.cards.map((card, i) => (
          <li
            key={card.title}
            data-index={i}
            className={`relative flex w-[82%] shrink-0 snap-center flex-col rounded-[2.5rem] p-7 text-deep-violet sm:w-[60%] lg:w-auto ${cardStyles[i]}`}
          >
            <span aria-hidden className="font-display text-7xl leading-none text-logo-violet">
              {i + 1}
            </span>
            <h3 className="mt-2 text-4xl">
              <span className="sr-only">{i + 1}. </span>
              {card.title}
            </h3>
            <p className="mt-3 leading-relaxed">{card.text}</p>

            {i === 1 && (
              <div className="mt-auto flex justify-end pt-6">
                <figure className="w-36 rotate-[5deg] bg-white p-2 pb-6 shadow-lg">
                  <PhotoSlot photo={s.photo} className="aspect-square text-[0.65rem]" sizes="144px" />
                </figure>
              </div>
            )}

            {i === 2 && (
              <div className="mt-auto pt-6">
                <ul aria-hidden className="flex gap-2">
                  {(["fabulous", "miraculous", "luxurious"] as const).map((p) => (
                    <li key={p} className={`h-6 w-6 rounded-full ${themeClasses[p].base}`} />
                  ))}
                </ul>
                <Link
                  href={s.cta.href}
                  className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-deep-violet px-6 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-plum"
                >
                  {s.cta.label}
                </Link>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Indicateurs et aide au défilement : téléphone et tablette seulement */}
      <div className="mt-2 flex items-center justify-center gap-4 lg:hidden">
        <div className="flex gap-1">
          {s.cards.map((card, i) => (
            <button
              key={card.title}
              type="button"
              onClick={() => goTo(i)}
              aria-label={s.dotLabel(i + 1)}
              aria-current={active === i}
              className="flex h-11 w-11 items-center justify-center"
            >
              <span className={`block h-3 w-3 rounded-full ${active === i ? "bg-deep-violet" : "bg-lavender"}`} />
            </button>
          ))}
        </div>
        <span className="text-sm text-deep-violet">{s.swipeHint}</span>
      </div>
    </div>
  );
}
