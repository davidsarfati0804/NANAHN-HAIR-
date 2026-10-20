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
    await expect(page.locator("main p", { hasText: "Révèle ton" }).first()).toBeVisible();
    // Pas de défilement horizontal
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    await page.screenshot({ path: `captures/accueil-${vp.name}.png`, fullPage: true });
  });
}

test("le bandeau mène au quiz", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /^Quel Na Nah N’hair es-tu\s\?$/ }).first().click();
  await expect(page).toHaveURL(/\/quiz$/);
});

test("boutons du hero", async ({ page }) => {
  await page.goto("/");
  const cta = page.getByRole("link", { name: "Je découvre mon Na Nah N’hair" });
  await expect(cta).toHaveAttribute("href", "/quiz");
  // Espace visible entre « mon » et le nom de marque
  const gap = await cta.evaluate((a) => {
    const svg = a.querySelector("svg")!.getBoundingClientRect();
    const range = document.createRange();
    const text = a.querySelector("span")!.firstChild!;
    // Texte sans l'espace final : l'écart mesuré correspond à l'espace
    range.setStart(text, 0);
    range.setEnd(text, (text.textContent ?? "").trimEnd().length);
    const words = range.getClientRects();
    return svg.left - words[words.length - 1].right;
  });
  expect(gap).toBeGreaterThan(2);
  await expect(page.getByRole("link", { name: "Découvrir les trois soins" }).first()).toHaveAttribute("href", "/soins");
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
  // 3 flacons, le pack et la photo « Le bureau » (section Mon histoire)
  await expect(page.getByText("À COMPLÉTER : photo")).toHaveCount(5);
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
      const bar = page.getByRole("link", { name: /^Quel Na Nah N’hair es-tu\s\?$/ });
      await expect(bar).toHaveAttribute("href", "/quiz");
      // Bandeau : texte entier visible (ni coupé ni masqué)
      const fits = await bar.evaluate((el) => el.scrollWidth <= el.clientWidth && el.getBoundingClientRect().left >= 0);
      expect(fits).toBe(true);
      const style = await bar.evaluate((el) => {
        const s = getComputedStyle(el);
        return { bg: s.backgroundColor, color: s.color, transform: s.textTransform };
      });
      // Fond crème du logo, texte violet foncé ; nom de marque dans la police et le violet du logo
      expect(style).toEqual({ bg: "rgb(241, 225, 176)", color: "rgb(52, 43, 100)", transform: "none" });
      await expect(bar.locator("svg[data-brand-name]")).toHaveCSS("color", "rgb(128, 118, 179)");
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
    await expect(page.locator("main p", { hasText: "Révèle ton" }).locator("svg[data-brand-name]")).toHaveAttribute("aria-label", "Na Nah N’hair");
    await expect(page.getByText(/^Trois soins\. Trois personnalités\. Une seule question\s: lequel est le tien\s\?$/)).toBeVisible();
    const html = await page.content();
    for (const banned of ["chichis", "NNH26", "NNH27", "faire pousser", "envoûtantes"]) expect(html).not.toContain(banned);
  });
});

