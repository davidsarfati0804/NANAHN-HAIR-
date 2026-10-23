// Copie les textes juridiques (content/juridique/*.md, fournis le 23/10/2026) dans un module TypeScript
// lu par les pages. Lancé automatiquement avant chaque build (npm run prebuild).
import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const dir = "content/juridique";
const files = readdirSync(dir).filter((f) => f.endsWith(".md")).sort();
const entries = files.map((f) => `  ${JSON.stringify(f.replace(/\.md$/, ""))}: ${JSON.stringify(readFileSync(`${dir}/${f}`, "utf8"))},`);
writeFileSync(
  `${dir}/textes.generated.ts`,
  `// Fichier généré par scripts/juridique-vers-ts.mjs à partir de content/juridique/*.md : ne pas modifier à la main.\nexport const juridique: Record<string, string> = {\n${entries.join("\n")}\n};\n`,
);
console.log(`${files.length} textes juridiques`);
