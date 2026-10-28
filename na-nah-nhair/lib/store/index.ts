import "server-only";
import path from "node:path";
import type { AttemptLog } from "@/lib/auth-core";
import { type Catalog, PRODUCT_IDS, seedCatalog } from "@/lib/catalog";
import type { ContactMessage } from "@/lib/contact";
import type { Order } from "@/lib/orders";
import { seedSettings, type ShopSettings } from "@/lib/settings";
import { createFileStore } from "./file-store";
import { createNetlifyStore } from "./netlify-store";
import { storeName } from "@/lib/deploy";
import type { KeyValueStore } from "./types";

// Base de données : Netlify Blobs une fois en ligne (un magasin par contexte, lib/deploy.ts),
// fichiers dans .data/ en local.
let store: KeyValueStore | null = null;
function kv(): KeyValueStore {
  if (!store) {
    // Sur Netlify, les fonctions serveur reçoivent NETLIFY_BLOBS_CONTEXT (ou SITE_ID) ; en local : fichiers
    const onNetlify = Boolean(process.env.NETLIFY_BLOBS_CONTEXT || process.env.NETLIFY === "true" || process.env.SITE_ID);
    const base = onNetlify
      ? createNetlifyStore(storeName())
      : createFileStore(process.env.NNH_DATA_DIR ?? path.join(process.cwd(), ".data"));
    // Délai court : une page ne doit jamais dépasser la limite de 10 s des fonctions Netlify
    store = withTimeout(base, 2500);
  }
  return store;
}

// Une lecture ou une écriture qui traîne ne doit jamais bloquer une page : erreur au bout de `ms`
function withTimeout(s: KeyValueStore, ms: number): KeyValueStore {
  const limit = <T,>(p: Promise<T>, what: string) =>
    Promise.race([
      p,
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error(`Stockage trop lent (${what})`)), ms)),
    ]);
  return {
    getJSON: (k) => limit(s.getJSON(k), `lecture ${k}`),
    setJSON: (k, v) => limit(s.setJSON(k, v), `écriture ${k}`),
    getBinary: (k) => limit(s.getBinary(k), `lecture ${k}`),
    setBinary: (k, d, t) => limit(s.setBinary(k, d, t), `écriture ${k}`),
    delete: (k) => limit(s.delete(k), `suppression ${k}`),
    update: (k, fn) => Promise.race([
      s.update(k, fn),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error(`Stockage trop lent (mise à jour ${k})`)), ms * 3)),
    ]),
    list: (p) => limit(s.list(p), `liste ${p}`),
  };
}

// Lecture tolérante : si le stockage est indisponible, le site affiche les valeurs d'INFOS (journalisé)
async function readOrNull<T>(key: string): Promise<T | null> {
  try {
    return await kv().getJSON<T>(key);
  } catch (e) {
    console.error(`[stockage] ${key}`, e);
    return null;
  }
}

export async function getCatalog(): Promise<Catalog> {
  const seed = seedCatalog();
  const saved = await readOrNull<Partial<Catalog>>("catalog");
  if (!saved) return seed;
  // Les produits enregistrés complètent les valeurs initiales (champs ajoutés plus tard)
  return Object.fromEntries(PRODUCT_IDS.map((id) => [id, { ...seed[id], ...saved[id], id }])) as Catalog;
}

export async function saveCatalog(catalog: Catalog) {
  await kv().setJSON("catalog", catalog);
}

export async function getSettings(): Promise<ShopSettings> {
  const seed = seedSettings();
  const saved = await readOrNull<Partial<ShopSettings>>("settings");
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
  const entry = { at: new Date().toISOString(), action, detail };
  await kv().update<AuditEntry[]>("audit-log", (log) => [entry, ...(log ?? [])].slice(0, 500));
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
    const entry = { at: new Date().toISOString(), action: where, detail: error instanceof Error ? error.message : String(error) };
    await kv().update<AuditEntry[]>("error-log", (log) => [entry, ...(log ?? [])].slice(0, 500));
  } catch {
    console.error(where, error);
  }
}

// Sessions du back-office ouvertes avant cette date : refusées
// Pas de repli ici : si le stockage est indisponible, la session admin est refusée (sécurité)
export async function getSessionEpoch(): Promise<number> {
  return (await kv().getJSON<number>("admin-session-epoch")) ?? 0;
}

export async function setSessionEpoch(at: number) {
  await kv().setJSON("admin-session-epoch", at);
}

export async function getLoginAttempts(): Promise<AttemptLog> {
  return (await kv().getJSON<AttemptLog>("login-attempts")) ?? {};
}

// Mise à jour atomique des compteurs de tentatives (connexion, contact, commandes)
export async function updateAttempts(name: "login-attempts" | "contact-attempts" | "order-attempts", fn: (log: AttemptLog) => AttemptLog) {
  return kv().update<AttemptLog>(name, (log) => fn(log ?? {}));
}

// Double authentification : dernier code accepté (un code ne sert qu'une fois). Renvoie false si déjà utilisé.
export async function consumeTotpCounter(counter: number): Promise<boolean> {
  let accepted = false;
  await kv().update<number>("admin-totp-last", (last) => {
    accepted = counter > (last ?? 0);
    return accepted ? counter : (last ?? 0);
  });
  return accepted;
}

// Messages du formulaire de contact (les 5 000 derniers ; écriture atomique : aucun message perdu)
export async function getContactMessages(): Promise<ContactMessage[]> {
  return (await kv().getJSON<ContactMessage[]>("contact-messages")) ?? [];
}

