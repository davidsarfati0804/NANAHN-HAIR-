"use client";

import { useEffect, useState } from "react";
import { CONSENT_EVENT, type ConsentChoice, readConsent } from "@/lib/consent";

export function useConsent() {
  const [choice, setChoice] = useState<ConsentChoice | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const update = () => setChoice(readConsent());
    update();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lecture du stockage navigateur après le rendu serveur
    setReady(true);
    window.addEventListener(CONSENT_EVENT, update);
    return () => window.removeEventListener(CONSENT_EVENT, update);
  }, []);
  return { choice, ready };
}
