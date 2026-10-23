import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { juridique } from "@/content/juridique/textes.generated";
import { CGV_VERSION, legalDocBySlug, legalDocs, legalHeadings, legalText } from "@/content/juridique";
import { slugifyHeading } from "@/components/legal/LegalMarkdown";
import { validateContact } from "@/lib/contact";
import { CONSENT_MAX_AGE_MS, parseConsent } from "@/lib/consent";

describe("formulaire de contact : validation serveur", () => {
  const ok = { name: "Inès", email: "ines@example.fr", subject: "Les soins", message: "Bonjour, une question sur Miraculous." };

  it("message valide accepté (espaces retirés)", () => {
    const r = validateContact({ ...ok, name: "  Inès  " });
    expect(r).toEqual({ ok: true, value: { ...ok } });
  });

  it("champs vides refusés", () => {
    const r = validateContact({});
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(["email", "message", "name", "subject"]);
  });

  it("email invalide, sujet inconnu, message trop court ou trop long", () => {
    for (const email of ["pas-un-email", "a@b", "a b@c.fr", "x".repeat(250) + "@a.fr"]) {
      expect(validateContact({ ...ok, email }).ok, email).toBe(false);
    }
    expect(validateContact({ ...ok, subject: "<script>" }).ok).toBe(false);
    expect(validateContact({ ...ok, message: "court" }).ok).toBe(false);
    expect(validateContact({ ...ok, message: "x".repeat(3001) }).ok).toBe(false);
  });

  it("types inattendus refusés sans planter", () => {
    expect(validateContact({ name: ["a"], email: { x: 1 }, subject: 3, message: null }).ok).toBe(false);
  });
});

describe("pages juridiques (modification 39)", () => {
  it("les 5 pages existent, dans l'ordre du pied de page", () => {
    expect(legalDocs.map((d) => d.slug)).toEqual(["mentions-legales", "cgv", "retractation", "confidentialite", "cookies"]);
  });

  it("textes fournis repris mot pour mot (fichiers .md) dans le module généré", () => {
    for (const d of legalDocs) {
      const md = readFileSync(new URL(`../../content/juridique/${d.file}.md`, import.meta.url), "utf8");
      expect(juridique[d.file]).toBe(md);
    }
  });

  it("CGV : version v1, sommaire de 15 articles, une ancre par article", () => {
    expect(CGV_VERSION).toBe("v1");
    const cgv = legalDocBySlug("cgv")!;
    expect(legalText(cgv)).toContain("Version : v1.");
    const h = legalHeadings(cgv).filter((t) => t !== "Sommaire");
    expect(h).toHaveLength(15);
    expect(new Set(h.map(slugifyHeading)).size).toBe(15);
  });

  it("mentions légales : informations connues présentes, manques signalés", () => {
    const text = legalText(legalDocBySlug("mentions-legales")!);
    for (const v of ["922 151 170 00011", "24 rue Octave Feuillet, 75016 Paris", "Contact@nanahnhair.com"]) expect(text).toContain(v);
    expect(text).toContain("[À COMPLÉTER");
  });

  it("cookies : décrit le stockage réellement utilisé par le site", () => {
    const text = legalText(legalDocBySlug("cookies")!);
    for (const key of ["nnh-panier-v1", "nnh-consentement", "nnh_admin"]) expect(text).toContain(key);
  });
});

describe("choix de cookies conservé 6 mois", () => {
  it("valide pendant 6 mois, puis redemandé", () => {
    const now = Date.UTC(2026, 9, 23);
    expect(parseConsent(`refuse|${now - 1000}`, now)).toBe("refuse");
    expect(parseConsent(`accepte|${now - CONSENT_MAX_AGE_MS + 1000}`, now)).toBe("accepte");
    expect(parseConsent(`accepte|${now - CONSENT_MAX_AGE_MS - 1000}`, now)).toBeNull();
    expect(parseConsent("refuse", now)).toBe("refuse");
    expect(parseConsent("autre", now)).toBeNull();
    expect(parseConsent(null, now)).toBeNull();
  });
});

describe("garde-fou avant la mise en production", () => {
  it("bloque tant qu'il reste des À COMPLÉTER et liste les endroits", () => {
    const r = spawnSync(process.execPath, ["scripts/verifier-mise-en-ligne.mjs"], { cwd: new URL("../..", import.meta.url).pathname, encoding: "utf8" });
    expect(r.status).toBe(1);
    expect(r.stderr).toContain("Mise en production bloquée");
    expect(r.stderr).toContain("content/juridique/mentions-legales.md");
    expect(r.stderr).toContain("pied de page");
  });
});
