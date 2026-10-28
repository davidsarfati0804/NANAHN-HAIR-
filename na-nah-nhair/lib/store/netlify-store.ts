import { getStore } from "@netlify/blobs";
import type { KeyValueStore } from "./types";

// fetch d'origine, sans le cache de données de Next.js (même méthode que @netlify/plugin-nextjs) :
// avec le fetch modifié par Next, les lectures Netlify Blobs restaient bloquées dans les pages.
type FetchWithOriginal = typeof fetch & { _nextOriginalFetch?: typeof fetch };
const originalFetch: typeof fetch = (input, init) => {
  const base = (globalThis.fetch as FetchWithOriginal)._nextOriginalFetch ?? globalThis.fetch;
  return base(input, {
    ...init,
    cache: "no-store",
    // @ts-expect-error -- option interne de Next.js : ne jamais passer par son cache de données
    next: { ...(init as { next?: object } | undefined)?.next, internal: true },
  });
};

// Stockage Netlify Blobs : fourni par Netlify, sans compte externe
export function createNetlifyStore(name: string): KeyValueStore {
  // Cohérence « éventuelle » (par défaut) : lecture rapide ; une modification faite dans le
  // back-office est visible sur le site en quelques secondes
  const store = getStore({ name, fetch: originalFetch });
  // Sur Netlify, lire une clé qui n'existe pas encore reste bloqué (constaté le 20/10/2026 via
  // /api/sante?detail=1) : on vérifie d'abord son existence avec list(), qui répond en ~30 ms.
  const exists = async (key: string) => {
    const { blobs } = await store.list({ prefix: key });
    return blobs.some((b) => b.key === key);
  };
  return {
    async getJSON<T>(key: string) {
      if (!(await exists(key))) return null;
      return ((await store.get(key, { type: "json" })) as T | null) ?? null;
    },
    async setJSON(key, value) {
      await store.setJSON(key, value);
    },
    async getBinary(key) {
      if (!(await exists(key))) return null;
      const res = await store.getWithMetadata(key, { type: "arrayBuffer" });
      if (!res) return null;
      return { data: res.data, contentType: String(res.metadata.contentType ?? "application/octet-stream") };
    },
    async setBinary(key, data, contentType) {
      await store.set(key, data, { metadata: { contentType } });
    },
    async delete(key) {
      await store.delete(key);
    },
    // Écriture conditionnelle (ETag) : si la clé a changé entre la lecture et l'écriture, on recommence
    async update<T>(key: string, fn: (current: T | null) => T) {
      for (let attempt = 0; attempt < 8; attempt++) {
        const current = (await exists(key))
          ? await store.getWithMetadata(key, { type: "json", consistency: "strong" })
          : null;
        const next = fn(((current?.data as T | undefined) ?? null) as T | null);
        const result = await store.setJSON(key, next, current?.etag ? { onlyIfMatch: current.etag } : { onlyIfNew: true });
        if (result.modified) return next;
        await new Promise((r) => setTimeout(r, 30 + Math.random() * 120));
      }
      throw new Error(`Écriture concurrente impossible (${key})`);
    },
    async list(prefix) {
      const { blobs } = await store.list({ prefix });
      return blobs.map((b) => b.key);
    },
  };
}
