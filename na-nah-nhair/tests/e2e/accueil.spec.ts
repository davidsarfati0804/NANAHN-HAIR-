import { expect, test } from "@playwright/test";

const viewports = [
  { name: "mobile-375", width: 375, height: 812 },
  { name: "tablette-768", width: 768, height: 1024 },
  { name: "ordinateur-1280", width: 1280, height: 800 },
];

for (const vp of viewports) {
  test(`accueil responsive ${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto("/");
    // Titre = logo fourni, nom accessible « Na Nah N’hair ! »
    await expect(page.getByRole("heading", { level: 1, name: /^Na Nah N’hair\s!$/ })).toBeVisible();
    await expect(page.getByText("Révèle ton Na Nah N'Hair.").first()).toBeVisible();
    // Pas de défilement horizontal
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    await page.screenshot({ path: `captures/accueil-${vp.name}.png`, fullPage: true });
  });
}

test("le bandeau mène au quiz", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Quel Na Nah N'Hair es-tu ?" }).first().click();
  await expect(page).toHaveURL(/\/quiz$/);
});

test("boutons du hero", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Je découvre mon Na Nah N'Hair" })).toHaveAttribute("href", "/quiz");
  await expect(page.getByRole("link", { name: "Découvrir les trois soins" })).toHaveAttribute("href", "/soins");
});

test("aucun lien interne cassé depuis l'accueil", async ({ page, request }) => {
  await page.goto("/");
  const hrefs = await page.$$eval("a[href^='/']", (as) => [...new Set(as.map((a) => a.getAttribute("href")!))]);
  for (const href of hrefs) {
    const res = await request.get(href);
    expect(res.status(), href).toBe(200);
  }
});

test("les photos manquantes sont signalées, pas inventées", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("À COMPLÉTER : photo")).toHaveCount(4);
  // Seules images : le logo (en-tête et titre). Aucun faux visuel de flacon.
  await expect(page.locator('img:not([alt^="Na Nah N’hair"])')).toHaveCount(0);
});

test("menu mobile au clavier", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Menu" });
  await menu.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("navigation", { name: "Navigation mobile" })).toBeVisible();
});

test.describe("modification 2 : titre, logo, bandeau", () => {
  for (const vp of [
    { name: "375", width: 375, height: 812 },
    { name: "768", width: 768, height: 1024 },
    { name: "1280", width: 1280, height: 800 },
  ]) {
    test(`aucun débordement à ${vp.name} px`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/");
      const bar = page.getByRole("link", { name: /^Quel Na Nah N'Hair es-tu\s\?$/ });
      await expect(bar).toHaveAttribute("href", "/quiz");
      // Bandeau : texte entier visible (ni coupé ni masqué)
      const fits = await bar.evaluate((el) => el.scrollWidth <= el.clientWidth && el.getBoundingClientRect().left >= 0);
      expect(fits).toBe(true);
      const style = await bar.evaluate((el) => {
        const s = getComputedStyle(el);
        return { bg: s.backgroundColor, color: s.color, transform: s.textTransform };
      });
      expect(style).toEqual({ bg: "rgb(241, 225, 176)", color: "rgb(128, 118, 179)", transform: "none" });
      // Logo de l'en-tête et titre dans l'écran, sans débordement
      for (const img of await page.locator('img[alt^="Na Nah N’hair"]').all()) {
        const box = (await img.boundingBox())!;
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(vp.width);
      }
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      await page.screenshot({ path: `captures/modif2-accueil-${vp.name}.png` });
    });
  }

  test("textes du hero : uniquement ceux du BRIEF, aucun code promo affiché", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Révèle ton Na Nah N'Hair.").first()).toBeVisible();
    await expect(page.getByText(/^Trois soins\. Trois personnalités\. Une seule question\s: lequel est le tien\s\?$/)).toBeVisible();
    const html = await page.content();
    for (const banned of ["chichis", "NNH26", "NNH27", "faire pousser", "envoûtantes"]) expect(html).not.toContain(banned);
  });
});
