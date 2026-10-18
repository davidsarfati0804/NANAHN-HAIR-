"use client";

import { useState } from "react";
import { shareTexts as t } from "@/content/site";

// Partage (Instagram, messages…) via le menu de partage du téléphone, sinon copie du lien. Aucun suivi.
export default function ShareButton({ name, className = "" }: { name: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const url = window.location.href;
    const title = t.shareTitle(name);
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // partage annulé : rien à faire
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      window.prompt(title, url);
    }
  };
  return (
    <div className={className}>
      <button
        type="button"
        onClick={share}
        className="min-h-11 rounded-full border-2 border-white px-6 py-2 text-sm font-bold uppercase text-white hover:bg-plum"
      >
        {t.share}
      </button>
      <p role="status" aria-live="polite" className="mt-2 min-h-5 text-sm font-bold">
        {copied && t.copied}
      </p>
    </div>
  );
}
