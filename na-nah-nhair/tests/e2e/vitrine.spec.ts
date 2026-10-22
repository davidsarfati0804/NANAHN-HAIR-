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
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/^Miraculous\s+Hair Serum$/);
  await expect(page.getByText(/39,90\s€/).first()).toBeVisible();
  await expect(page.getByText("Mon produit fondateur", { exact: true })).toBeVisible();
  await expect(page.getByText("vanille patchouli")).toBeVisible();
  await expect(page.getByText(/CITRAL\*\*, COUMARIN\*\*, BENZYL BENZOATE\*\*/)).toBeVisible();
  // Mode d'emploi fourni (les précautions en font partie)
  await expect(page.getByText(/Appliquer Miraculous Hair Serum des racines vers les pointes/)).toBeVisible();
  await expect(page.getByText("Usage externe uniquement.")).toBeVisible();
  await expect(page.getByText(/À COMPLÉTER\s: (mode|précautions) d/)).toHaveCount(0);
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
  // Utilisation : un bloc par soin, étapes 1 et 2 (21/10/2026)
  await page.getByText("Comment utiliser les sérums ?").click();
  for (const name of ["Fabulous", "Miraculous", "Luxurious"]) {
    await expect(page.getByRole("heading", { level: 3, name, exact: true })).toBeVisible();
    await expect(page.getByText(new RegExp(`Utiliser ${name} Hair Serum des racines vers les pointes\\. Pour un soin complet\\s: 3 pipettes`))).toBeVisible();
  }
  await expect(page.getByText(/Laver les cheveux avec un shampoing classique\. Pour un résultat optimisé, utiliser le soin 3 fois par semaine\./)).toHaveCount(3);
  // Précautions : phrase + 3 puces, plus d'À COMPLÉTER
  await page.getByText("Y a-t-il des précautions d'emploi ?").click();
  await expect(page.getByText("Ces précautions sont identiques pour Fabulous, Miraculous et Luxurious.")).toBeVisible();
  for (const line of ["Ne pas utiliser le soin les 2 jours qui précèdent et suivent la coloration.", "Éviter tout contact avec les yeux.", "Usage externe uniquement."])
    await expect(page.getByRole("listitem").filter({ hasText: line })).toBeVisible();
  // Contact commande : email seul, lien mailto
  await page.getByText("Comment vous contacter au sujet d'une commande ?").click();
  await expect(page.getByRole("link", { name: "Contact@nanahnhair.com" }).last()).toHaveAttribute("href", "mailto:Contact@nanahnhair.com");
  await expect(page.locator("details").filter({ hasText: "Comment vous contacter" })).not.toContainText("téléphone");
  for (const q of ["Comment utiliser les sérums", "précautions"]) await expect(page.locator("details").filter({ hasText: q })).not.toContainText("À COMPLÉTER");
  await page.screenshot({ path: "captures/faq-21-10.png", fullPage: true });
});

