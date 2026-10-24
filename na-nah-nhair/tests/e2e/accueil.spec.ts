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

test("photos : flacons, pack et photos détourées fournis, plus aucun emplacement photo", async ({ page }) => {
  // Photos fournies (21/10/2026), textes alternatifs exacts (boutique)
  await page.goto("/boutique");
  for (const name of ["Fabulous", "Miraculous", "Luxurious"])
    await expect(page.locator(`main img[alt="Flacon ${name} Hair Serum, sérum capillaire de 30 ml"]`)).toBeVisible();
  await page.goto("/");
  await expect(page.locator('main img[alt^="Pack des 3 soins"]')).toBeVisible();
  // Premier écran : photos détourées (22/10/2026), textes alternatifs exacts
  for (const name of ["Fabulous", "Miraculous", "Luxurious"])
    await expect(page.getByRole("link", { name: `Flacon ${name} Hair Serum` }).locator("img").filter({ visible: true })).toHaveCount(1);
  // Plus aucun emplacement photo (la carte « Le bureau » n'a pas de photo)
  await expect(page.getByText(/À COMPLÉTER : photo/)).toHaveCount(0);
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

  test("en-tête : logo transparent (SVG) ; titre : logo SVG + h1 masqué", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('header img[src$="logo-na-nah-nhair.svg"]')).toHaveAttribute("alt", "Na Nah N’hair\u00a0! — retour à l'accueil");
    await expect(page.locator('main img[src$="logo-na-nah-nhair.svg"]')).toHaveAttribute("alt", "Na Nah N’hair\u00a0!");
    await expect(page.getByRole("heading", { level: 1 })).toHaveClass(/sr-only/);
  });

  test("cartes produits : « Je suis… », plus de Personnalité ni d'Univers", async ({ page }) => {
    for (const path of ["/", "/soins", "/soins/fabulous"]) {
      await page.goto(path);
      // Accueil et Les trois soins : la phrase s'affiche quand on touche le flacon (modification 34)
      if (path !== "/soins/fabulous") await page.locator("section[aria-labelledby=trio]").getByRole("button", { name: "Fabulous" }).click();
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
    await expect(page.getByText(/Pour stimuler la pousse, la repousse et ralentir la chute\./)).toBeVisible();
    await expect(page.getByText(/^Alterne les sérums selon tes besoins ou crée ta propre routine\s: Miraculous pour ta cure, Fabulous pour prendre soin de toi, Luxurious pour briller en sortie\. Pour un résultat optimisé, utilise le soin 3 fois par semaine\.$/)).toBeVisible();
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
    await expect(page.locator("section[aria-labelledby=histoire]").getByText("glisse pour la suite →")).toBeVisible();
    await page.locator("section[aria-labelledby=histoire]").getByRole("button", { name: "Afficher la carte 3" }).click();
    await expect(page.locator("section[aria-labelledby=histoire]").getByRole("button", { name: "Afficher la carte 3" })).toHaveAttribute("aria-current", "true");
    await page.screenshot({ path: "captures/modif-histoire-375.png" });

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    await list.scrollIntoViewIfNeeded();
    const tops = await list.locator(":scope > li").evaluateAll((lis) => lis.map((li) => li.getBoundingClientRect().top));
    expect(new Set(tops.map(Math.round)).size).toBe(1);
    await expect(page.locator("section[aria-labelledby=histoire]").getByText("glisse pour la suite →")).toBeHidden();
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

test.describe("modifications du 21/10/2026", () => {
  for (const vp of [
    { name: "375x667", width: 375, height: 667 },
    { name: "390x844", width: 390, height: 844 },
  ]) {
    test(`premier écran ${vp.name} : bandeau, en-tête, titre, accroche, trois flacons et bouton principal sans défiler`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/");
      // Fin de l'animation d'arrivée des flacons (0,5 s chacun)
      await page.waitForTimeout(1700);
      const inView = async (locator: ReturnType<typeof page.locator>) => {
        const box = (await locator.boundingBox())!;
        expect(box.y, await locator.evaluate((e) => e.outerHTML.slice(0, 60))).toBeGreaterThanOrEqual(0);
        expect(box.y + box.height).toBeLessThanOrEqual(vp.height);
        return box;
      };
      await inView(page.getByRole("link", { name: /^Quel Na Nah N’hair es-tu\s\?$/ }).first());
      await inView(page.locator("header").first());
      const title = await inView(page.locator('main img[src$="logo-na-nah-nhair.svg"]'));
      // Titre : au plus un quart de la hauteur de l'écran
      expect(title.height).toBeLessThanOrEqual(vp.height / 4);
      await inView(page.locator("main p", { hasText: "Révèle ton" }).first());
      await inView(page.getByText(/^Trois soins\. Trois personnalités\./));
      for (const name of ["Fabulous", "Miraculous", "Luxurious"]) {
        const bottle = page.locator(`main a[href="/soins/${name.toLowerCase()}"]`).filter({ has: page.locator(`img[alt="Flacon ${name} Hair Serum"]`) }).filter({ visible: true });
        await inView(bottle);
      }
      await inView(page.getByRole("link", { name: "Je découvre mon Na Nah N’hair" }));
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
      await page.screenshot({ path: `captures/premier-ecran-${vp.name}.png` });
    });
  }

  test("premier écran : petits textes, sans sticker, lien vers la section suivante", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("5 questions · 1 résultat")).toBeVisible();
    // Sticker retiré (modification 28) ; la carte « Créés par une naturopathe » de « Pourquoi découvrir » reste
    await expect(page.getByText("Créés par une naturopathe")).toHaveCount(1);
    await expect(page.locator("section[aria-labelledby=raisons]").getByText("Créés par une naturopathe")).toBeVisible();
    // Livraison offerte active par défaut dans le back-office
    await expect(page.getByText("Made in France · 30 ml · Livraison offerte en France")).toBeVisible();
    await page.getByRole("link", { name: /Découvre les trois soins/ }).click();
    await expect(page).toHaveURL(/#trio$/);
  });

  test("section des trois soins : petit titre, accroche, titre (accueil et Les trois soins)", async ({ page }) => {
    for (const path of ["/", "/soins"]) {
      await page.goto(path);
      const h2 = page.getByRole("heading", { level: 2, name: "Quel soin est le tien ?" });
      await expect(h2).toBeVisible();
      await expect(page.getByText("Trois soins, trois personnalités", { exact: true })).toBeVisible();
      await expect(page.getByText("À chaque personnalité, son soin.", { exact: true })).toBeVisible();
      await expect(page.locator("main")).not.toContainText("Lequel est le tien ?");
    }
  });

  test("citation sans guillemets, espaces égaux au-dessus et en dessous", async ({ page }) => {
    for (const vp of [375, 390, 768, 1280]) {
      await page.setViewportSize({ width: vp, height: 900 });
      await page.goto("/");
      const h2 = page.getByRole("heading", { level: 2, name: "Je ne suis pas qu’une seule femme." });
      await expect(h2).toHaveText("Je ne suis pas qu’une seule femme.");
      const frame = (await h2.locator("..").boundingBox())!;
      const title = (await h2.boundingBox())!;
      const chips = (await h2.locator("xpath=following-sibling::ul").boundingBox())!;
      expect(Math.abs(title.y - frame.y - (frame.y + frame.height - chips.y - chips.height)), `${vp}`).toBeLessThanOrEqual(2);
      // Cadre centré dans la page
      expect(Math.abs(frame.x - (vp - frame.x - frame.width)), `${vp}`).toBeLessThanOrEqual(1);
    }
  });

  test("logo de l'en-tête : encadré crème arrondi, logo centré, ≤ 64 px sur mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    const link = page.locator("header a").first();
    await expect(link).toHaveAttribute("href", "/");
    await expect(link).toHaveCSS("background-color", "rgb(241, 225, 176)");
    const box = (await link.boundingBox())!;
    const img = (await link.locator("img").boundingBox())!;
    expect(box.height).toBeLessThanOrEqual(64);
    expect(Math.abs(img.x - box.x - (box.x + box.width - img.x - img.width))).toBeLessThanOrEqual(1);
    expect(Math.abs(img.y - box.y - (box.y + box.height - img.y - img.height))).toBeLessThanOrEqual(1);
    const menu = (await page.getByRole("button", { name: "Menu" }).boundingBox())!;
    expect(Math.abs(box.y + box.height / 2 - (menu.y + menu.height / 2))).toBeLessThanOrEqual(2);
  });

  test("nom Fabulous ton sur ton, sans bande blanche", async ({ page }) => {
    await page.goto("/soins/fabulous");
    const name = page.getByRole("heading", { level: 1 });
    await expect(name).toHaveCSS("color", "rgb(29, 90, 60)");
    await expect(name).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  });

  test("« vitamine » au singulier sur toutes les pages", async ({ page }) => {
    for (const path of ["/", "/soins", "/soins/fabulous", "/soins/miraculous", "/soins/luxurious", "/pack", "/boutique", "/faq"]) {
      await page.goto(path);
      expect(await page.content(), path).not.toMatch(/vitamines/i);
    }
    await page.goto("/soins/miraculous");
    await expect(page.getByText(/^Formulé à base d’huiles végétales riches en vitamine\sB, il agit comme un véritable boost/)).toBeVisible();
  });

  test("contenu du pack : nouvelle ligne Miraculous (accueil, Les trois soins, pack)", async ({ page }) => {
    for (const path of ["/", "/soins", "/pack"]) {
      await page.goto(path);
      await expect(page.locator("main li").filter({ hasText: /Miraculous Hair Serum\s:\sPour stimuler la pousse, la repousse et ralentir la chute\./ }).first()).toBeVisible();
    }
  });
});

