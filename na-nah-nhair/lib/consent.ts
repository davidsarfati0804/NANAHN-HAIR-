// Consentement cookies (RGPD). Aujourd'hui le site ne dépose rien de non essentiel :
// tout futur outil (mesure d'audience, intégration Instagram…) devra vérifier hasConsent() avant de se charger.
export type ConsentChoice = "accepte" | "refuse";
export const CONSENT_KEY = "nnh-consentement";
export const CONSENT_EVENT = "nnh-consentement";

export function readConsent(): ConsentChoice | null {
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === "accepte" || v === "refuse" ? v : null;
  } catch {
    return null;
  }
}

export function writeConsent(choice: ConsentChoice | null) {
  try {
    if (choice) window.localStorage.setItem(CONSENT_KEY, choice);
    else window.localStorage.removeItem(CONSENT_KEY);
  } catch {
    // stockage indisponible : le bandeau réapparaîtra à la prochaine visite
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export function hasConsent(): boolean {
  return readConsent() === "accepte";
}
