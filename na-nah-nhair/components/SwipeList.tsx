"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { home } from "@/content/site";

export type SwipeCard = { key: string; className: string; content: ReactNode };

// Cartes qui défilent au doigt sur téléphone (scroll-snap), en grille à partir de md.
// `rows` : nombre de lignes communes ; chaque enfant direct du contenu d'une carte occupe une ligne,
// alignée sur la même ligne des autres cartes (CSS subgrid, modification 41).
export default function SwipeList({
  label,
  cards,
  rows,
  gridClass = "md:grid-cols-3",
}: {
  label: string;
  cards: SwipeCard[];
  rows: number;
  gridClass?: string;
}) {
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
    root.querySelectorAll(":scope > li").forEach((li) => observer.observe(li));
    return () => observer.disconnect();
  }, []);

  const goTo = (i: number) => {
    const root = list.current;
    const li = root?.children[i] as HTMLElement | undefined;
    // Défilement horizontal du seul carrousel (jamais de la page)
    if (root && li) root.scrollTo({ left: li.offsetLeft - root.offsetLeft - 16, behavior: "smooth" });
  };

  return (
    <div>
      <ul
        ref={list}
        tabIndex={0}
        aria-label={label}
        style={{ gridTemplateRows: `repeat(${rows}, auto)` }}
        className={`relative -mx-4 grid snap-x snap-mandatory auto-cols-[84%] grid-flow-col gap-x-4 overflow-x-auto scroll-px-4 px-4 pb-3 [scrollbar-width:none] md:mx-0 md:grid-flow-row md:gap-x-6 md:gap-y-0 md:overflow-visible md:px-0 md:pb-0 ${gridClass}`}
      >
        {cards.map((card, i) => (
          <li key={card.key} data-index={i} style={{ gridRow: `span ${rows}` }} className={`relative grid snap-center grid-rows-subgrid md:mb-6 ${card.className}`}>
            {card.content}
          </li>
        ))}
      </ul>
      <div className="mt-1 flex items-center justify-center gap-4 md:hidden">
        <div className="flex gap-1">
          {cards.map((card, i) => (
            <button
              key={card.key}
              type="button"
              onClick={() => goTo(i)}
              aria-label={home.story.dotLabel(i + 1)}
              aria-current={active === i}
              className="flex h-11 w-11 items-center justify-center"
            >
              <span className={`block h-3 w-3 rounded-full ${active === i ? "bg-deep-violet" : "bg-lavender"}`} />
            </button>
          ))}
        </div>
        <span className="text-sm text-deep-violet">{home.story.swipeHint}</span>
      </div>
    </div>
  );
}
