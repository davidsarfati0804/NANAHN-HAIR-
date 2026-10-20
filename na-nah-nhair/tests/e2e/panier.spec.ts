import { expect, test } from "@playwright/test";
import { clearCart } from "./helpers";

test.beforeEach(async ({ page }) => clearCart(page));

test("fiche → panier : quantité, total, persistance, retrait", async ({ page }) => {
  await page.goto("/soins/fabulous");
  await page.getByLabel("Quantité").fill("2");
  await page.getByRole("button", { name: /Ajouter au panier/ }).click();
  await expect(page.getByText("Ajouté au panier")).toBeVisible();
  await expect(page.getByTestId("cart-count")).toHaveText("(2)");

  await page.goto("/pack");
  await page.getByRole("button", { name: /Ajouter au panier/ }).click();
  await expect(page.getByTestId("cart-count")).toHaveText("(3)");

  await page.goto("/panier");
  await expect(page.getByTestId("sous-total")).toHaveText(/109,70\s€/); // 2 × 19,90 + 69,90
  await expect(page.getByTestId("total")).toHaveText(/109,70\s€/);
  await expect(page.getByText("Offerte")).toBeVisible();

  await page.getByRole("button", { name: "Augmenter la quantité : FABULOUS HAIR SERUM" }).click();
  await expect(page.getByTestId("quantite-fabulous")).toHaveText("3");
  await expect(page.getByTestId("total")).toHaveText(/129,60\s€/);
  await page.getByRole("button", { name: "Diminuer la quantité : FABULOUS HAIR SERUM" }).click();
  await expect(page.getByTestId("total")).toHaveText(/109,70\s€/);

  // Le panier survit au rechargement
  await page.reload();
  await expect(page.getByTestId("total")).toHaveText(/109,70\s€/);
  await expect(page.getByTestId("cart-count")).toHaveText("(3)");

  await page.getByRole("button", { name: "Retirer PACK DES 3 SOINS" }).click();
  await expect(page.getByTestId("total")).toHaveText(/39,80\s€/);
  await page.getByRole("button", { name: "Diminuer la quantité : FABULOUS HAIR SERUM" }).click();
  await page.getByRole("button", { name: "Diminuer la quantité : FABULOUS HAIR SERUM" }).click();
  await expect(page.getByText("Ton panier est vide.")).toBeVisible();
  await expect(page.getByTestId("cart-count")).toHaveText("(0)");
});

test("boutique : les 4 produits s'ajoutent au panier", async ({ page }) => {
  await page.goto("/boutique");
  const buttons = page.getByRole("button", { name: /Ajouter au panier/ });
  await expect(buttons).toHaveCount(4);
  for (let i = 0; i < 4; i++) await buttons.nth(i).click();
  await expect(page.getByTestId("cart-count")).toHaveText("(4)");
  await page.goto("/panier");
  await expect(page.getByTestId("total")).toHaveText(/159,60\s€/); // 19,90 + 39,90 + 29,90 + 69,90
});

test("commande : total recalculé par le serveur, transporteurs, paiement en attente de Stripe", async ({ page }) => {
  await page.goto("/soins/miraculous");
  await page.getByRole("button", { name: /Ajouter au panier/ }).click();
  await page.goto("/panier");
  await page.getByRole("link", { name: "Commander" }).click();
  await expect(page).toHaveURL(/\/commande$/);
  await expect(page.getByTestId("total-serveur")).toHaveText(/39,90\s€/);
  await page.getByLabel("Colissimo").check();
  await expect(page.getByTestId("total-serveur")).toHaveText(/39,90\s€/);
  await page.getByLabel("Mondial Relay (point relais)").check();
  await expect(page.getByText(/À COMPLÉTER : sélection du point relais/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Payer" })).toBeDisabled();
  await expect(page.getByText(/Le paiement en ligne .* arrive bientôt/)).toBeVisible();
});

test("commande avec panier vide", async ({ page }) => {
  await page.goto("/commande");
  await expect(page.getByText("Ton panier est vide.")).toBeVisible();
});

test("API : le serveur ignore les prix envoyés et refuse les données invalides", async ({ request }) => {
  const ok = await request.post("/api/quote", { data: { items: [{ id: "pack", quantity: 2, priceCents: 1 }] } });
  expect((await ok.json()).totalCents).toBe(13980);
  const bad = await request.post("/api/quote", { data: { items: [{ id: "x", quantity: -1 }] } });
  const body = await bad.json();
  expect(body.errors.map((e: { code: string }) => e.code)).toContain("unknown-product");
  const garbage = await request.post("/api/quote", { headers: { "Content-Type": "application/json" }, data: Buffer.from("{pas du json") });
  expect(garbage.status()).toBe(400);
});

test("panier corrompu dans le navigateur : ignoré sans planter", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("nnh-panier-v1", "{cassé"));
  await page.goto("/panier");
  await expect(page.getByText("Ton panier est vide.")).toBeVisible();
});
