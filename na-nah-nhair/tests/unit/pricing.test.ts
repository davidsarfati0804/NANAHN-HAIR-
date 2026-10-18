import { describe, expect, it } from "vitest";
import { availableQuantity, type Catalog, fromPublic, seedCatalog, toPublic } from "@/lib/catalog";
import { formatPrice, parseEuroInput, parsePrice } from "@/lib/money";
import { computeQuote, maxAddable, sanitizeCart } from "@/lib/pricing";
import { seedSettings } from "@/lib/settings";

const catalog = () => seedCatalog();
const settings = () => seedSettings();

describe("prix", () => {
  it("catalogue initial = prix INFOS.md", () => {
    const c = catalog();
    expect([c.fabulous.priceCents, c.miraculous.priceCents, c.luxurious.priceCents, c.pack.priceCents]).toEqual([1990, 3990, 2990, 6990]);
  });

  it("format français", () => {
    expect(formatPrice(1990)).toBe("19,90 €");
    expect(formatPrice(6990)).toBe("69,90 €");
    expect(formatPrice(5)).toBe("0,05 €");
    expect(formatPrice(425880)).toBe("4 258,80 €");
    expect(formatPrice(123456789)).toBe("1 234 567,89 €");
    expect(parsePrice("39,90 €")).toBe(3990);
  });

  it("saisie du back-office", () => {
    expect(parseEuroInput("19,90")).toBe(1990);
    expect(parseEuroInput("19.9")).toBe(1990);
    expect(parseEuroInput(" 19 € ")).toBe(1900);
    expect(parseEuroInput("0")).toBe(0);
    for (const bad of ["", "abc", "-5", "1,999", "1e3", "19,90,1"]) expect(parseEuroInput(bad), bad).toBeNull();
  });
});

describe("panier", () => {
  it("total correct avec pack à 69,90 €", () => {
    const q = computeQuote(catalog(), settings(), [
      { id: "fabulous", quantity: 2 },
      { id: "pack", quantity: 1 },
      { id: "luxurious", quantity: 1 },
    ]);
    expect(q.errors).toEqual([]);
    expect(q.subtotalCents).toBe(2 * 1990 + 6990 + 2990);
    expect(q.freeShipping).toBe(true);
    expect(q.shippingCents).toBe(0);
    expect(q.totalCents).toBe(13960);
  });

  it("le pack (69,90 €) coûte moins que les trois sérums séparés (89,70 €)", () => {
    const c = catalog();
    expect(c.pack.priceCents).toBeLessThan(c.fabulous.priceCents + c.miraculous.priceCents + c.luxurious.priceCents);
  });

  it("prix toujours ceux du catalogue, jamais ceux du navigateur", () => {
    const { items } = sanitizeCart([{ id: "fabulous", quantity: 1, priceCents: 1 }]);
    const q = computeQuote(catalog(), settings(), items);
    expect(q.totalCents).toBe(1990);
  });

  it("nettoyage : produits inconnus, quantités invalides, doublons", () => {
    const { items, errors } = sanitizeCart([
      { id: "fabulous", quantity: 1 },
      { id: "fabulous", quantity: 2 },
      { id: "inconnu", quantity: 1 },
      { id: "luxurious", quantity: 0 },
      { id: "miraculous", quantity: 1.5 },
      { id: "pack", quantity: 1000 },
      { id: "luxurious", quantity: 1e9 },
      null,
    ]);
    // Au-delà de 99 : ramené à 99 (pas supprimé)
    expect(items).toEqual([{ id: "fabulous", quantity: 3 }, { id: "pack", quantity: 99 }]);
    expect(errors.map((e) => e.code)).toEqual(["unknown-product", "invalid-quantity", "invalid-quantity", "invalid-quantity", "unknown-product"]);
    expect(sanitizeCart("pas un tableau").items).toEqual([]);
  });

  it("panier vide signalé", () => {
    expect(computeQuote(catalog(), settings(), []).errors).toContainEqual({ code: "empty-cart" });
  });
});

