import { readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { expect, type Page } from "@playwright/test";
import { base32Decode, totpCode } from "../../lib/auth-core";
import { TEST_ADMIN_PASSWORD, TEST_TOTP_SECRET } from "../../playwright.config";

// Un code à 6 chiffres ne sert qu'une fois : on prend la période suivant le dernier code accepté par le
// serveur (lu dans son dossier de données), au plus une période d'avance (tolérance du serveur)
async function nextTotpCounter(page: Page): Promise<number> {
  for (;;) {
    const raw = await readFile(path.join(process.env.NNH_DATA_DIR!, "admin-totp-last"), "utf8").catch(() => "0");
    const last = Number(JSON.parse(raw)) || 0;
    const now = Math.floor(Date.now() / 30000);
    if (last < now + 1) return Math.max(now, last + 1);
    await page.waitForTimeout(1000);
  }
}

// Session déjà ouverte par un test précédent (cookie gardé dans le dossier de données) : réutilisée tant
// qu'elle est valide, ce qui évite d'attendre un nouveau code à 6 chiffres à chaque test
const SESSION_FILE = () => `${process.env.NNH_DATA_DIR!}.session-de-test`;

export async function adminLogin(page: Page) {
  const saved = await readFile(SESSION_FILE(), "utf8").catch(() => null);
  if (saved) {
    await page.context().addCookies([{ name: "nnh_admin", value: saved, url: "http://localhost:3100" }]);
    await page.goto("/admin");
    if (/\/admin$/.test(page.url())) return;
  }
  await page.goto("/admin/connexion");
  await page.getByLabel("Mot de passe").fill(TEST_ADMIN_PASSWORD);
  await page.getByLabel(/Code de double authentification/).fill(totpCode(base32Decode(TEST_TOTP_SECRET), await nextTotpCounter(page)));
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL(/\/admin$/);
  const cookie = (await page.context().cookies()).find((c) => c.name === "nnh_admin");
  if (cookie) await writeFile(SESSION_FILE(), cookie.value);
}

// Remet la boutique dans son état initial (prix INFOS, stock non suivi)
export async function resetShop() {
  const dir = process.env.NNH_DATA_DIR!;
  await Promise.all(["catalog", "settings"].map((f) => rm(path.join(dir, f), { force: true })));
}

export async function clearCart(page: Page) {
  await page.goto("/");
  await page.evaluate(() => localStorage.removeItem("nnh-panier-v1"));
}