export async function appendContactMessage(message: ContactMessage) {
  await kv().update<ContactMessage[]>("contact-messages", (list) => [message, ...(list ?? [])].slice(0, 5000));
}

export async function deleteContactMessage(id: string) {
  await kv().update<ContactMessage[]>("contact-messages", (list) => (list ?? []).filter((m) => m.id !== id));
}

// Preuve d'acceptation des CGV (modification 39) : date et heure, version, numéro de commande, rien d'autre
export type CgvAcceptance = { orderNumber: string; acceptedAt: string; cgvVersion: string };

export async function recordCgvAcceptance(record: CgvAcceptance) {
  await kv().setJSON(`cgv-acceptations/${record.orderNumber}`, record);
}

export async function getCgvAcceptance(orderNumber: string): Promise<CgvAcceptance | null> {
  return kv().getJSON<CgvAcceptance>(`cgv-acceptations/${orderNumber}`);
}

// Commandes : une clé par commande (commandes/<numéro>)
export async function saveOrder(order: Order) {
  await kv().setJSON(`commandes/${order.number}`, order);
}

export async function getOrder(number: string): Promise<Order | null> {
  if (!/^NNH-\d{8}-[0-9A-F]{6}$/.test(number)) return null;
  return kv().getJSON<Order>(`commandes/${number}`);
}

// Mise à jour atomique d'une commande (paiement confirmé deux fois par Stripe : traité une seule fois)
export async function updateOrder(number: string, fn: (order: Order) => Order): Promise<Order> {
  return kv().update<Order>(`commandes/${number}`, (o) => {
    if (!o) throw new Error(`Commande inconnue : ${number}`);
    return fn(o);
  });
}

export async function listOrders(): Promise<Order[]> {
  const keys = (await kv().list("commandes")).filter((k) => /NNH-\d{8}-[0-9A-F]{6}$/.test(k));
  const orders = await Promise.all(keys.map((k) => kv().getJSON<Order>(k)));
  return orders.filter((o): o is Order => Boolean(o)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

// Compteur des factures : renvoie le numéro suivant, sans doublon ni trou
export async function nextInvoiceCounter(year: number): Promise<number> {
  const next = await kv().update<Record<string, number>>("compteur-factures", (c) => ({ ...(c ?? {}), [year]: (c?.[year] ?? 0) + 1 }));
  return next[year];
}

// Stock : mise à jour atomique du catalogue enregistré (valeurs initiales si rien n'est encore enregistré)
export async function updateCatalog(fn: (catalog: Catalog) => Catalog) {
  return kv().update<Catalog>("catalog", (saved) => {
    const seed = seedCatalog();
    const current = saved ? (Object.fromEntries(PRODUCT_IDS.map((id) => [id, { ...seed[id], ...saved[id], id }])) as Catalog) : seed;
    return fn(current);
  });
}

// Sauvegarde complète (back-office) : toutes les données JSON ; les photos envoyées sont listées par clé
export async function backupAll() {
  const keys = (await kv().list("")).sort();
  const data: Record<string, unknown> = {};
  const media: string[] = [];
  for (const key of keys) {
    if (key.startsWith("media-")) media.push(key);
    else data[key] = await kv().getJSON(key).catch((e) => ({ erreur: e instanceof Error ? e.message : String(e) }));
  }
  return { date: new Date().toISOString(), magasin: process.env.NNH_DATA_DIR ? "fichiers" : "netlify-blobs", donnees: data, photos: media };
}

// Diagnostic (page /api/sante) : type de stockage et temps de lecture, sans aucune donnée sensible
export async function storeHealth() {
  const started = Date.now();
  let ok = true;
  let error: string | null = null;
  try {
    await kv().getJSON("catalog");
  } catch (e) {
    ok = false;
    error = e instanceof Error ? e.message : String(e);
  }
  return {
    stockage: process.env.NETLIFY_BLOBS_CONTEXT || process.env.NETLIFY === "true" || process.env.SITE_ID ? "netlify-blobs" : "fichiers",
    lectureOk: ok,
    lectureMs: Date.now() - started,
    erreur: error,
  };
}

// Diagnostic approfondi (/api/sante?detail=1) : accès direct à Netlify Blobs, sans délai court
export async function storeDeepCheck() {
  if (!(process.env.NETLIFY_BLOBS_CONTEXT || process.env.SITE_ID)) return { ignore: "pas sur Netlify" };
  const { getStore } = await import("@netlify/blobs");
  const timed = async (label: string, run: () => Promise<unknown>) => {
    const t0 = Date.now();
    try {
      const r = await Promise.race([run(), new Promise((_, rej) => setTimeout(() => rej(new Error("délai 3 s dépassé")), 3000))]);
      return { etape: label, ok: true, ms: Date.now() - t0, resultat: r === null ? "vide" : typeof r };
    } catch (e) {
      return { etape: label, ok: false, ms: Date.now() - t0, erreur: e instanceof Error ? `${e.name}: ${e.message}` : String(e) };
    }
  };
  const direct = getStore({ name: storeName() });
  const store = kvRaw();
  return [
    await timed("écriture", () => direct.setJSON("diagnostic", { at: Date.now() })),
    await timed("lecture d'une clé existante", () => store.getJSON("diagnostic")),
    await timed("lecture d'une clé absente", () => store.getJSON("cle-absente-diagnostic")),
  ];
}

function kvRaw() {
  return createNetlifyStore(storeName());
}
