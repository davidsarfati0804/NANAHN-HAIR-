import { rm } from "node:fs/promises";
import path from "node:path";
import { expect, type Page } from "@playwright/test";
import { base32Decode, totpCode } from "../../lib/auth-core";
import { TEST_ADMIN_PASSWORD, TEST_TOTP_SECRET } from "../../playwright.config";

export async function adminLogin(page: Page) {
  await page.goto("/admin/connexion");
  await page.getByLabel("Mot de passe").fill(TEST_ADMIN_PASSWORD);
  await page.getByLabel(/Code de double authentification/).fill(totpCode(base32Decode(TEST_TOTP_SECRET), Math.floor(Date.now() / 30000)));
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL(/\/admin$/);
}

// Remet la boutique dans son état initial (prix INFOS, stock non suivi)
export async function resetShop() {
  const dir = process.env.NNH_DATA_DIR!;
  await Promise.all(["catalog", "settings"].map((f) => rm(path.join(dir, f), { force: true })));
}

export async function clearCart(page: Page) {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
}
