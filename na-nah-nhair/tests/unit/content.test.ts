import { existsSync, readFileSync } from "node:fs";
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
    if (p.usage) {
      // Mode d'emploi fourni : chaque texte affiché figure dans INFOS
      const plainText = (x: string) => x.replaceAll("\u00a0", " ");
      for (const step of p.usage.steps) {
        expect(s).toContain(`${step.title} : ${plainText(step.text.before + step.text.strong + step.text.after)}`);
      }
      for (const pr of p.usage.precautions) expect(s).toContain(`- ${plainText(pr.text)}`);
      expect(s).toContain(plainText(p.usage.badge.label));
    } else {
      expect(s).toContain("**Mode d'emploi** : `À COMPLÉTER`");
      expect(p.precautions).toBeNull();
    }
  });

  it("prix : Fabulous 19,90 €, Miraculous 39,90 €, Luxurious 29,90 €, pack 69,90 €", () => {
    expect(products.map((p) => p.infosPrice)).toEqual(["19,90 €", "39,90 €", "29,90 €"]);
    expect(pack.infosPrice).toBe("69,90 €");
  });

  it("photos des flacons et du pack : fichiers fournis, versions responsives et textes alternatifs", () => {
    for (const ph of [...products.map((p) => p.photo), pack.photo]) {
      expect(ph.available).toBe(true);
      expect(existsSync(new URL(`../../assets/images/${ph.file}`, import.meta.url))).toBe(true);
      for (const w of [400, 800, 1200])
        for (const ext of ["webp", "jpg"])
          expect(existsSync(new URL(`../../public/images/produits/${ph.responsive}-${w}.${ext}`, import.meta.url))).toBe(true);
    }
    expect(products.map((p) => p.photo.alt.replaceAll("\u00a0", " "))).toEqual([
      "Flacon Fabulous Hair Serum, sérum capillaire de 30 ml",
      "Flacon Miraculous Hair Serum, sérum capillaire de 30 ml",
      "Flacon Luxurious Hair Serum, sérum capillaire de 30 ml",
    ]);
  });

  it("photos détourées de l'accueil : emplacement À COMPLÉTER tant qu'elles ne sont pas fournies", () => {
    for (const p of products) {
      const there = existsSync(new URL(`../../assets/images/${p.cutout.file}`, import.meta.url));
      expect(p.cutout.available).toBe(there);
    }
  });
});

describe("textes de marque", () => {
  it("pack", () => {
    const s = section("## 7. PACK DES 3 SOINS");
    for (const c of pack.content) expect(s).toContain(`${c.product} : ${c.text}`);
    expect(s).toContain(`**${pack.usageTitle}** : ${pack.usage}`);
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
    // Apostrophe typographique demandée (modification 2) : comparée avec l'apostrophe droite d'INFOS
    expect(infos).toContain(emotionalConcept.title.replace("’", "'"));
    expect(infos).toContain(emotionalConcept.lines.join(" "));
    // Consigne d'INFOS, jamais affichée
    expect(JSON.stringify(site)).not.toContain("catégories exclusives");
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
    for (const g of faq.groups)
      for (const item of g.items)
        if (!item.answer && !item.blocks && !item.mailto) expect(item.todo).toBeTruthy();
  });

  it("précautions, utilisation et contact commande : textes du 21/10/2026", async () => {
    const faq = plain(site.faq);
    const all = faq.groups.flatMap((g) => g.items);
    const precautions = all.find((i) => i.question.startsWith("Y a-t-il des précautions"))!;
    expect(precautions.todo).toBeUndefined();
    expect(precautions.answer).toEqual(["Ces précautions sont identiques pour Fabulous, Miraculous et Luxurious."]);
    expect(precautions.list).toEqual([
      "Ne pas utiliser le soin les 2 jours qui précèdent et suivent la coloration.",
      "Éviter tout contact avec les yeux.",
      "Usage externe uniquement.",
    ]);
    const usage = all.find((i) => i.question === "Comment utiliser les sérums ?")!;
    expect(usage.todo).toBeUndefined();
    expect(usage.blocks!.map((b) => b.title)).toEqual(["Fabulous", "Miraculous", "Luxurious"]);
    expect(usage.blocks![1].steps[0]).toEqual({
      label: "Étape 1",
      text: "Utiliser Miraculous Hair Serum des racines vers les pointes. Pour un soin complet : 3 pipettes sont nécessaires, à appliquer sur le cuir chevelu, les longueurs et les pointes.",
    });
    expect(usage.blocks![2].steps[1].text).toBe(
      "Laver les cheveux avec un shampoing classique. Pour un résultat optimisé, utiliser le soin 3 fois par semaine.",
    );
    const contact = all.find((i) => i.question.startsWith("Comment vous contacter"))!;
    expect(contact.mailto).toEqual({ before: "Par email à", email: "Contact@nanahnhair.com" });
    expect(JSON.stringify(contact)).not.toMatch(/téléphone/);
  });

  it("« vitamine » au singulier partout", async () => {
    expect(JSON.stringify(plain(site.products))).not.toMatch(/vitamines/);
    expect(JSON.stringify(plain(site.home))).not.toMatch(/vitamines/);
    expect(infos).not.toMatch(/vitamines/);
  });
});

