import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { createFileStore } from "@/lib/store/file-store";

describe("stockage local", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "nnh-store-"));
  afterAll(() => rm(dir, { recursive: true, force: true }));
  const store = createFileStore(dir);

  it("JSON : lecture, écriture, absence", async () => {
    expect(await store.getJSON("rien")).toBeNull();
    await store.setJSON("catalog", { a: 1 });
    expect(await store.getJSON("catalog")).toEqual({ a: 1 });
  });

  it("fichiers binaires avec type", async () => {
    const bytes = new Uint8Array([0xff, 0xd8, 0xff, 1, 2, 3]);
    await store.setBinary("media-x", bytes.buffer, "image/jpeg");
    const got = await store.getBinary("media-x");
    expect(got?.contentType).toBe("image/jpeg");
    expect(new Uint8Array(got!.data)).toEqual(bytes);
    await store.delete("media-x");
    expect(await store.getBinary("media-x")).toBeNull();
  });

  it("clés nettoyées (pas de sortie du dossier)", async () => {
    await store.setJSON("../../evil", { x: 1 });
    expect(await store.getJSON("../../evil")).toEqual({ x: 1 });
  });
});
