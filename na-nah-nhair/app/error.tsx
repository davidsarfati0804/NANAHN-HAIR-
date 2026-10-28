"use client";

import Link from "next/link";
import { errorTexts } from "@/content/site";

const t = errorTexts.error;

// Erreur inattendue dans une page : message en français, possibilité de réessayer
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 sm:py-24">
      <h1 className="titre-h1">{t.title}</h1>
      <p className="accroche mt-4">{t.text}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="bouton bouton--principal">
          {t.retry}
        </button>
        <Link href="/" className="bouton bouton--secondaire">
          {t.home}
        </Link>
      </div>
    </div>
  );
}