describe("histoire : textes du 22/10/2026 (modification 31) mot pour mot", () => {
  it("titre, cinq paragraphes, bloc final, carte « Le défi »", () => {
    const story = plain(site.story);
    expect(story.heading).toBe("Tout a commencé sur mon bureau.");
    expect(story.paragraphs).toHaveLength(5);
    expect(story.paragraphs[0]).toBe("Je suis naturopathe et diplômée en aromathérapie. Mais avant les diplômes, il y a eu une rencontre.");
    expect(story.paragraphs[4]).toBe(
      "Parce qu’une femme n’est jamais qu’une seule chose. Elle peut être fraîche et spontanée, déterminée et audacieuse, élégante et sensorielle, parfois tout ça dans la même journée.",
    );
    expect(story.closing).toMatch(/^C’est ainsi qu’est née Na Nah N’hair : trois soins, trois univers, une même envie, celle de te laisser prendre soin/);
    expect(plain(site.home).story.cards[0].text).toBe(
      "En première année de naturopathie, lors d’un stage, une femme souhaite prendre soin de ses cheveux et favoriser leur longueur. J’ai relevé le défi : une synergie sur mesure, rien que pour elle.",
    );
  });

  it("apostrophes courbes uniquement, plus de « clinique »", () => {
    const texts = JSON.stringify([site.story, site.home.story]);
    expect(texts).not.toContain("'");
    expect(texts.toLowerCase()).not.toContain("clinique");
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

describe("modifications du 20/10/2026", () => {
  it("phrases « Je suis » et odeurs avec majuscule, conformes à INFOS §12", () => {
    for (const p of site.products) {
      expect(infos.replaceAll("’", "'")).toContain(`**Phrase « Je suis »** (cartes et fiche) : ${p.iAm}`.replaceAll("’", "'"));
      expect(p.scent.charAt(0)).toBe(p.scent.charAt(0).toUpperCase());
    }
    expect(site.products.map((p) => p.scent)).toEqual(["Monoï", "Vanille patchouli", "Fleur d’oranger"]);
  });

  it("délai de livraison identique partout", () => {
    const all = JSON.stringify(site).replaceAll("\u00a0", " ");
    expect(all).not.toMatch(/3 jours ouvrés(?!, préparation incluse)/);
    expect(all).not.toContain("préparation incluse ou non");
  });

  it("aucune consigne de BRIEF/INFOS affichée", () => {
    const all = JSON.stringify(site);
    for (const consigne of ["catégories exclusives", "INFOS §", "phase 6", "Claude Code"]) expect(all).not.toContain(consigne);
  });
});
