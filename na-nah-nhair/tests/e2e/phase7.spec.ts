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

test("pages juridiques (modification 39) : contenu fourni, À COMPLÉTER visibles", async ({ page }) => {
  for (const [path, title] of [
    ["/mentions-legales", "Mentions légales"],
    ["/cgv", "Conditions générales de vente"],
    ["/retractation", "Droit de rétractation"],
    ["/confidentialite", "Politique de confidentialité"],
    ["/cookies", "Politique de cookies"],
  ]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await expect(page.locator("main")).not.toContainText(/INFOS|phase \d|Claude/);
  }
  await page.goto("/mentions-legales");
  await expect(page.getByText(/SIRET\s:\s922 151 170 00011/)).toBeVisible();
  await expect(page.getByText(/édité par la société BIOTYVIE/)).toBeVisible();
  await expect(page.locator("mark", { hasText: "À COMPLÉTER : nom, adresse postale et site internet du médiateur" })).toBeVisible();
  await page.goto("/cgv");
  await expect(page.getByText(/3 jours ouvrés, préparation incluse/)).toBeVisible();
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

test("pied de page : une ligne « Mentions légales · CGV · Rétractation · Confidentialité · Cookies »", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Informations légales" });
  await expect(nav).toHaveText(/^Mentions légales\s*·\s*CGV\s*·\s*Rétractation\s*·\s*Confidentialité\s*·\s*Cookies$/);
  for (const [name, href] of [["Mentions légales", "/mentions-legales"], ["CGV", "/cgv"], ["Rétractation", "/retractation"], ["Confidentialité", "/confidentialite"], ["Cookies", "/cookies"]]) {
    await nav.getByRole("link", { name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    await page.goBack();
  }
  await page.goto("/retours");
  await expect(page).toHaveURL(/\/retractation$/);
});

test("CGV : sommaire cliquable, version, PDF ; rétractation : formulaire et PDF", async ({ page, request }) => {
  await page.goto("/cgv");
  await expect(page.getByText(/Version\s: v1\./)).toBeVisible();
  await page.getByRole("link", { name: "Droit de rétractation", exact: true }).click();
  await expect(page).toHaveURL(/#7-droit-de-retractation$/);
  await expect(page.getByRole("heading", { name: "7. Droit de rétractation" })).toBeInViewport();
  await expect(page.getByRole("link", { name: "Télécharger les CGV" })).toHaveAttribute("href", "/documents/cgv-v1.pdf");
  await page.goto("/retractation");
  await expect(page.getByRole("heading", { name: "Modèle de formulaire de rétractation" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Télécharger le formulaire" })).toHaveAttribute("href", "/documents/formulaire-de-retractation.pdf");
  for (const pdf of ["/documents/cgv-v1.pdf", "/documents/formulaire-de-retractation.pdf"]) {
    const r = await request.get(pdf);
    expect(r.status(), pdf).toBe(200);
    expect((await r.body()).subarray(0, 4).toString()).toBe("%PDF");
  }
});
