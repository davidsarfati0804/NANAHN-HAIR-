import "server-only";
import path from "node:path";
import type { AttemptLog } from "@/lib/auth-core";
import { type Catalog, PRODUCT_IDS, seedCatalog } from "@/lib/catalog";
import type { ContactMessage } from "@/lib/contact";
import { seedSettings, type ShopSettings } from "@/lib/settings";
import { createFileStore } from "./file-store";
import { createNetlifyStore } from "./netlify-store";
import type { KeyValueStore } from "./types";

// Base de données provisoire (en attendant Supabase) :
// Netlify Blobs une fois en ligne, fichiers dans .data/ en local.
let store: KeyValueStore | null = null;
function kv(): KeyValueStore {
  if (!store) {
    const onNetlify = Boolean(process.env.NETLIFY_BLOBS_CONTEXT || process.env.NETLIFY === "true");
    store = onNetlify
      ? createNetlifyStore("na-nah-nhair")
      : createFileStore(process.env.NNH_DATA_DIR ?? path.join(process.cwd(), ".data"));
  }
  return store;
}

export async function getCatalog(): Promise<Catalog> {
  const seed = seedCatalog();
  const saved = await kv().getJSON<Partial<Catalog>>("catalog");
  if (!saved) return seed;
  // Les produits enregistrés complètent les valeurs initiales (champs ajoutés plus tard)
  return Object.fromEntries(PRODUCT_IDS.map((id) => [id, { ...seed[id], ...saved[id], id }])) as Catalog;
}

export async function saveCatalog(catalog: Catalog) {
  await kv().setJSON("catalog", catalog);
}

export async function getSettings(): Promise<ShopSettings> {
  const seed = seedSettings();
  const saved = await kv().getJSON<Partial<ShopSettings>>("settings");
  return { ...seed, ...saved, carriers: { ...seed.carriers, ...saved?.carriers } };
}

export async function saveSettings(settings: ShopSettings) {
  await kv().setJSON("settings", settings);
}

export async function putMedia(key: string, data: ArrayBuffer, contentType: string) {
  await kv().setBinary(`media-${key}`, data, contentType);
}

export async function getMedia(key: string) {
  return kv().getBinary(`media-${key}`);
}

export async function deleteMedia(key: string) {
  await kv().delete(`media-${key}`);
}

export type AuditEntry = { at: string; action: string; detail: string };

// Journal des actions du back-office (les 500 dernières)
export async function appendAudit(action: string, detail: string) {
  const log = (await kv().getJSON<AuditEntry[]>("audit-log")) ?? [];
  log.unshift({ at: new Date().toISOString(), action, detail });
  await kv().setJSON("audit-log", log.slice(0, 500));
}

export async function getAudit(): Promise<AuditEntry[]> {
  return (await kv().getJSON<AuditEntry[]>("audit-log")) ?? [];
}

export async function getErrors(): Promise<AuditEntry[]> {
  return (await kv().getJSON<AuditEntry[]>("error-log")) ?? [];
}

// Journal des erreurs serveur (les 500 dernières)
export async function logError(where: string, error: unknown) {
  try {
    const log = (await kv().getJSON<AuditEntry[]>("error-log")) ?? [];
    log.unshift({ at: new Date().toISOString(), action: where, detail: error instanceof Error ? error.message : String(error) });
    await kv().setJSON("error-log", log.slice(0, 500));
  } catch {
    console.error(where, error);
  }
}

// Sessions du back-office ouvertes avant cette date : refusées
export async function getSessionEpoch(): Promise<number> {
  return (await kv().getJSON<number>("admin-session-epoch")) ?? 0;
}

export async function setSessionEpoch(at: number) {
  await kv().setJSON("admin-session-epoch", at);
}

export async function getLoginAttempts(): Promise<AttemptLog> {
  return (await kv().getJSON<AttemptLog>("login-attempts")) ?? {};
}

export async function saveLoginAttempts(log: AttemptLog) {
  await kv().setJSON("login-attempts", log);
}

// Messages du formulaire de contact (les 1 000 derniers)
export async function getContactMessages(): Promise<ContactMessage[]> {
  return (await kv().getJSON<ContactMessage[]>("contact-messages")) ?? [];
}

export async function appendContactMessage(message: ContactMessage) {
  const list = await getContactMessages();
  list.unshift(message);
  await kv().setJSON("contact-messages", list.slice(0, 1000));
}

export async function deleteContactMessage(id: string) {
  const list = await getContactMessages();
  await kv().setJSON("contact-messages", list.filter((m) => m.id !== id));
}

export async function getContactAttempts(): Promise<AttemptLog> {
  return (await kv().getJSON<AttemptLog>("contact-attempts")) ?? {};
}

export async function saveContactAttempts(log: AttemptLog) {
  await kv().setJSON("contact-attempts", log);
}