test.describe("mode d'emploi (Fabulous, Miraculous, Luxurious)", () => {
  for (const slug of ["miraculous", "fabulous", "luxurious"]) {
    test(`${slug} : étapes, précautions, mise en page mobile et ordinateur`, async ({ page }) => {
      const name = slug.charAt(0).toUpperCase() + slug.slice(1);
      for (const vp of [
        { w: 375, h: 812, n: "375" },
        { w: 768, h: 1024, n: "768" },
        { w: 1280, h: 900, n: "1280" },
      ]) {
        await page.setViewportSize({ width: vp.w, height: vp.h });
        await page.goto(`/soins/${slug}`);
        // Sur téléphone, le mode d'emploi est replié : on l'ouvre
        if (vp.w < 768) await page.locator("summary", { hasText: "Mode d'emploi" }).click();
        const guide = page.locator(".mode-emploi");
        await guide.scrollIntoViewIfNeeded();
        await expect(guide.getByRole("heading", { name: "Étape 1" })).toBeVisible();
        await expect(guide.locator("strong")).toHaveText(`${name} Hair Serum`);
        await expect(guide.getByText(/utiliser le soin 3 fois par semaine/)).toBeVisible();
        await expect(guide.getByText("Nuit & jour")).toBeVisible();
        await expect(guide.locator(".mode-emploi__precautions li")).toHaveCount(3);
        // Icônes fournies, une par précaution, dans le dossier du soin
        const icons = await guide.locator(".mode-emploi__precautions img").evaluateAll((imgs) => imgs.map((i) => (i as HTMLImageElement).src));
        expect(new Set(icons).size).toBe(3);
        expect(icons.join(" ")).toMatch(/icone-coloration.*icone-yeux.*icone-externe/);
        if (slug !== "miraculous") expect(icons[0]).toContain(`mode-emploi-${slug}`);
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

test.describe("manifeste (fin de la page Mon histoire)", () => {
  for (const vp of [
    { w: 375, h: 812, n: "375" },
    { w: 768, h: 1024, n: "768" },
    { w: 1280, h: 900, n: "1280" },
  ]) {
    test(`citation encadrée et centrée, pastilles, bouton (${vp.n} px)`, async ({ page }) => {
      await page.setViewportSize({ width: vp.w, height: vp.h });
      await page.goto("/mon-histoire");
      const frame = page.locator(".manifeste__cadre");
      const quote = frame.locator(".manifeste__citation");
      await quote.scrollIntoViewIfNeeded();
      // Sans guillemets
      await expect(quote).toHaveText("Je ne suis pas qu’une seule femme.");
      // Centrée horizontalement et verticalement dans son cadre
      const f = (await frame.boundingBox())!;
      const q = (await quote.boundingBox())!;
      expect(Math.abs(q.x - f.x - (f.x + f.width - q.x - q.width))).toBeLessThanOrEqual(2);
      expect(Math.abs(q.y - f.y - (f.y + f.height - q.y - q.height))).toBeLessThanOrEqual(2);
      await expect(quote).toHaveCSS("text-align", "center");
      const chips = page.locator(".manifeste__soin");
      await expect(chips).toHaveText(["Je suis Fabulous.", "Je suis Miraculous.", "Je suis Luxurious."]);
      await expect(page.locator(".manifeste__trois")).toHaveText("Je suis les trois.");
      const boxes = await chips.evaluateAll((els) => els.map((e) => e.getBoundingClientRect()));
      if (vp.w <= 420) for (let i = 1; i < 3; i++) expect(boxes[i].top).toBeGreaterThan(boxes[i - 1].bottom - 1); // empilées
      const button = page.locator(".manifeste").getByRole("link", { name: "Découvrir les trois soins" });
      await expect(button).toHaveAttribute("href", "/soins");
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
      await page.locator(".manifeste").screenshot({ path: `captures/manifeste-${vp.n}.png` });
    });
  }
});

test.describe("rendu mobile (audit du 21/10/2026)", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("fiche : blocs repliés sur téléphone, barre d'achat fixe en bas", async ({ page }) => {
    await page.goto("/soins/fabulous");
    for (const title of ["Ingrédients (INCI)", "Mode d'emploi", "Questions fréquentes"])
      await expect(page.locator("details").filter({ has: page.locator("summary", { hasText: title }) })).not.toHaveAttribute("open");
    const bar = page.locator("div.fixed.bottom-0").filter({ hasText: "Fabulous" });
    await expect(bar).toHaveAttribute("aria-hidden", "true");
    await page.evaluate(() => window.scrollTo(0, 1400));
    await expect(bar).toHaveAttribute("aria-hidden", "false");
    await bar.getByRole("button", { name: "Ajouter au panier" }).click();
    await expect(page.getByTestId("cart-count")).toHaveText("(1)");
    await page.screenshot({ path: "captures/mobile-fiche-barre.png" });
  });

  test("ordinateur : blocs de la fiche ouverts, pas de barre fixe", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/soins/fabulous");
    await expect(page.locator("details").filter({ has: page.locator("summary", { hasText: "Mode d'emploi" }) })).toHaveAttribute("open", "");
    await expect(page.locator("div.fixed.bottom-0")).toBeHidden();
  });

  test("boutique en deux colonnes, accueil en carrousels, quiz dans un écran", async ({ page }) => {
    await page.goto("/boutique");
    const cards = page.locator("main ul > li");
    const [a, b] = [(await cards.nth(0).boundingBox())!, (await cards.nth(1).boundingBox())!];
    expect(Math.round(a.y)).toBe(Math.round(b.y));
    await page.goto("/");
    const trio = page.getByRole("list", { name: "Quel soin est le tien ?" });
    expect(await trio.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    await page.goto("/quiz");
    for (const radio of await page.getByRole("radio").all()) expect((await radio.boundingBox())!.y + 56).toBeLessThanOrEqual(667);
  });

  test("champ quantité en 16 px (pas de zoom automatique sur iPhone)", async ({ page }) => {
    await page.goto("/soins/miraculous");
    await expect(page.getByLabel("Quantité")).toHaveCSS("font-size", "16px");
  });
});
