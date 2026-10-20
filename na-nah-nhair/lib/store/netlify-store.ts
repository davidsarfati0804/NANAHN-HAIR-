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
  return {
    async getJSON<T>(key: string) {
      return ((await store.get(key, { type: "json" })) as T | null) ?? null;
    },
    async setJSON(key, value) {
      await store.setJSON(key, value);
    },
    async getBinary(key) {
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
  };
}