describe("stock", () => {
  const withStock = (stocks: Partial<Record<"fabulous" | "miraculous" | "luxurious", number | null>>): Catalog => {
    const c = catalog();
    for (const [id, s] of Object.entries(stocks)) c[id as "fabulous"].stock = s;
    return c;
  };

  it("stock non suivi = illimité", () => {
    expect(availableQuantity(catalog(), "fabulous")).toBeNull();
    expect(availableQuantity(catalog(), "pack")).toBeNull();
  });

  it("le pack dépend des trois sérums", () => {
    expect(availableQuantity(withStock({ fabulous: 5, miraculous: 2, luxurious: null }), "pack")).toBe(2);
    expect(availableQuantity(withStock({ miraculous: 0 }), "pack")).toBe(0);
  });

  it("produit épuisé ou désactivé", () => {
    const c = withStock({ luxurious: 0 });
    expect(availableQuantity(c, "luxurious")).toBe(0);
    expect(toPublic(c).luxurious.available).toBe(0);
    c.fabulous.active = false;
    expect(availableQuantity(c, "fabulous")).toBe(0);
    expect(availableQuantity(c, "pack")).toBe(0);
    expect(computeQuote(c, settings(), [{ id: "luxurious", quantity: 1 }]).errors).toContainEqual({ code: "unavailable", id: "luxurious" });
  });

  it("un pack consomme un exemplaire de chaque sérum", () => {
    const c = withStock({ fabulous: 3 });
    expect(computeQuote(c, settings(), [{ id: "fabulous", quantity: 2 }, { id: "pack", quantity: 1 }]).errors).toEqual([]);
    const q = computeQuote(c, settings(), [{ id: "fabulous", quantity: 3 }, { id: "pack", quantity: 1 }]);
    expect(q.errors).toContainEqual({ code: "insufficient-stock", id: "fabulous", available: 2 });
    expect(q.errors).toContainEqual({ code: "insufficient-stock", id: "pack", available: 0 });
  });

  it("stock insuffisant sur un sérum seul", () => {
    const q = computeQuote(withStock({ miraculous: 2 }), settings(), [{ id: "miraculous", quantity: 3 }]);
    expect(q.errors).toEqual([{ code: "insufficient-stock", id: "miraculous", available: 2 }]);
  });
});

describe("quantité ajoutable (stock partagé sérum + pack)", () => {
  it("2 packs au panier et 2 Fabulous en stock : plus aucun Fabulous ajoutable", () => {
    const c = catalog();
    c.fabulous.stock = 2;
    expect(maxAddable(c, [{ id: "pack", quantity: 2 }], "fabulous")).toBe(0);
    expect(maxAddable(c, [{ id: "pack", quantity: 1 }], "fabulous")).toBe(1);
    expect(maxAddable(c, [{ id: "fabulous", quantity: 2 }], "pack")).toBe(0);
    expect(maxAddable(c, [], "pack")).toBe(2);
  });

  it("stock non suivi : jusqu'à 99 par ligne", () => {
    expect(maxAddable(catalog(), [{ id: "fabulous", quantity: 97 }], "fabulous")).toBe(2);
  });

  it("le catalogue public permet le même calcul que le serveur", () => {
    const c = catalog();
    c.miraculous.stock = 4;
    c.luxurious.active = false;
    const rebuilt = fromPublic(toPublic(c));
    expect(availableQuantity(rebuilt, "pack")).toBe(0);
    expect(rebuilt.miraculous.stock).toBe(4);
    expect(rebuilt.fabulous.priceCents).toBe(1990);
  });
});

describe("livraison", () => {
  it("offerte sur toutes les commandes (seuil 0)", () => {
    const q = computeQuote(catalog(), settings(), [{ id: "fabulous", quantity: 1 }], "colissimo");
    expect(q.shippingCents).toBe(0);
    expect(q.errors).toEqual([]);
  });

  it("seuil remonté : tarif du transporteur appliqué, ou erreur si tarif À COMPLÉTER", () => {
    const s = settings();
    s.freeShippingThresholdCents = 5000;
    const missing = computeQuote(catalog(), s, [{ id: "fabulous", quantity: 1 }], "colissimo");
    expect(missing.errors).toContainEqual({ code: "carrier-price-missing", carrier: "colissimo" });
    s.carriers.colissimo.priceCents = 490;
    const paid = computeQuote(catalog(), s, [{ id: "fabulous", quantity: 1 }], "colissimo");
    expect(paid.totalCents).toBe(1990 + 490);
    const free = computeQuote(catalog(), s, [{ id: "pack", quantity: 1 }], "colissimo");
    expect(free.shippingCents).toBe(0);
  });

  it("transporteur désactivé refusé", () => {
    const s = settings();
    s.carriers["mondial-relay"].active = false;
    expect(computeQuote(catalog(), s, [{ id: "fabulous", quantity: 1 }], "mondial-relay").errors).toContainEqual({ code: "unknown-carrier" });
  });
});