test.describe("modifications du 20/10/2026", () => {
  const vps = [
    { name: "375", width: 375, height: 812 },
    { name: "768", width: 768, height: 1024 },
    { name: "1280", width: 1280, height: 900 },
  ];

  test("en-tête : logo fourni tel quel ; titre : logo SVG + h1 masqué", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('header img[src*="logo-na-nah-nhair.jpg"]')).toBeVisible();
    await expect(page.locator('main img[src$="logo-na-nah-nhair.svg"]')).toHaveAttribute("alt", "Na Nah N’hair\u00a0!");
    await expect(page.getByRole("heading", { level: 1 })).toHaveClass(/sr-only/);
  });

  test("cartes produits : « Je suis… », plus de Personnalité ni d'Univers", async ({ page }) => {
    for (const path of ["/", "/soins", "/soins/fabulous"]) {
      await page.goto(path);
      await expect(page.getByText("Je suis fraîche, naturelle et spontanée.").first()).toBeVisible();
      await expect(page.locator("main")).not.toContainText(/Personnalité\s?:|Univers\s?:/);
    }
  });

  test("citation centrée, consigne retirée", async ({ page }) => {
    for (const vp of vps) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/");
      const h2 = page.getByRole("heading", { name: /Je ne suis pas qu’une seule femme/ });
      const box = (await h2.boundingBox())!;
      const parent = (await h2.locator("..").boundingBox())!;
      const left = box.x - parent.x;
      const right = parent.x + parent.width - (box.x + box.width);
      expect(Math.abs(left - right), vp.name).toBeLessThanOrEqual(2);
      expect(left, vp.name).toBeGreaterThanOrEqual(16);
      await expect(h2).toHaveCSS("text-align", "center");
      await expect(page.locator("main")).not.toContainText("catégories exclusives");
      await h2.scrollIntoViewIfNeeded();
      await page.screenshot({ path: `captures/modif-citation-${vp.name}.png` });
    }
  });

  test("odeurs avec majuscule, pack et délai", async ({ page }) => {
    await page.goto("/soins/luxurious");
    await expect(page.getByText("Fleur d’oranger", { exact: true })).toBeVisible();
    await page.goto("/pack");
    await expect(page.getByText(/Pour stimuler la pousse et la repousse du cheveu et ralentir la chute\./)).toBeVisible();
    await expect(page.getByText(/^Alterne les sérums selon tes besoins ou crée ta propre routine\s: Miraculous en cure, Fabulous au quotidien et Luxurious pour briller en sortie\.$/)).toBeVisible();
    await expect(page.getByRole("heading", { name: "Mode d’emploi du pack" })).toBeVisible();
    await page.goto("/");
    await expect(page.getByText(/^Délai\s: 3 jours ouvrés, préparation incluse\.$/)).toBeVisible();
    await expect(page.locator("main")).not.toContainText("préparation incluse ou non");
  });

  test("bouton « Quel soin est le tien ? » sous « Ajouter au panier »", async ({ page }) => {
    for (const path of ["/soins/fabulous", "/soins/miraculous", "/soins/luxurious", "/pack"]) {
      await page.goto(path);
      const quiz = page.getByRole("link", { name: "Quel soin est le tien ?" });
      await expect(quiz).toHaveAttribute("href", "/quiz");
      const add = (await page.getByRole("button", { name: /Ajouter au panier/ }).boundingBox())!;
      expect((await quiz.boundingBox())!.y).toBeGreaterThan(add.y);
    }
    await page.getByRole("link", { name: "Quel soin est le tien ?" }).click();
    await expect(page).toHaveURL(/\/quiz$/);
  });

  test("Mon histoire : trois cartes, défilement sur mobile, côte à côte sur ordinateur", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    const list = page.getByRole("list", { name: "Mon histoire en trois cartes" });
    await list.scrollIntoViewIfNeeded();
    await expect(list.locator(":scope > li")).toHaveCount(3);
    expect(await list.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    await expect(page.getByText("glisse pour la suite →")).toBeVisible();
    await page.getByRole("button", { name: "Afficher la carte 3" }).click();
    await expect(page.getByRole("button", { name: "Afficher la carte 3" })).toHaveAttribute("aria-current", "true");
    await expect(page.getByText("À COMPLÉTER : photo").last()).toBeAttached();
    await page.screenshot({ path: "captures/modif-histoire-375.png" });

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    await list.scrollIntoViewIfNeeded();
    const tops = await list.locator(":scope > li").evaluateAll((lis) => lis.map((li) => li.getBoundingClientRect().top));
    expect(new Set(tops.map(Math.round)).size).toBe(1);
    await expect(page.getByText("glisse pour la suite →")).toBeHidden();
    await page.getByRole("link", { name: "Lire toute mon histoire" }).scrollIntoViewIfNeeded();
    await page.screenshot({ path: "captures/modif-histoire-1280.png" });
  });

  test("nom de marque : composant partout, aucune écriture en capitales restante", async ({ page }) => {
    for (const path of ["/", "/quiz", "/mon-histoire", "/contact", "/confidentialite", "/mentions-legales", "/soins/fabulous", "/pack"]) {
      await page.goto(path);
      const text = await page.locator("body").evaluate((b) => {
        const clone = b.cloneNode(true) as HTMLElement;
        // h1 masqué (référencement) exclu : seul le texte visible compte
        clone.querySelectorAll("svg, script, style, .sr-only").forEach((n) => n.remove());
        return clone.innerText;
      });
      expect(text, path).not.toMatch(/na nah n['’]hair/i);
      expect(await page.locator("svg[data-brand-name]").count(), path).toBeGreaterThan(0);
    }
  });
});
