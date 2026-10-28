"use client";

import { colors } from "@/lib/design-tokens";

// Erreur grave (mise en page elle-même en échec) : page minimale autonome, en français
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="fr">
      <body style={{ fontFamily: "system-ui, sans-serif", background: colors.lavenderSoft, color: colors.deepViolet, textAlign: "center", padding: "4rem 1rem" }}>
        <h1>Une erreur est survenue</h1>
        <p>La page n&apos;a pas pu s&apos;afficher. Réessaie dans un instant.</p>
        <p>
          <button type="button" onClick={reset} style={{ padding: "0.75rem 1.5rem", borderRadius: "999px", border: `2px solid ${colors.deepViolet}`, background: colors.white, color: colors.deepViolet, fontWeight: 700 }}>
            Réessayer
          </button>
        </p>
      </body>
    </html>
  );
}
