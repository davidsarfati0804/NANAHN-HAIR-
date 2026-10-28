"use server";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { contactTexts as t } from "@/content/site";
import { clientIp } from "@/lib/auth";
import { checkAttempts, recordFailure } from "@/lib/auth-core";
import { validateContact } from "@/lib/contact";
import { mailConfig, sendMail } from "@/lib/emails/send";
import { appendContactMessage, logError, updateAttempts } from "@/lib/store";

export type ContactState = { ok?: boolean; error?: string; fieldErrors?: Record<string, string> } | null;

const MIN_FILL_MS = 3000; // un humain met plus de 3 secondes à remplir le formulaire
const MAX_FILL_MS = 24 * 60 * 60 * 1000;

// Heure d'affichage du formulaire, signée par le serveur : un robot ne peut pas l'inventer
const formSecret = () => process.env.ADMIN_SESSION_SECRET || process.env.NNH_FORM_SECRET || "nnh-formulaire-contact";
const sign = (at: number) => createHmac("sha256", formSecret()).update(`contact:${at}`).digest("hex").slice(0, 32);

export async function contactToken(): Promise<string> {
  const at = Date.now();
  return `${at}.${sign(at)}`;
}

function tokenAge(token: string): number | null {
  const [raw, mac] = token.split(".");
  const at = Number(raw);
  if (!at || !mac || mac.length !== 32) return null;
  if (!timingSafeEqual(Buffer.from(mac), Buffer.from(sign(at)))) return null;
  return Date.now() - at;
}

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Les champs d'abord : une erreur de saisie s'affiche toujours sous le bon champ
  const result = validateContact({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });
  if (!result.ok) return { fieldErrors: result.errors };

  // Anti-spam : champ piège invisible + délai minimal de remplissage (heure signée)
  const trap = String(formData.get("site_web") ?? "");
  const age = tokenAge(String(formData.get("debut") ?? ""));
  if (trap !== "" || age === null || age > MAX_FILL_MS) return { error: t.errors.spam };
  if (age < MIN_FILL_MS) return { error: t.errors.tooFast };

  try {
    // Limitation : 5 messages par heure et par IP (compteur mis à jour de façon atomique)
    const ip = await clientIp();
    const key = `contact:${ip}`;
    let limited = false;
    await updateAttempts("contact-attempts", (log) => {
      limited = checkAttempts(log, [[key, 5]]);
      return limited ? log : recordFailure(log, [key], 60 * 60 * 1000);
    });
    if (limited) return { error: t.errors.rate };

    await appendContactMessage({ id: randomBytes(8).toString("hex"), at: new Date().toISOString(), ...result.value });
    // Alerte à la boutique (si l'envoi des emails est configuré) ; un échec n'empêche pas l'enregistrement
    const m = result.value;
    await sendMail({
      to: mailConfig().notify,
      replyTo: m.email,
      subject: `Nouveau message : ${m.subject}`,
      text: `De : ${m.name} <${m.email}>\nSujet : ${m.subject}\n\n${m.message}\n\n(Réponds directement à cet email pour lui écrire.)`,
    }).catch((e) => logError("alerte email (contact)", e));
    return { ok: true };
  } catch (e) {
    await logError("contact", e);
    return { error: t.errors.server };
  }
}
