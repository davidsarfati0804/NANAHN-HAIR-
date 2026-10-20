import { expect, test } from "@playwright/test";

const pages = [
  "/",
  "/quiz/resultat/miraculous",
  "/quiz/resultat/luxurious",
  "/soins",
  "/soins/fabulous",
  "/soins/miraculous",
  "/soins/luxurious",
  "/pack",
  "/mon-histoire",
  "/faq",
  "/quiz",
  "/quiz/resultat/fabulous",
  "/quiz/resultat/pack",
  "/boutique",
  "/panier",
  "/commande",
  "/admin/connexion",
  "/contact",
  "/cgv",
  "/mentions-legales",
];
const viewports = [
  { name: "320", width: 320, height: 640 },
  { name: "375", width: 375, height: 812 },
  { name: "768", width: 768, height: 1024 },
  { name: "900", width: 900, height: 1000 },
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
      // Aucun titre ne dépasse de son bloc
      const wide = await page.evaluate(() =>
        [...document.querySelectorAll("h1:not(.sr-only), h2:not(.sr-only)")]
          .filter((h) => h.scrollWidth > (h as HTMLElement).clientWidth + 1)
          .map((h) => h.textContent),
      );
      expect(wide, `${path} à ${vp.name}px`).toEqual([]);
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
  await expect(page.getByText(/39,90\s€/).first()).toBeVisible();
  await expect(page.getByText("Mon produit fondateur", { exact: true })).toBeVisible();
  await expect(page.getByText("vanille patchouli")).toBeVisible();
  await expect(page.getByText(/CITRAL\*\*, COUMARIN\*\*, BENZYL BENZOATE\*\*/)).toBeVisible();
  // Mode d'emploi fourni (les précautions en font partie)
  await expect(page.getByText(/Appliquer Miraculous Hair Serum des racines vers les pointes/)).toBeVisible();
  await expect(page.getByText("Usage externe uniquement.")).toBeVisible();
  await page.goto("/soins/luxurious");
  await expect(page.getByText("À COMPLÉTER : mode d'emploi Luxurious")).toBeVisible();
  await expect(page.getByText("À COMPLÉTER : précautions d'emploi Luxurious")).toBeVisible();
  await page.goto("/soins/miraculous");
  await expect(page.getByRole("button", { name: /Ajouter au panier/ })).toBeEnabled();
});

test("fiches : prix corrects", async ({ page }) => {
  for (const [slug, price] of [["fabulous", "19,90 €"], ["miraculous", "39,90 €"], ["luxurious", "29,90 €"]]) {
    await page.goto(`/soins/${slug}`);
    await expect(page.locator("h1 + p")).toContainText(new RegExp(price.replace(" ", "\\s")));
  }
  await page.goto("/pack");
  await expect(page.getByText(/69,90\s€/).first()).toBeVisible();
});

test("FAQ : les questions s'ouvrent et affichent la réponse", async ({ page }) => {
  await page.goto("/faq");
  await page.getByText("Où livrez-vous ?").click();
  await expect(page.getByText("France uniquement.")).toBeVisible();
  await page.getByText("Comment utiliser les sérums ?").click();
  await expect(page.getByText("À COMPLÉTER : mode d'emploi de chaque sérum")).toBeVisible();
});

test.describe("mode d'emploi (Fabulous, Miraculous)", () => {
  for (const slug of ["miraculous", "fabulous"]) {
    test(`${slug} : étapes, précautions, mise en page mobile et ordinateur`, async ({ page }) => {
      const name = slug === "fabulous" ? "Fabulous" : "Miraculous";
      for (const vp of [
        { w: 375, h: 812, n: "375" },
        { w: 768, h: 1024, n: "768" },
        { w: 1280, h: 900, n: "1280" },
      ]) {
        await page.setViewportSize({ width: vp.w, height: vp.h });
        await page.goto(`/soins/${slug}`);
        const guide = page.locator(".mode-emploi");
        await guide.scrollIntoViewIfNeeded();
        await expect(guide.getByRole("heading", { name: "Étape 1" })).toBeVisible();
        await expect(guide.locator("strong")).toHaveText(`${name} Hair Serum`);
        await expect(guide.getByText(/utiliser le soin 3 fois par semaine/)).toBeVisible();
        await expect(guide.getByText("Nuit & jour")).toBeVisible();
        await expect(guide.locator(".mode-emploi__precautions li")).toHaveCount(3);
        // Illustrations décoratives chargées
        for (const img of await guide.locator("img").all()) {
          expect(await img.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0)).toBe(true);
          await expect(img).toHaveAttribute("alt", "");
        }
        const steps = await guide.locator(".mode-emploi__etape").evaluateAll((els) => els.map((e) => e.getBoundingClientRect()));
        if (vp.w >= 760) expect(Math.round(steps[0].top)).toBe(Math.round(steps[1].top)); // côte à côte
        else expect(steps[1].top).toBeGreaterThan(steps[0].bottom - 1); // l'une sous l'autre
        expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
        await guide.screenshot({ path: `captures/mode-emploi-${slug}-${vp.n}.png` });
      }
    });
  }
});
