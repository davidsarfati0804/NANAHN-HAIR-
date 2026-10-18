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
    await expect(page.getByRole("heading", { level: 1 })).toContainText("N'HAIR !");
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
  await expect(page.locator("img")).toHaveCount(0);
});

test("menu mobile au clavier", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Menu" });
  await menu.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("navigation", { name: "Navigation mobile" })).toBeVisible();
});
