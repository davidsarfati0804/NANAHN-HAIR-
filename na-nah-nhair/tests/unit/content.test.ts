import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import * as site from "@/content/site";

// Les textes du site ont des espaces insécables (typographie) : on compare avec des espaces simples
const plain = <T,>(v: T): T => JSON.parse(JSON.stringify(v).replaceAll("\u00a0", " "));
const { announcement, brand, emotionalConcept, home, legal, pack, products } = plain({
  announcement: site.announcement,
  brand: site.brand,
  emotionalConcept: site.emotionalConcept,
  home: site.home,
  legal: site.legal,
  pack: site.pack,
  products: site.products,
});

// Le contenu du site doit reprendre INFOS.md mot pour mot
const infos = readFileSync(new URL("../../INFOS.md", import.meta.url), "utf8");
const unescape = (s: string) => s.replace(/\\\*/g, "*");
const section = (title: string) => {
  const start = infos.indexOf(title);
  if (start === -1) return "";
  const end = infos.indexOf("\n## ", start + 1);
  return unescape(infos.slice(start, end));
};

describe("produits conformes à INFOS.md", () => {
  it.each(products.map((p) => [p.name, p] as const))("%s", (name, p) => {
    const s = section(`## ${[4, 5, 6][products.indexOf(p)]}. ${name} — ${p.infosPrice}`);
    expect(s, "section introuvable").not.toBe("");
    expect(s).toContain(`**Personnalité** : ${p.personality}`);
    expect(s).toContain(`**Univers** : ${p.universe}`);
    expect(s).toContain(`**Odeur** : ${p.scent}`);
    expect(s).toContain(`**Texte** : ${p.text}`);
    expect(s).toContain(`**Sa phrase** : ${p.phrase}`);
    expect(s).toContain(`**Contenance** : ${p.volume}`);
    expect(s).toContain(`assets/images/${p.photo.file}`);
    for (const h of [...p.highlights, ...p.description.helps]) expect(s).toContain(`- ${h}\n`);
    for (const t of [p.description.intro, p.description.vitamins, p.description.outro]) {
      if (t) expect(s).toContain(t);
    }
    // INCI : reproduite exactement
    expect(s).toContain(`\n${p.inci}\n`);
    for (const note of p.inciNotes) expect(s).toContain(note);
    // Mode d'emploi et précautions : encore À COMPLÉTER
    expect(s).toContain("**Mode d'emploi** : `À COMPLÉTER`");
    expect(p.usage).toBeNull();
    expect(p.precautions).toBeNull();
  });

  it("prix : Fabulous 19,90 €, Miraculous 39,90 €, Luxurious 29,90 €, pack 69,90 €", () => {
    expect(products.map((p) => p.infosPrice)).toEqual(["19,90 €", "39,90 €", "29,90 €"]);
    expect(pack.infosPrice).toBe("69,90 €");
  });

  it("aucune photo n'est marquée disponible tant que le Drive n'est pas livré", () => {
    expect([...products.map((p) => p.photo), pack.photo].every((ph) => !ph.available)).toBe(true);
  });
});

describe("textes de marque", () => {
  it("pack", () => {
    const s = section("## 7. PACK DES 3 SOINS");
    for (const c of pack.content) expect(s).toContain(`${c.product} : ${c.text}`);
    expect(s).toContain(`**Mode d'emploi du pack** : ${pack.usage}`);
  });

  it("bandeau, signature, accueil", () => {
    expect(announcement.text).toBe("Quel Na Nah N'Hair es-tu ?");
    expect(announcement.href).toBe("/quiz");
    expect(infos).toContain(announcement.reserveText);
    expect(brand.signature).toBe("Révèle ton Na Nah N'Hair.");
    expect(home.hero.subtitle).toBe("Trois soins. Trois personnalités. Une seule question : lequel est le tien ?");
    expect(home.hero.primaryCta).toEqual({ label: "Je découvre mon Na Nah N'Hair", href: "/quiz" });
    expect(home.hero.secondaryCta.label).toBe("Découvrir les trois soins");
  });

  it("concept émotionnel", () => {
    expect(infos).toContain(emotionalConcept.title);
    expect(infos).toContain(emotionalConcept.lines.join(" "));
    expect(infos).toContain(emotionalConcept.note);
  });

  it("informations légales", () => {
    for (const v of [legal.siret, legal.address, legal.phone, legal.email]) expect(infos).toContain(v);
  });
});

describe("FAQ : réponses issues d'INFOS.md", () => {
  it("chaque réponse de livraison et retours figure dans INFOS.md", async () => {
    const faq = plain(site.faq);
    const groups = faq.groups.filter((g) => ["Livraison", "Retours"].includes(g.title));
    for (const g of groups)
      for (const item of g.items)
        for (const line of item.answer ?? []) {
          const core = line.replace(/\.$/, "");
          expect(infos, line).toContain(core.split(", au choix")[0]);
        }
  });

  it("les questions sans réponse fournie affichent un À COMPLÉTER", async () => {
    const faq = plain(site.faq);
    for (const g of faq.groups) for (const item of g.items) if (!item.answer) expect(item.todo).toBeTruthy();
  });
});

describe("histoire : texte du brief mot pour mot", () => {
  it("les paragraphes recomposent le texte de BRIEF.md §3", async () => {
    const story = plain(site.story);
    const brief = readFileSync(new URL("../../BRIEF.md", import.meta.url), "utf8");
    expect(brief).toContain(story.paragraphs.join(" "));
  });
});

describe("typographie française", () => {
  it("espace insécable avant ? : ! » et après «", () => {
    expect(site.announcement.text).toBe("Quel Na Nah N'Hair es-tu ?");
    expect(site.products[0].phrase).toBe("« Simplement moi, simplement Fabulous. »");
    const all = JSON.stringify(site);
    expect(all).not.toMatch(/ [?!:»]/);
    expect(all).not.toMatch(/« /);
  });

  it("INCI inchangées (aucun signe concerné)", () => {
    for (const p of site.products) expect(p.inci).not.toContain(" ");
  });
});
