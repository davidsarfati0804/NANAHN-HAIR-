"use client";

import { type ReactNode, useEffect, useRef } from "react";

// Bloc repliable sur téléphone (fermé), toujours ouvert à partir de 768 px.
// Le contenu reste dans la page (lisible par les moteurs de recherche).
export default function Fold({
  title,
  children,
  className = "",
  tone = "border-2 border-lavender",
}: {
  title: string;
  children: ReactNode;
  className?: string;
  // Couleurs du bloc (sur les fiches : ton moyen du soin, texte foncé du soin)
  tone?: string;
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    if (ref.current && window.matchMedia("(min-width: 768px)").matches) ref.current.open = true;
  }, []);
  return (
    <details ref={ref} className={`group rounded-3xl ${tone} ${className}`}>
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-3 sm:px-8 sm:py-5 [&::-webkit-details-marker]:hidden">
        <h2 className="titre-h3">{title}</h2>
        <span aria-hidden className="text-2xl leading-none transition-transform group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="px-5 pb-5 sm:px-8 sm:pb-8">{children}</div>
    </details>
  );
}
