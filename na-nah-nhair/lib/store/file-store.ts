import { randomBytes } from "node:crypto";
import { mkdir, readdir, readFile, rm, writeFile, rename } from "node:fs/promises";
import path from "node:path";
import type { KeyValueStore } from "./types";

// Stockage sur disque, pour le développement et les tests (dossier .data/)
export function createFileStore(dir: string): KeyValueStore {
  const file = (key: string) => path.join(dir, key.replace(/[^a-zA-Z0-9._-]/g, "_"));
  const write = async (target: string, data: string | Uint8Array) => {
    await mkdir(dir, { recursive: true });
    const tmp = `${target}.${process.pid}.${randomBytes(6).toString("hex")}.tmp`;
    await writeFile(tmp, data);
    await rename(tmp, target); // écriture atomique
  };
  const read = async (target: string) => {
    try {
      return await readFile(target);
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw e;
    }
  };

  // Un seul processus en local : les mises à jour d'une même clé passent l'une après l'autre
  const queues = new Map<string, Promise<unknown>>();

  const store: KeyValueStore = {
    async getJSON<T>(key: string) {
      const buf = await read(file(key));
      return buf ? (JSON.parse(buf.toString("utf8")) as T) : null;
    },
    async setJSON(key, value) {
      await write(file(key), JSON.stringify(value, null, 2));
    },
    async getBinary(key) {
      const [data, meta] = await Promise.all([read(file(key)), read(file(`${key}.type`))]);
      if (!data || !meta) return null;
      return {
        data: data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer,
        contentType: meta.toString("utf8"),
      };
    },
    async setBinary(key, data, contentType) {
      await write(file(key), new Uint8Array(data));
      await write(file(`${key}.type`), contentType);
    },
    async delete(key) {
      await Promise.all([rm(file(key), { force: true }), rm(file(`${key}.type`), { force: true })]);
    },
    update<T>(key: string, fn: (current: T | null) => T) {
      const run = (queues.get(key) ?? Promise.resolve()).catch(() => undefined).then(async () => {
        const next = fn(await store.getJSON<T>(key));
        await store.setJSON(key, next);
        return next;
      });
      queues.set(key, run);
      return run;
    },
    async list(prefix) {
      const names = await readdir(dir).catch(() => [] as string[]);
      const p = path.basename(file(prefix));
      return names.filter((n) => n.startsWith(p) && !n.endsWith(".tmp") && !n.endsWith(".type"));
    },
  };
  return store;
}
