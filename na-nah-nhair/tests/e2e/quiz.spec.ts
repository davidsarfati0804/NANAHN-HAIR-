import { expect, type Page, test } from "@playwright/test";
import { quiz } from "../../content/site";
import { clearCart } from "./helpers";

type P = "fabulous" | "miraculous" | "luxurious";

async function answer(page: Page, choices: P[]) {
  for (let i = 0; i < choices.length; i++) {
    await expect(page.getByText(`Question ${i + 1} sur 5`)).toBeVisible();
    const text = quiz.questions[i].answers.find((a) => a.product === choices[i])!.text;
    await page.getByRole("button", { name: text, exact: true }).click();
  }
}

const scenarios: Array<{ name: string; choices: P[]; result: string; title: RegExp }> = [
  { name: "5 réponses Fabulous", choices: ["fabulous", "fabulous", "fabulous", "fabulous", "fabulous"], result: "fabulous", title: /^Fabulous$/ },
  { name: "5 réponses Luxurious", choices: ["luxurious", "luxurious", "luxurious", "luxurious", "luxurious"], result: "luxurious", title: /^Luxurious$/ },
  { name: "5 réponses Miraculous", choices: ["miraculous", "miraculous", "miraculous", "miraculous", "miraculous"], result: "miraculous", title: /^Miraculous$/ },
  // F 2 / L 2 / M 1
  { name: "égalité Fabulous / Luxurious → pack", choices: ["miraculous", "fabulous", "fabulous", "luxurious", "luxurious"], result: "pack", title: /Fabulous et Luxurious à égalité/ },
  // M 2 / F 2 / L 1
  { name: "égalité Fabulous / Miraculous → Miraculous", choices: ["miraculous", "miraculous", "fabulous", "fabulous", "luxurious"], result: "miraculous", title: /^Miraculous$/ },
  // M 2 / L 2 / F 1
  { name: "égalité Luxurious / Miraculous → Miraculous", choices: ["miraculous", "miraculous", "luxurious", "luxurious", "fabulous"], result: "miraculous", title: /^Miraculous$/ },
  // F 2 / L 2 / M 2
  { name: "égalité parfaite 2-2-2 → Miraculous", choices: ["fabulous", "fabulous", "luxurious", "luxurious", "miraculous"], result: "miraculous", title: /^Miraculous$/ },
];

for (const s of scenarios) {
  test(`quiz : ${s.name}`, async ({ page }) => {
    await page.goto("/quiz");
    await answer(page, s.choices);
    await expect(page).toHaveURL(new RegExp(`/quiz/resultat/${s.result}$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(s.title);
    // Blocs obligatoires sur toutes les pages résultat
    await expect(page.getByRole("heading", { name: "Découvre aussi Miraculous, mon produit fondateur" })).toBeVisible();
    await expect(page.getByText("Et si tu étais les trois ? Découvre toute la collection.")).toBeVisible();
    await expect(page.getByRole("link", { name: "Voir Miraculous" })).toHaveAttribute("href", "/soins/miraculous");
    await expect(page.getByRole("button", { name: /Ajouter au panier/ })).toBeEnabled();
  });
}

test("quiz : bouton question précédente et ajout au panier depuis le résultat", async ({ page }) => {
  await clearCart(page);
  await page.goto("/quiz");
  await page.getByRole("button", { name: quiz.questions[0].answers[0].text }).click();
  await expect(page.getByText("Question 2 sur 5")).toBeVisible();
  await page.getByRole("button", { name: "Question précédente" }).click();
  await expect(page.getByText("Question 1 sur 5")).toBeVisible();
  await answer(page, ["fabulous", "fabulous", "fabulous", "fabulous", "fabulous"]);
  await page.getByRole("button", { name: /Ajouter au panier/ }).click();
  await expect(page.getByTestId("cart-count")).toHaveText("(1)");
  await page.getByRole("link", { name: "Refaire le quiz" }).click();
  await expect(page).toHaveURL(/\/quiz$/);
});

test("quiz : réponses au clavier", async ({ page }) => {
  await page.goto("/quiz");
  for (let i = 0; i < 5; i++) {
    await expect(page.getByText(`Question ${i + 1} sur 5`)).toBeVisible();
    const text = quiz.questions[i].answers.find((a) => a.product === "luxurious")!.text;
    await page.getByRole("button", { name: text, exact: true }).focus();
    await page.keyboard.press("Enter");
  }
  await expect(page).toHaveURL(/\/quiz\/resultat\/luxurious$/);
});

test("résultat inconnu → 404", async ({ request }) => {
  expect((await request.get("/quiz/resultat/autre")).status()).toBe(404);
});
