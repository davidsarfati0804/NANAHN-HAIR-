// Génère les trois images story 1080 x 1920 (modification 20) à partir de la page cachée
// /guide-de-style/story/<résultat>. Usage : node scripts/generer-stories.mjs [adresse du site lancé]
// Écrit assets/story/<résultat>.png et sa copie publique public/story/<résultat>.png.
import { mkdirSync, copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:3100";
const results = ["fabulous", "miraculous", "luxurious"];
mkdirSync("assets/story", { recursive: true });
mkdirSync("public/story", { recursive: true });

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 1200, height: 2000 }, deviceScaleFactor: 1 });
// Bandeau cookies masqué (choix déjà fait) pour qu'il ne recouvre pas l'image
await page.addInitScript(() => window.localStorage.setItem("nnh-consentement", "refuse"));
for (const r of results) {
  await page.goto(`${base}/guide-de-style/story/${r}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const out = `assets/story/${r}.png`;
  const box = (await page.locator("#story").boundingBox());
  await page.screenshot({ path: out, fullPage: true, clip: { x: Math.round(box.x), y: Math.round(box.y), width: 1080, height: 1920 } });
  copyFileSync(out, `public/story/${r}.png`);
  console.log(out);
}
await browser.close();
// Adresse imprimée sur les images : le contrôle de mise en ligne vérifie qu'elle est renseignée et à jour
const address = readFileSync("content/site.ts", "utf8").match(/siteAddress: "([^"]+)"/)?.[1] ?? null;
writeFileSync("public/story/source.json", JSON.stringify({ siteAddress: address }, null, 2) + "\n");
