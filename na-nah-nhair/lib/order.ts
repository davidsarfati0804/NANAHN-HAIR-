// Commande (modification 39) : adresse de livraison, numéro de commande, acceptation des CGV
import { randomBytes } from "node:crypto";

export type DeliveryAddress = { firstName: string; lastName: string; email: string; phone: string; address: string; postalCode: string; city: string };
export const ADDRESS_FIELDS = ["firstName", "lastName", "email", "phone", "address", "postalCode", "city"] as const;
// Téléphone facultatif (transmis au transporteur, politique de confidentialité)
const OPTIONAL = new Set<string>(["phone"]);

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Validation serveur (le navigateur valide aussi, mais seul le serveur fait foi)
export function validateAddress(raw: unknown): { ok: true; value: DeliveryAddress } | { ok: false; fields: string[] } {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const v = Object.fromEntries(ADDRESS_FIELDS.map((k) => [k, typeof r[k] === "string" ? (r[k] as string).trim() : ""])) as DeliveryAddress;
  const bad: string[] = [];
  for (const k of ADDRESS_FIELDS) if ((!v[k] && !OPTIONAL.has(k)) || v[k].length > 120) bad.push(k);
  if (v.phone && !/^\+?[\d\s.()-]{6,20}$/.test(v.phone)) bad.push("phone");
  if (v.email && !EMAIL.test(v.email)) bad.push("email");
  // Livraison en France métropolitaine, Corse comprise (CGV, article 6) : 5 chiffres, hors DOM-TOM (97, 98)
  if (v.postalCode && (!/^\d{5}$/.test(v.postalCode) || /^9[78]/.test(v.postalCode))) bad.push("postalCode");
  return bad.length ? { ok: false, fields: [...new Set(bad)] } : { ok: true, value: v };
}

// Numéro de commande lisible : NNH-AAAAMMJJ-XXXXXX
export function newOrderNumber(now = new Date()): string {
  const d = now.toISOString().slice(0, 10).replace(/-/g, "");
  return `NNH-${d}-${randomBytes(3).toString("hex").toUpperCase()}`;
}
