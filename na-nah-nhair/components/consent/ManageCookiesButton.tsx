"use client";

import { footer } from "@/content/site";
import { writeConsent } from "@/lib/consent";

// « Gérer mes cookies » (politique de cookies) : efface le choix, le bandeau réapparaît
export default function ManageCookiesButton() {
  return (
    <button type="button" onClick={() => writeConsent(null)} className="inline-flex min-h-11 items-center underline underline-offset-4">
      {footer.manageCookies}
    </button>
  );
}
