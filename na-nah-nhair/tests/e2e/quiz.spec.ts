import { expect, type Page, test } from "@playwright/test";
import { quiz } from "../../content/site";

type P = "fabulous" | "miraculous" | "luxurious";

async function answer(page: Page, choices: P[], from = 0) {
  for (let i = from; i < choices.length; i++) {
    await expect(page.getByRole("progressbar", { name: "Progression du quiz" })).toHaveAttribute("aria-valuenow", String(i + 1));
    await expect(page.getByText(`Question ${i + 1} sur 5`)).toBeVisible();
    const text = quiz.questions[i].answers.find((a) => a.product === choices[i])!.text;
    await page.getByRole("radio", { name: text, exact: true }).click();
  }
}

const NAMES: Record<P, string> = { fabulous: "Fabulous", miraculous: "Miraculous", luxurious: "Luxurious" };

// Toutes les égalités possibles (INFOS §10) : Miraculous l'emporte s'il est à égalité ; Fabulous = Luxurious seuls → Luxurious
const scenarios: Array<{ name: string; choices: P[]; result: P }> = [
  { name: "5 réponses Fabulous", choices: ["fabulous", "fabulous", "fabulous", "fabulous", "fabulous"], result: "fabulous" },
  { name: "5 réponses Luxurious", choices: ["luxurious", "luxurious", "luxurious", "luxurious", "luxurious"], result: "luxurious" },
  { name: "5 réponses Miraculous", choices: ["miraculous", "miraculous", "miraculous", "miraculous", "miraculous"], result: "miraculous" },
  // F 2 / L 2 / M 1
  { name: "égalité Fabulous / Luxurious → Luxurious", choices: ["miraculous", "fabulous", "fabulous", "luxurious", "luxurious"], result: "luxurious" },
  // M 2 / F 2 / L 1
  { name: "égalité Fabulous / Miraculous → Miraculous", choices: ["miraculous", "miraculous", "fabulous", "fabulous", "luxurious"], result: "miraculous" },
  // M 2 / L 2 / F 1
  { name: "égalité Luxurious / Miraculous → Miraculous", choices: ["miraculous", "miraculous", "luxurious", "luxurious", "fabulous"], result: "miraculous" },
  // F 2 / L 2 / M 2
  { name: "égalité parfaite 2-2-2 → Miraculous", choices: ["fabulous", "fabulous", "luxurious", "luxurious", "miraculous"], result: "miraculous" },
];

