// PDF des CGV et du formulaire de rétractation (modification 39) : pages /cgv et /retractation
// imprimées (sans en-tête ni pied de page) dans public/documents/. À relancer après chaque
// changement de texte : npm run pdf:juridique [adresse du site lancé, par défaut http://localhost:3100]
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:3100";
const version = "v1";
mkdirSync("public/documents", { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage();
await page.addInitScript(() => window.localStorage.setItem("nnh-consentement", "refuse"));
for (const [path, file] of [
  ["/cgv", `cgv-${version}.pdf`],
  ["/retractation", "formulaire-de-retractation.pdf"],
]) {
  await page.goto(base + path, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: `public/documents/${file}`, format: "A4", margin: { top: "18mm", bottom: "18mm", left: "16mm", right: "16mm" }, printBackground: true });
  console.log(`public/documents/${file}`);
}
await browser.close();
// Empreinte des textes imprimés : le contrôle de mise en ligne vérifie que les PDF sont à jour
writeFileSync("public/documents/sources.json", JSON.stringify(pdfSources(), null, 2) + "\n");

export function pdfSources() {
  const hash = (f) => createHash("sha256").update(readFileSync(f)).digest("hex").slice(0, 16);
  return { "cgv-v1.md": hash("content/juridique/cgv-v1.md"), "retractation.md": hash("content/juridique/retractation.md") };
}
