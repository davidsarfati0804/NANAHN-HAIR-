import { describe, expect, it } from "vitest";
import { colors, contrastPairs, largeTextPairs } from "@/lib/design-tokens";

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe("contrastes WCAG AA (4,5:1)", () => {
  it.each(contrastPairs)("texte %s sur fond %s", (text, bg) => {
    expect(contrast(colors[text], colors[bg])).toBeGreaterThanOrEqual(4.5);
  });

  it.each(largeTextPairs)("grand texte %s sur fond %s (3:1)", (text, bg) => {
    expect(contrast(colors[text], colors[bg])).toBeGreaterThanOrEqual(3);
  });

  it("le blanc sur Lavender reste interdit (INFOS §2)", () => {
    expect(contrast(colors.white, colors.lavender)).toBeLessThan(4.5);
    expect(contrastPairs).not.toContainEqual(["white", "lavender"]);
  });
});

describe("tokens CSS synchronisés", () => {
  it("app/globals.css reprend les mêmes valeurs que lib/design-tokens.ts", async () => {
    const { readFileSync } = await import("node:fs");
    const css = readFileSync(new URL("../../app/globals.css", import.meta.url), "utf8").toLowerCase();
    for (const [name, value] of Object.entries(colors)) {
      const cssName = name.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
      expect(css, name).toContain(`--color-${cssName}: ${value.toLowerCase()};`);
    }
  });
});

describe("guide de style = variables du site", () => {
  it("chaque couleur du guide (/guide-de-style) est une variable de design", async () => {
    const { brandPalette, productPalette } = await import("@/lib/palette");
    const values = Object.values(colors).map((v) => v.toUpperCase());
    for (const s of brandPalette) expect(values, s.token).toContain(s.hex.toUpperCase());
    for (const p of productPalette)
      for (const v of [p.clair, p.moyen, p.fonce, p.nom]) expect(values, `${p.product} ${v}`).toContain(v.toUpperCase());
  });

  it("aucune couleur écrite en dur dans les composants (hors guide de style)", async () => {
    const { readdirSync, readFileSync, statSync } = await import("node:fs");
    const { join } = await import("node:path");
    const walk = (dir: string): string[] =>
      readdirSync(dir).flatMap((f) => {
        const p = join(dir, f);
        return statSync(p).isDirectory() ? walk(p) : p.endsWith(".tsx") ? [p] : [];
      });
    const root = new URL("../../", import.meta.url).pathname;
    const offenders = [...walk(join(root, "app")), ...walk(join(root, "components"))]
      .filter((f) => !f.includes("guide-de-style"))
      .filter((f) => /#[0-9a-fA-F]{6}\b|rgb\(/.test(readFileSync(f, "utf8")));
    expect(offenders).toEqual([]);
  });
});
