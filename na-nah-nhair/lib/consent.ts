// Consentement cookies (RGPD). Aujourd'hui le site ne dépose rien de non essentiel :
// tout futur outil (mesure d'audience, intégration Instagram…) devra vérifier hasConsent() avant de se charger.
export type ConsentChoice = "accepte" | "refuse";
export const CONSENT_KEY = "nnh-consentement";
export const CONSENT_EVENT = "nnh-consentement";

// Le choix est conservé 6 mois (politique de cookies), puis le bandeau est proposé à nouveau
export const CONSENT_MAX_AGE_MS = 182 * 24 * 60 * 60 * 1000;

export function parseConsent(raw: string | null, now = Date.now()): ConsentChoice | null {
  if (!raw) return null;
  const [v, at] = raw.split("|");
  if (v !== "accepte" && v !== "refuse") return null;
  // Ancien format sans date : conservé
  if (at === undefined) return v;
  const time = Number(at);
  return Number.isFinite(time) && now - time < CONSENT_MAX_AGE_MS ? v : null;
}

export function readConsent(): ConsentChoice | null {
  try {
    return parseConsent(window.localStorage.getItem(CONSENT_KEY));
  } catch {
    return null;
  }
}

export function writeConsent(choice: ConsentChoice | null) {
  try {
    if (choice) window.localStorage.setItem(CONSENT_KEY, `${choice}|${Date.now()}`);
    else window.localStorage.removeItem(CONSENT_KEY);
  } catch {
    // stockage indisponible : le bandeau réapparaîtra à la prochaine visite
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export function hasConsent(): boolean {
  return readConsent() === "accepte";
}
