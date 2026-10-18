import { expect, test } from "@playwright/test";
import { TEST_ADMIN_PASSWORD } from "../../playwright.config";
import { adminLogin, clearCart, resetShop } from "./helpers";

test.afterAll(resetShop);

test("visiteur non connecté : toutes les pages du back-office sont refusées", async ({ page }) => {
  for (const path of ["/admin", "/admin/produits", "/admin/livraison", "/admin/journal"]) {
    await page.goto(path);
    await expect(page, path).toHaveURL(/\/admin\/connexion$/);
  }
});

test("cookie de session falsifié : refusé", async ({ page, context }) => {
  await context.addCookies([{ name: "nnh_admin", value: "eyJ2IjoxLCJleHAiOjk5OTk5OTk5OTk5OTl9.faux", url: "http://localhost:3100" }]);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/connexion$/);
});

test("connexion : mauvais mot de passe, mauvais code, puis succès et déconnexion", async ({ page }) => {
  await page.goto("/admin/connexion");
  await page.getByLabel("Mot de passe").fill("faux mot de passe");
  await page.getByLabel(/Code de double authentification/).fill("000000");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page.getByText("Identifiants incorrects.")).toBeVisible();

  await page.getByLabel("Mot de passe").fill(TEST_ADMIN_PASSWORD);
  await page.getByLabel(/Code de double authentification/).fill("123456");
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page.getByText("Identifiants incorrects.")).toBeVisible();

  await adminLogin(page);
  await expect(page.getByRole("heading", { name: "Back-office" })).toBeVisible();
  await page.getByRole("button", { name: "Se déconnecter" }).click();
  await expect(page).toHaveURL(/\/admin\/connexion$/);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/connexion$/);
});

test("produits : prix, stock, épuisé, désactivation, photo", async ({ page }) => {
  await clearCart(page);
  await adminLogin(page);
  await page.goto("/admin/produits");

  // Prix invalide refusé
  const fab = page.getByRole("form", { name: "FABULOUS HAIR SERUM" });
  await fab.getByLabel("Prix TTC (€)").fill("abc");
  await fab.getByRole("button", { name: "Enregistrer" }).click();
  await expect(fab.getByRole("status")).toHaveText("Prix invalide (exemple : 19,90).");

  // Nouveau prix visible sur le site
  await fab.getByLabel("Prix TTC (€)").fill("21,50");
  await fab.getByLabel("Stock").fill("3");
  await fab.getByRole("button", { name: "Enregistrer" }).click();
  await expect(fab.getByRole("status")).toHaveText("Modifications enregistrées.");
  await page.goto("/soins/fabulous");
  await expect(page.locator("h1 + p")).toContainText(/21,50\s€/);
  await expect(page.getByText("Plus que 3 en stock")).toBeVisible();

  // Le panier ne dépasse pas le stock
  await page.getByLabel("Quantité").fill("3");
  await page.getByRole("button", { name: /Ajouter au panier/ }).click();
  await expect(page.getByRole("button", { name: /Ajouter au panier/ })).toBeDisabled();

  // Stock à 0 → épuisé partout, pack compris
  await page.goto("/admin/produits");
  const lux = page.getByRole("form", { name: "LUXURIOUS HAIR SERUM" });
  await lux.getByLabel("Stock").fill("0");
  await lux.getByRole("button", { name: "Enregistrer" }).click();
  await expect(lux.getByRole("status")).toHaveText("Modifications enregistrées.");
  await page.goto("/soins/luxurious");
  await expect(page.getByText("Épuisé", { exact: true })).toBeVisible();
  await page.goto("/pack");
  await expect(page.getByText("Épuisé", { exact: true })).toBeVisible();
  await page.goto("/boutique");
  await expect(page.getByText("Épuisé", { exact: true })).toHaveCount(2);

  // Stock invalide refusé
  await page.goto("/admin/produits");
  await lux.getByLabel("Stock").fill("-2");
  await lux.getByRole("button", { name: "Enregistrer" }).click();
  await expect(lux.getByRole("status")).toContainText("Stock invalide");

  // Désactivation de Miraculous
  const mir = page.getByRole("form", { name: "MIRACULOUS HAIR SERUM" });
  await mir.getByLabel("Disponible à la vente").uncheck();
  await mir.getByRole("button", { name: "Enregistrer" }).click();
  await expect(mir.getByRole("status")).toHaveText("Modifications enregistrées.");
  await page.goto("/soins/miraculous");
  await expect(page.getByText("Épuisé", { exact: true })).toBeVisible();

  // Photo : un faux fichier est refusé, une vraie image PNG est acceptée et affichée
  await page.goto("/admin/produits");
  await fab.getByLabel(/Photo/).setInputFiles({ name: "faux.png", mimeType: "image/png", buffer: Buffer.from("pas une image") });
  await fab.getByRole("button", { name: "Enregistrer" }).click();
  await expect(fab.getByRole("status")).toContainText("Format de photo refusé");
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "base64",
  );
  await fab.getByLabel(/Photo/).setInputFiles({ name: "fabulous.png", mimeType: "image/png", buffer: png });
  await fab.getByRole("button", { name: "Enregistrer" }).click();
  await expect(fab.getByRole("status")).toHaveText("Modifications enregistrées.");
  await page.goto("/soins/fabulous");
  await expect(page.locator('img[alt="Flacon du Fabulous Hair Serum, 30 ml"]')).toBeVisible();

  // Journal
  await page.goto("/admin/journal");
  await expect(page.getByText(/fabulous : prix 1990 → 2150 c/)).toBeVisible();
});