for (const s of scenarios) {
  test(`quiz : ${s.name}`, async ({ page }) => {
    await page.goto("/quiz");
    await answer(page, s.choices);
    await expect(page).toHaveURL(new RegExp(`/quiz/resultat/${s.result}$`));
    const name = NAMES[s.result];
    await expect(page.getByText("Ton résultat", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(`Je suis ${name}.`);
    await expect(page.getByRole("link", { name: `Découvrir ${name}` })).toHaveAttribute("href", `/soins/${s.result}`);
    // Aucune photo de flacon sur le résultat
    await expect(page.locator("main img")).toHaveCount(0);
    await expect(page.getByText(/À COMPLÉTER : photo/)).toHaveCount(0);
    // Blocs obligatoires sur toutes les pages résultat
    await expect(page.getByRole("heading", { name: "Découvre aussi Miraculous, mon produit fondateur" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Voir Miraculous" })).toHaveAttribute("href", "/soins/miraculous");
    await expect(page.getByRole("link", { name: "Et si tu étais les trois ? Découvre toute la collection." })).toHaveAttribute("href", "/boutique");
    await expect(page.getByRole("link", { name: "Refaire le quiz" })).toHaveAttribute("href", "/quiz");
  });
}

test("quiz : une question par écran, pastille choisie en lavande, bouton Retour", async ({ page }) => {
  await page.goto("/quiz");
  await expect(page.getByRole("radio")).toHaveCount(3);
  await expect(page.getByRole("button", { name: "Retour" })).toHaveCount(0);
  const first = quiz.questions[0].answers.find((a) => a.product === "fabulous")!.text;
  await page.getByRole("radio", { name: first }).click();
  await expect(page.getByText("Question 2 sur 5")).toBeVisible();
  await expect(page.locator("main").getByRole("heading", { level: 2 })).toHaveText(quiz.questions[1].question.replaceAll(" ", " "));
  await page.getByRole("button", { name: "Retour" }).click();
  await expect(page.getByText("Question 1 sur 5")).toBeVisible();
  // La réponse précédente reste cochée, en lavande (couleur neutre)
  const chosen = page.getByRole("radio", { name: first });
  await expect(chosen).toHaveAttribute("aria-checked", "true");
  await expect(chosen).toHaveCSS("background-color", "rgb(170, 161, 200)");
  // Modifier la réponse
  await answer(page, ["luxurious", "luxurious", "luxurious", "luxurious", "luxurious"]);
  await expect(page).toHaveURL(/\/quiz\/resultat\/luxurious$/);
});

test("quiz : réponses au clavier (flèches + Entrée)", async ({ page }) => {
  await page.goto("/quiz");
  for (let i = 0; i < 5; i++) {
    await expect(page.getByText(`Question ${i + 1} sur 5`)).toBeVisible();
    const answers = quiz.questions[i].answers;
    const target = answers.findIndex((a) => a.product === "luxurious");
    await page.getByRole("radio").first().focus();
    for (let k = 0; k < target; k++) await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("radio", { name: answers[target].text, exact: true })).toBeFocused();
    await page.keyboard.press("Enter");
  }
  await expect(page).toHaveURL(/\/quiz\/resultat\/luxurious$/);
});

test.describe("mouvement réduit", () => {
  test.use({ reducedMotion: "reduce" });
  test("aucune animation de glissement ni d'apparition", async ({ page }) => {
    await page.goto("/quiz");
    await expect(page.locator(".quiz-slide-next").first()).toHaveCSS("animation-name", "none");
    await page.goto("/quiz/resultat/fabulous");
    await expect(page.getByRole("heading", { level: 1 })).toHaveCSS("animation-name", "none");
  });
});

test("partage en story : partage natif avec le fichier image", async ({ page }) => {
  await page.addInitScript(() => {
    const w = window as unknown as { shared: unknown[] };
    w.shared = [];
    Object.assign(navigator, {
      canShare: (d: { files?: File[] }) => Array.isArray(d.files),
      share: async (d: { files: File[]; title: string }) => {
        w.shared.push({ name: d.files[0].name, type: d.files[0].type, size: d.files[0].size, title: d.title });
      },
    });
  });
  await page.goto("/quiz/resultat/miraculous");
  await page.getByRole("button", { name: "Partager en story" }).click();
  await expect
    .poll(() => page.evaluate(() => (window as unknown as { shared: Array<{ name: string; type: string; size: number }> }).shared))
    .toEqual([expect.objectContaining({ name: "na-nah-nhair-miraculous.png", type: "image/png" })]);
});

test("partage en story : sur ordinateur, « Télécharger l'image »", async ({ page }) => {
  await page.goto("/quiz/resultat/fabulous");
  const link = page.getByRole("link", { name: "Télécharger l'image" });
  await expect(link).toHaveAttribute("href", "/story/fabulous.png");
  const download = page.waitForEvent("download");
  await link.click();
  expect((await download).suggestedFilename()).toBe("na-nah-nhair-fabulous.png");
});

test("images story : trois fichiers 1080 x 1920", async ({ request }) => {
  for (const r of ["fabulous", "miraculous", "luxurious"]) {
    const res = await request.get(`/story/${r}.png`);
    expect(res.status()).toBe(200);
    const buf = await res.body();
    // En-tête PNG : largeur et hauteur aux octets 16 à 23
    expect([buf.readUInt32BE(16), buf.readUInt32BE(20)]).toEqual([1080, 1920]);
  }
});

for (const vp of [
  { name: "375", width: 375, height: 812 },
  { name: "768", width: 768, height: 1024 },
  { name: "1280", width: 1280, height: 800 },
]) {
  test(`quiz et résultat sans défilement horizontal (${vp.name} px)`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    for (const path of ["/quiz", "/quiz/resultat/luxurious"]) {
      await page.goto(path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
      await page.screenshot({ path: `captures/quiz${path.replaceAll("/", "-")}-${vp.name}.png` });
    }
  });
}

test("résultat inconnu ou ancien résultat « pack » → 404", async ({ request }) => {
  expect((await request.get("/quiz/resultat/autre")).status()).toBe(404);
  expect((await request.get("/quiz/resultat/pack")).status()).toBe(404);
});
