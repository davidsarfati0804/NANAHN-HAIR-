// Facture de test (modification 53) : captures/facture-test.html → captures/facture-test.pdf (+ PNG).
// Préparer le HTML : FACTURE_TEST=1 npx vitest run tests/unit/facture.test.ts ; puis : node scripts/generer-facture-test.mjs
import { readFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const html = readFileSync("captures/facture-test.html", "utf8");
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 800, height: 1000 } });
await page.setContent(html);
await page.pdf({ path: "captures/facture-test.pdf", format: "A4", margin: { top: "16mm", bottom: "16mm", left: "14mm", right: "14mm" } });
await page.screenshot({ path: "captures/facture-test.png", fullPage: true });
await browser.close();
console.log("captures/facture-test.pdf");
