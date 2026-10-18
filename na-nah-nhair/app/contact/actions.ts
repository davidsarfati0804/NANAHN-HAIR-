"use server";

import { randomBytes } from "node:crypto";
import { contactTexts as t } from "@/content/site";
import { clientIp } from "@/lib/auth";
import { checkAttempts, recordFailure } from "@/lib/auth-core";
import { validateContact } from "@/lib/contact";
import { appendContactMessage, getContactAttempts, logError, saveContactAttempts } from "@/lib/store";

export type ContactState = { ok?: boolean; error?: string; fieldErrors?: Record<string, string> } | null;

const MIN_FILL_MS = 3000; // un humain met plus de 3 secondes à remplir le formulaire

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Anti-spam : champ piège invisible + délai minimal de remplissage
  const trap = String(formData.get("site_web") ?? "");
  const startedAt = Number(formData.get("debut") ?? 0);
  if (trap !== "" || !startedAt || Date.now() - startedAt < MIN_FILL_MS) return { error: t.errors.spam };

  const result = validateContact({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });
  if (!result.ok) return { fieldErrors: result.errors };

  try {
    // Limitation : 5 messages par heure et par IP
    const ip = await clientIp();
    const key = `contact:${ip}`;
    const attempts = await getContactAttempts();
    if (checkAttempts(attempts, [[key, 5]])) return { error: t.errors.rate };
    await saveContactAttempts(recordFailure(attempts, [key], 60 * 60 * 1000));

    await appendContactMessage({ id: randomBytes(8).toString("hex"), at: new Date().toISOString(), ...result.value });
    return { ok: true };
  } catch (e) {
    await logError("contact", e);
    return { error: t.errors.server };
  }
}
