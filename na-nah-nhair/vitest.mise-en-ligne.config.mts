import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Contrôle de mise en ligne (contenu des pages) : voir scripts/verifier-mise-en-ligne.mjs
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./", import.meta.url)) } },
  test: { include: ["tests/mise-en-ligne/**/*.test.ts"] },
});
