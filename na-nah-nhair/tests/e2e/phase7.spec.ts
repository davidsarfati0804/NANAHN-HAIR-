import { expect, test } from "@playwright/test";
import { adminLogin } from "./helpers";

test.describe("formulaire de contact", () => {
  test("champs vides et email invalide : erreurs sous les champs", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForTimeout(3200);
    await page.getByRole("button", { name: "Envoyer" }).click();
    await expect(page.getByText("Indique ton nom (2 à 100 caractères).")).toBeVisible();
    await expect(page.getByText("Indique une adresse email valide.")).toBeVisible();
    await expect(page.getByText("Choisis un sujet.")).toBeVisible();
    await expect(page.getByText(/Ton message doit contenir/)).toBeVisible();
    await page.getByLabel("Email").fill("pas-un-email");
    await page.getByRole("button", { name: "Envoyer" }).click();
    await expect(page.getByText("Indique une adresse email valide.")).toBeVisible();
    await expect(page.getByLabel("Email")).toHaveAttribute("aria-invalid", "true");
  });

  test("anti-spam : robot qui remplit le champ piège refusé", async ({ page }) => {
    await page.goto("/contact");
    await page.waitForTimeout(3200);
    await page.locator('input[name="site_web"]').evaluate((el: HTMLInputElement) => (el.value = "http://spam.example"));
    await page.getByLabel("Nom").fill("Robot");
    await page.getByLabel("Email").fill("robot@example.com");
    await page.getByLabel("Sujet").selectOption("Autre");
    await page.getByLabel("Message").fill("Achetez mes produits miracles !!!");
    await page.getByRole("button", { name: "Envoyer" }).click();
    await expect(page.getByText("Message refusé. Réessaie dans quelques instants.")).toBeVisible();
  });

  test("message valide : confirmation, réception dans le back-office, suppression", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Nom").fill("Inès Test");
    await page.getByLabel("Email").fill("ines@example.fr");
    await page.getByLabel("Sujet").selectOption("Les soins");
    await page.getByLabel("Message").fill("Bonjour, quel soin pour des cheveux secs ?");
    await page.waitForTimeout(3200);
    await page.getByRole("button", { name: "Envoyer" }).click();
    await expect(page.getByText(/Merci\s! Ton message a bien été envoyé/)).toBeVisible();
    await expect(page.getByLabel("Nom")).toHaveValue("");

    await adminLogin(page);
    await page.goto("/admin/messages");
    await expect(page.getByText("Bonjour, quel soin pour des cheveux secs ?")).toBeVisible();
    const csv = await page.request.get("/admin/messages-export");
    expect(csv.status()).toBe(200);
    expect(await csv.text()).toContain("ines@example.fr");
    await page.getByRole("button", { name: "Supprimer" }).first().click();
    await expect(page.getByText("Bonjour, quel soin pour des cheveux secs ?")).toHaveCount(0);
  });

  test("export des messages refusé sans connexion", async ({ request }) => {
    const res = await request.get("/admin/messages-export", { maxRedirects: 0 });
    expect([307, 401]).toContain(res.status());
    expect(await res.text()).not.toContain("@");
  });
});

test.describe("bandeau cookies", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("affiché à la première visite, choix mémorisé, modifiable", async ({ page }) => {
    await page.goto("/");
    const banner = page.getByRole("region", { name: "Cookies" });
    await expect(banner).toBeVisible();
    await expect(banner).toContainText("Aucun cookie publicitaire");
    await banner.getByRole("button", { name: "Accepter" }).click();
    await expect(banner).toHaveCount(0);
    await page.reload();
    await expect(page.getByRole("region", { name: "Cookies" })).toHaveCount(0);
    // Aucun cookie déposé côté visiteur
    expect(await page.context().cookies()).toEqual([]);

    await page.goto("/cookies");
    await expect(page.getByText(/Ton choix actuel\s:\saccepté/)).toBeVisible();
    await page.getByRole("button", { name: "Modifier mon choix" }).click();
    await expect(page.getByRole("region", { name: "Cookies" })).toBeVisible();
    await page.getByRole("button", { name: "Refuser" }).click();
    await expect(page.getByText(/Ton choix actuel\s:\srefusé/)).toBeVisible();
  });
});

test("pages juridiques : contenu, À COMPLÉTER, avertissement de relecture", async ({ page }) => {
  for (const [path, title] of [
    ["/mentions-legales", "Mentions légales"],
    ["/cgv", "Conditions générales de vente"],
    ["/confidentialite", "Politique de confidentialité"],
    ["/cookies", "Politique cookies"],
    ["/retours", "Retours et droit de rétractation"],
  ]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await expect(page.getByRole("note")).toBeVisible();
  }
  await page.goto("/mentions-legales");
  await expect(page.getByText(/SIRET\s:\s922 151 170 00011/)).toBeVisible();
  await expect(page.getByText(/À COMPLÉTER\s:\sstatut de l'entreprise/)).toBeVisible();
  await page.goto("/cgv");
  await expect(page.getByText(/Projet de CGV/)).toBeVisible();
});

test("SEO : sitemap, robots (non indexé avant la mise en ligne), données produit", async ({ page, request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const p of ["/soins/fabulous", "/pack", "/quiz", "/cgv"]) expect(sitemap).toContain(p);
  expect(sitemap).not.toContain("/admin");
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toMatch(/Disallow: \//);

  await page.goto("/soins/fabulous");
  const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
  expect(ld["@type"]).toBe("Product");
  expect(ld.offers.priceCurrency).toBe("EUR");
  expect(ld.offers.price).toMatch(/^\d+\.\d\d$/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/soins\/fabulous$/);
});

test("résultat du quiz : bouton de partage", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/quiz/resultat/fabulous");
  await page.evaluate(() => Object.defineProperty(navigator, "share", { value: undefined }));
  await page.getByRole("button", { name: "Partager mon résultat" }).click();
  await expect(page.getByText("Lien copié !")).toBeVisible();
});
