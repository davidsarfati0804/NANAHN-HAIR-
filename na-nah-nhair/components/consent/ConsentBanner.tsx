"use client";

import Link from "next/link";
import { useConsent } from "@/components/consent/useConsent";
import { consentTexts as t } from "@/content/site";
import { writeConsent } from "@/lib/consent";

export default function ConsentBanner() {
  const { choice, ready } = useConsent();
  if (!ready || choice) return null;
  return (
    <section
      aria-label={t.label}
      className="fixed inset-x-3 bottom-3 z-50 print:hidden mx-auto max-w-3xl rounded-3xl border-2 border-deep-violet bg-white p-5 text-deep-violet shadow-xl sm:flex sm:items-center sm:gap-6"
    >
      <p className="text-sm">
        {t.text}{" "}
        <Link href="/cookies" className="inline-block py-1 font-bold text-deep-violet underline underline-offset-4">
          {t.more}
        </Link>
      </p>
      <div className="mt-4 flex shrink-0 gap-2 sm:mt-0">
        <button
          type="button"
          onClick={() => writeConsent("refuse")}
          className="bouton bouton--secondaire flex-1"
        >
          {t.refuse}
        </button>
        <button
          type="button"
          onClick={() => writeConsent("accepte")}
          className="bouton bouton--principal flex-1"
        >
          {t.accept}
        </button>
      </div>
    </section>
  );
}
