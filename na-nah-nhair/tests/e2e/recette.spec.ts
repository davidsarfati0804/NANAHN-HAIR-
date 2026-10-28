import { readFile, rm } from "node:fs/promises";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { base32Decode, totpCode } from "../../lib/auth-core";
import { TEST_ADMIN_PASSWORD, TEST_TOTP_SECRET } from "../../playwright.config";
import { adminLogin } from "./helpers";

// Correctifs de la recette du 28/10/2026
test("page introuvable en français, aux couleurs du site", async ({ page }) => {
  const res = await page.goto("/page-qui-n-existe-pas");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: "Page introuvable" })).toBeVisible();
  await expect(page.locator("main").getByRole("link", { name: "Retour à l'accueil" })).toHaveAttribute("href", "/");
});

test("anciennes adresses du premier site redirigées", async ({ request }) => {
  const cases: Array<[string, string]> = [
    ["/a-propos", "/mon-histoire"],
    ["/produits/miraculous", "/soins/miraculous"],
    ["/produits/pack-zero-prise-de-tete", "/pack"],
    ["/produits/autre-chose", "/soins"],
    ["/politique-confidentialite", "/confidentialite"],
    ["/livraison-retours", "/faq#livraison"],
    ["/routines", "/soins"],
    ["/resultats", "/quiz"],
  ];
  for (const [from, to] of cases) {
    const res = await request.get(from, { maxRedirects: 0 });
    expect(res.status(), from).toBe(308);
    expect(res.headers().location, from).toBe(to);
  }
});

test("bouton principal de l'accueil : le nom de marque tient dans le bouton (ordinateur)", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const button = page.locator("main a.bouton").first();
  const overflow = await button.evaluate((el) => el.scrollWidth - el.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("menu mobile : Échap ferme le menu et rend le focus au bouton", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Menu" }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Menu" })).toBeFocused();
});

test("diagnostic public réduit ; détail réservé au back-office", async ({ page, request }) => {
  const pub = await (await request.get("/api/sante?detail=1")).json();
  expect(Object.keys(pub).sort()).toEqual(["administrationActivee", "date", "dureeTotaleMs", "ok"]);
  await adminLogin(page);
  const admin = await (await page.request.get("/api/sante")).json();
  expect(admin.contexte).toBe("local");
  expect(admin.backOfficeConfigure).toBe(true);
});

test("double authentification : un code déjà utilisé est refusé", async ({ page, browser }) => {
  // Vraie connexion (pas de session réutilisée) : le dernier code accepté est celui de cette connexion
  await rm(`${process.env.NNH_DATA_DIR!}.session-de-test`, { force: true });
  await adminLogin(page);
  const raw = await readFile(path.join(process.env.NNH_DATA_DIR!, "admin-totp-last"), "utf8");
  const used = totpCode(base32Decode(TEST_TOTP_SECRET), Number(JSON.parse(raw)));
  const ctx = await browser.newContext({ baseURL: "http://localhost:3100", storageState: { cookies: [], origins: [] } });
  const other = await ctx.newPage();
  await other.goto("/admin/connexion");
  await other.getByLabel("Mot de passe").fill(TEST_ADMIN_PASSWORD);
  await other.getByLabel(/Code de double authentification/).fill(used);
  await other.getByRole("button", { name: "Se connecter" }).click();
  await expect(other.getByText("Identifiants incorrects.")).toBeVisible();
  await ctx.close();
});

test("sauvegarde téléchargeable depuis le back-office, refusée sans session", async ({ page, request }) => {
  expect((await request.get("/admin/sauvegarde")).status()).toBe(401);
  await adminLogin(page);
  const res = await page.request.get("/admin/sauvegarde");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-disposition"]).toMatch(/sauvegarde-na-nah-nhair-\d{4}-\d{2}-\d{2}\.json/);
  const backup = await res.json();
  expect(backup.donnees).toBeTruthy();
});

test("contact : un envoi trop rapide affiche d'abord les erreurs de champs", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Envoyer" }).click();
  await expect(page.getByText("Indique ton nom (2 à 100 caractères).")).toBeVisible();
  await expect(page.getByText(/Message refusé/)).toHaveCount(0);
});

test("contact : heure d'affichage falsifiée par un script refusée", async ({ page }) => {
  await page.goto("/contact");
  await page.waitForTimeout(3200);
  await page.locator('input[name="debut"]').evaluate((el: HTMLInputElement) => (el.value = String(Date.now() - 10_000)));
  await page.getByLabel("Nom").fill("Robot");
  await page.getByLabel("Email").fill("robot@example.com");
  await page.getByLabel("Sujet").selectOption("Autre");
  await page.getByLabel("Message").fill("Message envoyé par un script.");
  await page.getByRole("button", { name: "Envoyer" }).click();
  await expect(page.getByText("Message refusé. Réessaie dans quelques instants.")).toBeVisible();
});

test("commande : lien vers la politique de confidentialité", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("nnh-panier-v1", JSON.stringify([{ id: "fabulous", quantity: 1 }])));
  await page.goto("/commande");
  await expect(page.getByRole("link", { name: "politique de confidentialité" }).first()).toHaveAttribute("href", "/confidentialite");
});