test.describe("modifications du 22/10/2026", () => {
  test("flacons détourés : relief au survol, lien vers la fiche", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    await page.waitForTimeout(1700);
    const img = page.getByRole("link", { name: "Flacon Miraculous Hair Serum" }).locator("img").filter({ visible: true });
    await expect(img).toHaveCSS("filter", "none");
    await img.hover();
    await expect(img).toHaveCSS("scale", "1.08");
    // Aucune ombre sur l'image du flacon (modification 42)
    await expect(img).toHaveCSS("filter", "none");
    await img.click();
    await expect(page).toHaveURL(/\/soins\/miraculous$/);
  });

  test("« HAIR SERUM » sous le grand nom (cartes, boutique, fiches)", async ({ page }) => {
    await page.goto("/boutique");
    await expect(page.getByText(/^Hair Serum · 30\sml$/)).toHaveCount(3);
    await page.goto("/soins/fabulous");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/^Fabulous\s+Hair Serum$/);
    await expect(page).toHaveTitle(/Fabulous Hair Serum|FABULOUS HAIR SERUM/);
  });

  test("Mon histoire : nouveaux textes, nom de marque dans le bloc final", async ({ page }) => {
    await page.goto("/mon-histoire");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Tout a commencé sur mon bureau.");
    await expect(page.getByText(/Sans artifice, sans filtre\.$/)).toBeVisible();
    await expect(page.locator("blockquote svg[data-brand-name]")).toHaveCSS("color", "rgb(128, 118, 179)");
    await expect(page.locator("main")).not.toContainText(/clinique/i);
    await page.goto("/");
    await expect(page.locator("section[aria-labelledby=histoire]")).not.toContainText(/clinique/i);
  });
});

