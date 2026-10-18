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
