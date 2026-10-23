import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { BrandText } from "@/components/BrandName";
import { frText } from "@/lib/typography";

// Typographie française + nom de marque dans la police du logo
const frenchTypography = (s: string) => <BrandText text={frText(s)} />;

// Affiche un texte juridique fourni en Markdown (content/juridique/*.md), mot pour mot.
// Prend en charge : titres #/##, paragraphes, listes, tableaux, **gras**, *italique*, [liens](/page).
// Les mentions « [À COMPLÉTER : …] » et « [OPTION, …] » restent visibles et sont surlignées.

export function slugifyHeading(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Titres de niveau 2 (pour le sommaire des CGV)
export function headings(md: string) {
  return md
    .split("\n")
    .filter((l) => l.startsWith("## "))
    .map((l) => l.slice(3).trim());
}

function inline(text: string, key = ""): ReactNode[] {
  const out: ReactNode[] = [];
  // Ordre : mention à compléter / option (crochets sans lien), lien, gras, italique
  const re = /(\[(?:À COMPLÉTER|OPTION)[^\]]*\](?!\())|(\[[^\]]+\]\([^)]+\))|(\*\*[^*]+\*\*)|(\*[^*]+\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(<Fragment key={`${key}t${i++}`}>{frenchTypography(text.slice(last, m.index))}</Fragment>);
    const [token] = m;
    if (m[1]) {
      out.push(
        <mark key={`${key}c${i++}`} className="rounded-md border border-dashed border-deep-violet bg-logo-yellow px-1 text-deep-violet">
          {frenchTypography(token)}
        </mark>,
      );
    } else if (m[2]) {
      const [, label, href] = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/)!;
      out.push(
        <Link key={`${key}l${i++}`} href={href} className="font-bold underline underline-offset-4">
          {frenchTypography(label)}
        </Link>,
      );
    } else if (m[3]) {
      out.push(<strong key={`${key}b${i++}`}>{inline(token.slice(2, -2), `${key}b${i}`)}</strong>);
    } else {
      out.push(<em key={`${key}i${i++}`}>{inline(token.slice(1, -1), `${key}i${i}`)}</em>);
    }
    last = m.index + token.length;
  }
  if (last < text.length) out.push(<Fragment key={`${key}t${i++}`}>{frenchTypography(text.slice(last))}</Fragment>);
  return out;
}

type Block =
  | { type: "h1" | "h2" | "p"; text: string }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][] };

function parse(md: string): Block[] {
  const blocks: Block[] = [];
  const lines = md.replace(/\r/g, "").split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trimEnd();
    if (!line.trim()) continue;
    if (line.startsWith("# ")) blocks.push({ type: "h1", text: line.slice(2) });
    else if (line.startsWith("## ")) blocks.push({ type: "h2", text: line.slice(3) });
    else if (/^- /.test(line) || /^\d+\. /.test(line)) {
      const ordered = /^\d+\. /.test(line);
      const items: string[] = [];
      while (i < lines.length && (ordered ? /^\d+\. /.test(lines[i]) : /^- /.test(lines[i]))) {
        items.push(lines[i].replace(ordered ? /^\d+\. / : /^- /, "").trim());
        i++;
      }
      i--;
      blocks.push({ type: ordered ? "ol" : "ul", items });
    } else if (line.startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        const cells = lines[i].split("|").slice(1, -1).map((c) => c.trim());
        if (!cells.every((c) => /^-+$/.test(c))) rows.push(cells);
        i++;
      }
      i--;
      blocks.push({ type: "table", head: rows[0], rows: rows.slice(1) });
    } else blocks.push({ type: "p", text: line });
  }
  return blocks;
}

export default function LegalMarkdown({ md, toc = false }: { md: string; toc?: boolean }) {
  const blocks = parse(md);
  const h2 = headings(md).filter((h) => h !== "Sommaire");
  return (
    <div className="texte-juridique">
      {blocks.map((b, n) => {
        switch (b.type) {
          case "h1":
            return (
              <h1 key={n} className="titre-h1">
                {frenchTypography(b.text)}
              </h1>
            );
          case "h2":
            return (
              <h2 key={n} id={slugifyHeading(b.text)} className="mt-10 scroll-mt-24 titre-h3">
                {frenchTypography(b.text)}
              </h2>
            );
          case "p":
            return (
              <p key={n} className="mt-3">
                {inline(b.text, `p${n}`)}
              </p>
            );
          case "ul":
            return (
              <ul key={n} className="mt-3 list-disc space-y-1 pl-6">
                {b.items.map((it, j) => (
                  <li key={j}>{inline(it, `u${n}-${j}`)}</li>
                ))}
              </ul>
            );
          case "ol":
            // Sommaire des CGV : chaque article mène à son ancre
            return (
              <ol key={n} className="mt-3 list-decimal space-y-1 pl-6">
                {b.items.map((it, j) => {
                  const target = toc ? h2.find((h) => h.replace(/^\d+\.\s*/, "") === it) : undefined;
                  return (
                    <li key={j}>
                      {target ? (
                        <a href={`#${slugifyHeading(target)}`} className="inline-block py-1 underline underline-offset-4">
                          {frenchTypography(it)}
                        </a>
                      ) : (
                        inline(it, `o${n}-${j}`)
                      )}
                    </li>
                  );
                })}
              </ol>
            );
          case "table":
            return (
              <div key={n} className="mt-4 overflow-x-auto rounded-2xl border-2 border-lavender">
                <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                  <thead className="bg-lavender-soft">
                    <tr>
                      {b.head.map((c, j) => (
                        <th key={j} scope="col" className="p-3 font-bold">
                          {inline(c, `h${n}-${j}`)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, j) => (
                      <tr key={j} className="border-t border-lavender align-top">
                        {r.map((c, k) => (
                          <td key={k} className="p-3">
                            {inline(c, `r${n}-${j}-${k}`)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      })}
    </div>
  );
}
