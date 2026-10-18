// Validation du formulaire de contact (utilisée côté serveur, testée)
import { contactTexts as t } from "@/content/site";

export type ContactInput = { name: string; email: string; subject: string; message: string };
export type ContactMessage = ContactInput & { id: string; at: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(raw: Record<string, unknown>):
  | { ok: true; value: ContactInput }
  | { ok: false; errors: Record<string, string> } {
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const value = { name: str(raw.name), email: str(raw.email), subject: str(raw.subject), message: str(raw.message) };
  const errors: Record<string, string> = {};
  if (value.name.length < 2 || value.name.length > 100) errors.name = t.errors.name;
  if (value.email.length > 254 || !EMAIL.test(value.email)) errors.email = t.errors.email;
  if (!(t.subjects as string[]).includes(value.subject)) errors.subject = t.errors.subject;
  if (value.message.length < 10 || value.message.length > 3000) errors.message = t.errors.message;
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value };
}
