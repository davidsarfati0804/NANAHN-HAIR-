import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = [
  "/",
  "/soins",
  "/soins/fabulous",
  "/soins/miraculous",
  "/soins/luxurious",
  "/pack",
  "/mon-histoire",
  "/faq",
  "/quiz",
  "/quiz/resultat/miraculous",
  "/quiz/resultat/pack",
  "/boutique",
  "/panier",
  "/commande",
  "/contact",
  "/mentions-legales",
  "/cgv",
  "/confidentialite",
  "/cookies",
  "/retours",
  "/admin/connexion",
];

for (const path of pages) {
  test(`accessibilité WCAG AA : ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    const summary = results.violations.map((v) => `${v.id} (${v.impact}) : ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(" | ")}`);
    expect(summary, summary.join("\n")).toEqual([]);
  });
}

test.describe("accessibilité du bandeau cookies", () => {
  test.use({ storageState: { cookies: [], origins: [] } });
  test("bandeau affiché : WCAG AA", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("region", { name: "Cookies" })).toBeVisible();
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });
});

test("contour de focus visible sur fond violet foncé (pied de page, bouton principal)", async ({ page }) => {
  await page.goto("/");
  const footerLink = page.locator("footer a").first();
  await footerLink.focus();
  await expect(footerLink).toHaveCSS("outline-color", "rgb(255, 255, 255)");
  const button = page.locator("a.bouton--principal").first();
  await button.focus();
  await expect(button).toHaveCSS("outline-color", "rgb(255, 255, 255)");
});
