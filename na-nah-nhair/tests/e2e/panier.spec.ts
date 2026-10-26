import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
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
  await expect(page.getByText(/Le paiement en ligne .* arrive bientôt/)).toBeVisible();
});

test("commande (modification 39) : CGV à cocher, récapitulatif, preuve d'acceptation enregistrée", async ({ page }) => {
  await page.goto("/soins/fabulous");
  await page.getByRole("button", { name: /Ajouter au panier/ }).click();
  await page.goto("/commande");
  await page.getByLabel("Colissimo").check();
  const pay = page.getByRole("button", { name: "Commander et payer" });
  const box = page.getByRole("checkbox", { name: /J'ai lu et j'accepte les conditions générales de vente/ });
  await expect(box).not.toBeChecked();
  await expect(page.getByRole("link", { name: "conditions générales de vente" })).toHaveAttribute("target", "_blank");
  await expect(page.getByText(/Droit de rétractation de 14 jours après réception\. Les frais de retour sont à ta charge\./)).toBeVisible();
  await expect(page.getByText("3 jours ouvrés, préparation incluse", { exact: true })).toBeVisible();
  // Case non cochée : paiement impossible, message clair
  await pay.click();
  await expect(page.getByText("Pour passer commande, accepte les conditions générales de vente.")).toBeVisible();
  // Adresse incomplète refusée par le serveur
  await box.check();
  await pay.click();
  await expect(page.getByText(/Vérifie ton adresse de livraison/)).toBeVisible();
  for (const [label, value] of [["Prénom", "Inès"], ["Nom", "Martin"], ["Email", "ines@example.fr"], ["Adresse", "1 rue de la Paix"], ["Code postal", "75002"], ["Ville", "Paris"]])
    await page.getByLabel(label, { exact: true }).fill(value);
  await expect(page.getByTestId("recap-adresse")).toHaveText("Inès Martin, 1 rue de la Paix, 75002 Paris");
  await pay.click();
  const status = page.getByText(/Commande n° NNH-\d{8}-[0-9A-F]{6}\s: conditions générales de vente acceptées \(version v1\)\./);
  await expect(status).toBeVisible();
  await page.screenshot({ path: "captures/commande-cgv.png", fullPage: true });
  // Preuve enregistrée : date et heure, version, numéro de commande, rien d'autre
  const orderNumber = ((await status.textContent()) ?? "").match(/NNH-\d{8}-[0-9A-F]{6}/)![0];
  const file = path.join(process.env.NNH_DATA_DIR!, `cgv-acceptations_${orderNumber}`);
  const record = JSON.parse(readFileSync(existsSync(file) ? file : `${file}.json`, "utf8"));
  expect(Object.keys(record).sort()).toEqual(["acceptedAt", "cgvVersion", "orderNumber"]);
  expect(record).toMatchObject({ orderNumber, cgvVersion: "v1" });
});

test("API commande : refuse sans acceptation des CGV", async ({ request }) => {
  const r = await request.post("/api/commande", { data: { items: [{ id: "fabulous", quantity: 1 }], carrier: "colissimo", acceptCgv: false } });
  expect(r.status()).toBe(400);
  expect((await r.json()).error).toBe("cgv");
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

test("franchise en base de TVA : aucun « TTC », mention 293 B au panier, à la commande et dans le pied de page", async ({ page }) => {
  await page.goto("/soins/luxurious");
  await page.getByRole("button", { name: /Ajouter au panier/ }).first().click();
  await page.goto("/panier");
  await expect(page.getByTestId("mention-tva")).toHaveText("TVA non applicable, article 293 B du CGI");
  await expect(page.locator("body")).not.toContainText("TTC");
  await page.goto("/commande");
  await page.getByLabel("Colissimo").check();
  await expect(page.getByTestId("mention-tva")).toHaveText("TVA non applicable, article 293 B du CGI");
  // Total payé = total du panier (aucune TVA ajoutée)
  await expect(page.getByTestId("total-serveur")).toHaveText(/29,90\s€/);
  await expect(page.locator("footer")).toContainText("TVA non applicable, article 293 B du CGI");
  for (const path of ["/", "/boutique", "/cgv", "/mentions-legales", "/faq"]) {
    await page.goto(path);
    expect(await page.content(), path).not.toMatch(/\bTTC\b|75016/);
  }
});