test.describe("modifications du 24/10/2026", () => {
  test("premier écran : plus de ronds de couleur, ombre douce sous chaque flacon", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator("main section").first();
    // Le fond dégradé (formes floues blur-3xl) reste ; les ronds derrière les flacons sont supprimés
    await expect(hero.locator("ul .rounded-full")).toHaveCount(0);
    for (const name of ["Fabulous", "Miraculous", "Luxurious"]) {
      const link = page.getByRole("link", { name: `Flacon ${name} Hair Serum` }).filter({ visible: true });
      await expect(link.locator("span[aria-hidden].blur-\\[8px\\]")).toHaveCount(1);
    }
  });

  for (const w of [375, 390, 768, 1280]) {
    test(`cartes alignées sur des lignes communes (${w} px)`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: 900 });
      await page.goto("/");
      // « Les trois soins » : odeur, contenance et lien prix à la même hauteur dans les trois cartes
      const cards = page.getByRole("list", { name: "Les trois soins" }).locator(":scope > li");
      const tops = async (sel: string) => cards.evaluateAll((lis, s) => lis.map((li) => Math.round(li.querySelector(s)!.getBoundingClientRect().top - li.getBoundingClientRect().top)), sel);
      for (const sel of ["dl div:nth-child(1)", "dl div:nth-child(2)", "a"]) expect(new Set(await tops(sel)).size, sel).toBe(1);
      const heights = await cards.evaluateAll((lis) => lis.map((li) => Math.round(li.getBoundingClientRect().height)));
      expect(new Set(heights).size).toBe(1);
      // « De mon bureau à ta routine » : pastilles juste sous le texte de la carte 3
      const story = page.getByRole("list", { name: "Mon histoire en trois cartes" }).locator(":scope > li");
      const gap = await story.nth(2).evaluate((li) => {
        const p = li.querySelector("p")!.getBoundingClientRect();
        const dots = li.querySelector("ul")!.getBoundingClientRect();
        return dots.top - p.bottom;
      });
      expect(gap).toBeLessThanOrEqual(30);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    });
  }

  test("fiches produits aux couleurs du soin (aucun bloc violet)", async ({ page }) => {
    for (const [slug, bg] of [["fabulous", "rgb(178, 220, 203)"], ["miraculous", "rgb(185, 165, 226)"], ["luxurious", "rgb(235, 196, 222)"]]) {
      await page.goto(`/soins/${slug}`);
      const description = page.locator("section").filter({ has: page.getByRole("heading", { name: "Description" }) });
      await expect(description).toHaveCSS("background-color", bg);
      await expect(page.locator("details").first()).toHaveCSS("background-color", bg);
    }
    await page.goto("/soins/luxurious");
    await expect(page.getByText(/^Son parfum de fleur d’oranger transforme ta routine capillaire/)).toBeVisible();
  });

  test("Instagram : lien sur la page Contact et dans le pied de page", async ({ page }) => {
    await page.goto("/contact");
    const link = page.locator("main").getByRole("link", { name: "Instagram de Na Nah N’hair (s'ouvre dans un nouvel onglet)" });
    await expect(link).toHaveAttribute("href", "https://www.instagram.com/na.nah.nhair/");
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    await expect(link).toHaveText("@na.nah.nhair");
    await expect(page.locator("footer").getByRole("link", { name: /Instagram de Na Nah/ })).toHaveAttribute("href", "https://www.instagram.com/na.nah.nhair/");
    await expect(page.getByText("À COMPLÉTER : lien Instagram")).toHaveCount(0);
  });
});
