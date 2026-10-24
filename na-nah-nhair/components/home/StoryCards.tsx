"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
        for (const e of entries)
          if (e.isIntersecting)
            setActive(Number((e.target as HTMLElement).dataset.index));
      },
      { root, threshold: 0.6 },
    );
    root.querySelectorAll(":scope > li").forEach((li) => observer.observe(li));
    return () => observer.disconnect();
  }, []);

  const goTo = (i: number) => {
    const li = list.current?.children[i] as HTMLElement | undefined;
    li?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  };

  return (
    <div>
      {/* Grille à lignes communes (numéro, titre, texte) : même alignement dans les trois cartes ;
          dans la carte 3, pastilles et bouton suivent le texte (modification 44), sans ancrage en bas */}
      <ul
        ref={list}
        tabIndex={0}
        aria-label={s.regionLabel}
        className="relative -mx-4 grid snap-x snap-mandatory auto-cols-[82%] grid-flow-col grid-rows-[auto_auto_auto] gap-x-4 overflow-x-auto scroll-px-4 px-4 pb-4 [scrollbar-width:none] sm:auto-cols-[60%] lg:mx-0 lg:grid-flow-row lg:grid-cols-3 lg:gap-x-6 lg:overflow-visible lg:px-0"
      >
        {s.cards.map((card, i) => (
          <li
            key={card.title}
            data-index={i}
            className={`relative row-span-3 grid snap-center grid-rows-subgrid content-start rounded-[2.5rem] p-7 text-deep-violet ${cardStyles[i]}`}
          >
            <span
              aria-hidden
              className="block font-display text-7xl leading-none text-logo-violet"
            >
              {i + 1}
            </span>
            <h3 className="mt-2 text-4xl">
              <span className="sr-only">{i + 1}. </span>
              {card.title}
            </h3>
            <div className="mt-3">
              <p className="leading-relaxed">{card.text}</p>
              {i === 2 && (
                <div className="pt-6">
                  <ul aria-hidden className="flex gap-2">
                    {(["fabulous", "miraculous", "luxurious"] as const).map(
                      (p) => (
                        <li
                          key={p}
                          className={`h-6 w-6 rounded-full ${themeClasses[p].base}`}
                        />
                      ),
                    )}
                  </ul>
                  <Link
                    href={s.cta.href}
                    className="mt-5 bouton bouton--principal"
                  >
                    {s.cta.label}
                  </Link>
                </div>
              )}
            </div>
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
              <span
                className={`block h-3 w-3 rounded-full ${active === i ? "bg-deep-violet" : "bg-lavender"}`}
              />
            </button>
          ))}
        </div>
        <span className="text-sm text-deep-violet">{s.swipeHint}</span>
      </div>
    </div>
  );
}
