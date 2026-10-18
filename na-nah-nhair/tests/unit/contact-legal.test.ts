import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { legalPages } from "@/content/legal";
import { validateContact } from "@/lib/contact";

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

describe("pages juridiques", () => {
  const infos = readFileSync(new URL("../../INFOS.md", import.meta.url), "utf8");
  const plain = (s: string) => s.replaceAll("\u00a0", " ");

  it("les 5 pages existent", () => {
    expect(legalPages.map((p) => p.slug)).toEqual(["mentions-legales", "cgv", "confidentialite", "cookies", "retours"]);
  });

  it("mentions légales : informations d'INFOS.md et À COMPLÉTER", () => {
    const text = plain(JSON.stringify(legalPages[0]));
    for (const v of ["922 151 170 00011", "24 rue Octave Feuillet, 75016 Paris", "01 80 18 29 29", "Contact@nanahnhair.com"]) {
      expect(text).toContain(v);
      expect(infos).toContain(v);
    }
    expect(text).toContain("statut de l'entreprise");
    expect(text).toContain("responsable de la publication");
  });

  it("CGV : présentées comme un projet à relire (INFOS §11)", () => {
    expect(legalPages[1].notice).toMatch(/Projet de CGV/);
    expect(legalPages[1].notice).toMatch(/pas définitif/);
  });

  it("retours : règles d'INFOS §11 mot pour mot", () => {
    const text = plain(JSON.stringify(legalPages[4]));
    for (const rule of [
      "Droit de rétractation de 14 jours pour les produits non ouverts, comme l'impose la loi pour la vente à distance.",
      "Les produits ouverts ne sont pas repris (raison d'hygiène).",
      "Garantie légale en cas de produit défectueux ou erroné.",
    ]) {
      expect(text).toContain(rule);
      expect(infos).toContain(rule.replace(/\.$/, ""));
    }
    expect(text).toContain("qui paie le retour");
  });
});
