"use client";

import { useConsent } from "@/components/consent/useConsent";
import { consentTexts as t } from "@/content/site";
import { writeConsent } from "@/lib/consent";

export default function ResetConsent() {
  const { choice, ready } = useConsent();
  return (
    <div className="mt-2">
      <p role="status">{ready && t.current(choice === "accepte" ? t.accepted : choice === "refuse" ? t.refused : t.none)}</p>
      <button
        type="button"
        onClick={() => writeConsent(null)}
        className="mt-3 bouton bouton--principal"
      >
        {t.reset}
      </button>
    </div>
  );
}