test("livraison : seuil et tarifs configurables", async ({ page }) => {
  await clearCart(page);
  await adminLogin(page);
  await page.goto("/admin/livraison");
  await page.getByLabel("Livraison offerte à partir de (€)").fill("50");
  await page.getByRole("group", { name: "Colissimo" }).getByLabel("Tarif (€)").fill("4,90");
  await page.getByRole("button", { name: "Enregistrer" }).click();
  await expect(page.getByText("Modifications enregistrées.")).toBeVisible();

  await page.goto("/soins/fabulous");
  await page.getByRole("button", { name: /Ajouter au panier/ }).click();
  await page.goto("/commande");
  await page.getByLabel("Colissimo").check();
  // Fabulous à 21,50 € (test précédent) + 4,90 € de livraison
  await expect(page.getByTestId("total-serveur")).toHaveText(/26,40\s€/);
  await page.getByLabel("Mondial Relay (point relais)").check();
  // Tarif Mondial Relay non renseigné : livraison « calculée », total sans livraison
  await expect(page.getByTestId("total-serveur")).toHaveText(/21,50\s€/);

  await page.goto("/admin/livraison");
  await page.getByLabel("Livraison offerte à partir de (€)").fill("0");
  await page.getByRole("button", { name: "Enregistrer" }).click();
  await expect(page.getByText("Modifications enregistrées.")).toBeVisible();
});

test("aucune donnée du back-office dans les réponses envoyées à un visiteur non connecté", async ({ request }) => {
  for (const path of ["/admin", "/admin/produits", "/admin/livraison", "/admin/journal"]) {
    for (const headers of [{}, { RSC: "1" }]) {
      const res = await request.get(path, { maxRedirects: 0, headers });
      expect(res.status(), path).toBe(307);
      const body = await res.text();
      for (const secret of ["priceCents", "freeShippingThresholdCents", "Produits et stocks", "IP "]) {
        expect(body, `${path} ${JSON.stringify(headers)}`).not.toContain(secret);
      }
    }
  }
});

test("déconnexion : l'ancien cookie de session ne fonctionne plus", async ({ page, context, browser }) => {
  await adminLogin(page);
  const cookie = (await context.cookies()).find((c) => c.name === "nnh_admin")!;
  await page.getByRole("button", { name: "Se déconnecter" }).click();
  await expect(page).toHaveURL(/\/admin\/connexion$/);
  const other = await browser.newContext();
  await other.addCookies([cookie]);
  const p2 = await other.newPage();
  await p2.goto("http://localhost:3100/admin");
  await expect(p2).toHaveURL(/\/admin\/connexion$/);
  await other.close();
});

test("en-têtes de sécurité", async ({ request }) => {
  const res = await request.get("/");
  const h = res.headers();
  expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(h["strict-transport-security"]).toContain("max-age=");
  expect(h["x-frame-options"]).toBe("DENY");
  expect(h["x-powered-by"]).toBeUndefined();
});

test("API : corps trop volumineux refusé avant lecture", async ({ request }) => {
  const res = await request.post("/api/quote", { headers: { "Content-Type": "application/json" }, data: Buffer.from("x".repeat(20000)) });
  expect(res.status()).toBe(413);
});

test("back-office : actions refusées sans session (appel direct)", async ({ request }) => {
  const res = await request.get("/admin/produits", { maxRedirects: 0 });
  expect([303, 307, 308, 200]).toContain(res.status());
  if (res.status() === 200) expect(await res.text()).not.toContain("Produits et stocks</h1>");
});
