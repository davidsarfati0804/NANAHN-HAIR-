import type { Metadata } from "next";
import Link from "next/link";
import { errorTexts } from "@/content/site";

export const metadata: Metadata = { title: errorTexts.notFound.title, robots: { index: false, follow: false } };

const t = errorTexts.notFound;

// Page introuvable (404), en français et aux couleurs du site
export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 sm:py-24">
      <p className="surtitre">404</p>
      <h1 className="titre-h1 mt-2">{t.title}</h1>
      <p className="accroche mt-4">{t.text}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="bouton bouton--principal">
          {t.home}
        </Link>
        <Link href="/boutique" className="bouton bouton--secondaire">
          {t.shop}
        </Link>
      </div>
    </div>
  );
}
