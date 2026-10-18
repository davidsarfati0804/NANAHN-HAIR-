import { expect, test } from "@playwright/test";

const pages = ["/soins", "/soins/fabulous", "/soins/miraculous", "/soins/luxurious", "/pack", "/mon-histoire", "/faq"];
const viewports = [
  { name: "375", width: 375, height: 812 },
  { name: "768", width: 768, height: 1024 },
  { name: "1280", width: 1280, height: 800 },
];

for (const path of pages) {
  test(`${path} : responsive, sans lien cassé`, async ({ page, request }) => {
    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `${path} à ${vp.name}px`).toBeLessThanOrEqual(0);
      const name = path === "/" ? "accueil" : path.slice(1).replace(/\//g, "-");
      await page.screenshot({ path: `captures/${name}-${vp.name}.png`, fullPage: true });
    }
    const hrefs = await page.$$eval("a[href^='/']", (as) => [...new Set(as.map((a) => a.getAttribute("href")!))]);
    for (const href of hrefs) expect((await request.get(href)).status(), href).toBe(200);
  });
}

test("fiche Miraculous : contenu INFOS, INCI, emplacements À COMPLÉTER", async ({ page }) => {
  await page.goto("/soins/miraculous");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("MIRACULOUS HAIR SERUM");
  await expect(page.getByText("39,90 €").first()).toBeVisible();
  await expect(page.getByText("Mon produit fondateur", { exact: true })).toBeVisible();
  await expect(page.getByText("vanille patchouli")).toBeVisible();
  await expect(page.getByText(/CITRAL\*\*, COUMARIN\*\*, BENZYL BENZOATE\*\*/)).toBeVisible();
  await expect(page.getByText("À COMPLÉTER : mode d'emploi Miraculous")).toBeVisible();
  await expect(page.getByText("À COMPLÉTER : précautions d'emploi Miraculous")).toBeVisible();
  await expect(page.getByRole("button", { name: "Ajouter au panier" })).toBeDisabled();
});

test("fiches : prix corrects", async ({ page }) => {
  for (const [slug, price] of [["fabulous", "19,90 €"], ["miraculous", "39,90 €"], ["luxurious", "29,90 €"]]) {
    await page.goto(`/soins/${slug}`);
    await expect(page.locator("h1 + p")).toContainText(price);
  }
  await page.goto("/pack");
  await expect(page.getByText("69,90 €").first()).toBeVisible();
});

test("FAQ : les questions s'ouvrent et affichent la réponse", async ({ page }) => {
  await page.goto("/faq");
  await page.getByText("Où livrez-vous ?").click();
  await expect(page.getByText("France uniquement.")).toBeVisible();
  await page.getByText("Comment utiliser les sérums ?").click();
  await expect(page.getByText("À COMPLÉTER : mode d'emploi de chaque sérum")).toBeVisible();
});
