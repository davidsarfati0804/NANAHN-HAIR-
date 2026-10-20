import { getStore } from "@netlify/blobs";
import type { KeyValueStore } from "./types";

// Stockage Netlify Blobs : fourni par Netlify, sans compte externe
export function createNetlifyStore(name: string): KeyValueStore {
  // Cohérence « éventuelle » (par défaut) : lecture rapide via le CDN de Netlify ; une modification
  // faite dans le back-office est visible sur le site en quelques secondes
  const store = getStore({ name });
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
