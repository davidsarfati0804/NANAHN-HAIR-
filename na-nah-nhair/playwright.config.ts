import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { defineConfig } from "@playwright/test";
import { base32Encode, hashPassword } from "./lib/auth-core";

// Back-office de test : identifiants jetables, données dans un dossier temporaire
export const TEST_ADMIN_PASSWORD = "mot-de-passe-de-test-2026";
export const TEST_TOTP_SECRET = base32Encode(Buffer.from("secret-totp-de-test!"));
const dataDir = process.env.NNH_DATA_DIR ?? mkdtempSync(path.join(tmpdir(), "nnh-e2e-"));
process.env.NNH_DATA_DIR = dataDir;

export default defineConfig({
  testDir: "tests/e2e",
  workers: 1,
  use: {
    baseURL: "http://localhost:3100",
    launchOptions: process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {},
  },
  webServer: {
    command: "npm run start -- -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: false,
    env: {
      NNH_DATA_DIR: dataDir,
      NNH_INSECURE_COOKIES: "1",
      ADMIN_PASSWORD_HASH: process.env.E2E_ADMIN_HASH ?? (process.env.E2E_ADMIN_HASH = hashPassword(TEST_ADMIN_PASSWORD)),
      ADMIN_SESSION_SECRET: "session-secret-de-test-0123456789abcdef",
      ADMIN_TOTP_SECRET: TEST_TOTP_SECRET,
    },
  },
});
