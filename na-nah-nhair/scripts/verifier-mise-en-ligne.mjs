// Garde-fou avant la mise en production (modification 39) : refuse le build de production tant qu'une
// information « À COMPLÉTER » (ou une option / mention de projet) reste dans les pages légales,
// les emails ou le pied de page. Affiche la liste des endroits concernés.
// Usage : npm run verifier:mise-en-ligne (lancé automatiquement par Netlify en production, voir netlify.toml)
import { readdirSync, readFileSync } from "node:fs";

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

if (found.length) {
  console.error(`Mise en production bloquée : ${found.length} information(s) à compléter ou à valider.\n`);
  for (const f of found) console.error(`- ${f}`);
  process.exit(1);
}
console.log("Aucune information À COMPLÉTER dans les pages légales, les emails et le pied de page.");
