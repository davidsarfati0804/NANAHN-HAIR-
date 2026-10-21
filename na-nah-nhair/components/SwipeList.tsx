"use client";

import { Children, type ReactNode, useEffect, useRef, useState } from "react";
import { home } from "@/content/site";

// Cartes qui défilent au doigt sur téléphone (scroll-snap), en grille à partir de md.
// Même principe que les cartes « Mon histoire » ; points indicateurs + aide au défilement sous md.
export default function SwipeList({ label, children, gridClass = "md:grid-cols-2 lg:grid-cols-3" }: { label: string; children: ReactNode; gridClass?: string }) {
  const list = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const items = Children.toArray(children);

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
        className={`relative -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-3 [scrollbar-width:none] md:mx-0 md:grid md:gap-6 md:overflow-visible md:px-0 md:pb-0 ${gridClass}`}
      >
        {items.map((child, i) => (
          <li key={i} data-index={i} className="relative w-[84%] shrink-0 snap-center md:w-auto">
            {child}
          </li>
        ))}
      </ul>
      <div className="mt-1 flex items-center justify-center gap-4 md:hidden">
        <div className="flex gap-1">
          {items.map((_, i) => (
            <button
              key={i}
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
