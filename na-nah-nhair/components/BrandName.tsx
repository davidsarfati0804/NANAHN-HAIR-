import { Fragment } from "react";
import { brand } from "@/content/site";
import { brandGlyphs } from "@/lib/brand-glyphs";

// Couleur du nom selon le fond (modification 7) :
// - "logo"  : violet du logo, uniquement sur fond blanc ou crème ET en grand (≥ 19 px gras) — contraste 4,1 (blanc) / 3,1 (crème)
// - "inherit" : couleur du texte autour (violet foncé sur fond clair, blanc sur fond foncé ou bouton)
export type BrandTone = "logo" | "inherit";

// Nom de marque « Na Nah N’hair » dans la typographie du logo (lettres du logo vectorisées).
// Hauteur des capitales alignée sur celle du texte voisin (≈ 0,7 em pour Montserrat et Bebas).
export default function BrandName({ tone = "inherit" }: { tone?: BrandTone }) {
  const [, , w, h] = brandGlyphs.viewBox.split(" ").map(Number);
  const height = 0.72 / brandGlyphs.capRatio;
  return (
    <svg
      role="img"
      aria-label={brand.displayName}
      viewBox={brandGlyphs.viewBox}
      data-brand-name
      className={`inline-block align-baseline ${tone === "logo" ? "text-logo-violet" : ""}`}
      // Largeur en em (proportions du logo) ; jamais plus large que son bloc sur petit écran
      style={{ width: `${(height * w) / h}em`, maxWidth: "100%", height: "auto", marginBottom: "-0.02em" }}
      fill="currentColor"
    >
      {brandGlyphs.groups.map((g) => (
        <path key={g.x} transform={`translate(${g.x} ${g.y})`} fillRule="evenodd" d={g.d} />
      ))}
    </svg>
  );
}

const BRAND = /na nah n['’]hair/gi;

// Remplace chaque mention du nom de marque dans un texte par <BrandName />
export function BrandText({ text, tone = "inherit" }: { text: string; tone?: BrandTone }) {
  const parts = text.split(BRAND);
  if (parts.length === 1) return <>{text}</>;
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part}
          {i < parts.length - 1 && <BrandName tone={tone} />}
        </Fragment>
      ))}
    </>
  );
}
