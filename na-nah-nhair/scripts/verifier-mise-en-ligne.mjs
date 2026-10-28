// Garde-fou avant la mise en production (modification 39, étendu le 28/10/2026) : refuse le build de
// production tant qu'une information « À COMPLÉTER » (ou une option / mention de projet) reste dans les pages
// légales, les emails, le pied de page, les fiches, la FAQ, les images story, ou si les PDF juridiques ne
// correspondent plus aux textes. Affiche la liste des endroits concernés.
// Usage : npm run verifier:mise-en-ligne (lancé automatiquement par Netlify en production, voir netlify.toml)
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";

const PATTERNS = [/À COMPLÉTER/, /\[OPTION/, /Projets? de texte/i, /à faire relire/i];
const found = [];
const scan = (file, label) => {
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, i) => {
      if (PATTERNS.some((p) => p.test(line))) found.push(`${label} — ${file}:${i + 1} : ${line.trim().slice(0, 140)}`);
    });
};

for (const f of readdirSync("content/juridique").filter((f) => f.endsWith(".md")).sort()) scan(`content/juridique/${f}`, "page légale");
for (const f of readdirSync("lib/emails").filter((f) => f.endsWith(".ts"))) scan(`lib/emails/${f}`, "email");

// Pied de page : coordonnées et liens lus dans content/site.ts
const site = readFileSync("content/site.ts", "utf8");
if (/instagram:\s*null/.test(site)) found.push("pied de page — content/site.ts : lien Instagram À COMPLÉTER");
const footerBlock = site.slice(site.indexOf("export const footer"), site.indexOf("});", site.indexOf("export const footer")));
if (/À COMPLÉTER/.test(footerBlock)) found.push("pied de page — content/site.ts : texte À COMPLÉTER dans le pied de page");

// PDF des CGV et du formulaire : imprimés depuis les textes actuels (npm run pdf:juridique)
const pdfStamp = existsSync("public/documents/sources.json") ? JSON.parse(readFileSync("public/documents/sources.json", "utf8")) : {};
for (const f of ["cgv-v1.md", "retractation.md"]) {
  const hash = createHash("sha256").update(readFileSync(`content/juridique/${f}`)).digest("hex").slice(0, 16);
  if (pdfStamp[f] !== hash) found.push(`PDF — public/documents : à régénérer après le changement de content/juridique/${f} (npm run pdf:juridique)`);
}

// Contenu des pages (fiches, FAQ, accueil, images story) : lu dans les données du site par Vitest
const pages = spawnSync("npx", ["vitest", "run", "--config", "vitest.mise-en-ligne.config.mts", "--reporter=dot"], { encoding: "utf8" });
if (pages.status !== 0) {
  const lines = `${pages.stdout}\n${pages.stderr}`.split("\n").filter((l) => /^\s*- /.test(l) && !/^\s*- Expected|^\s*- \[/.test(l));
  for (const l of new Set(lines)) found.push(`page publique — ${l.replace(/^\s*- /, "").trim()}`);
  if (!lines.length) found.push(`pages publiques — contrôle en échec :\n${pages.stdout}${pages.stderr}`);
}

if (found.length) {
  console.error(`Mise en production bloquée : ${found.length} information(s) à compléter ou à valider.\n`);
  for (const f of found) console.error(`- ${f}`);
  process.exit(1);
}
console.log("Aucune information À COMPLÉTER dans les pages légales, les emails et le pied de page.");
