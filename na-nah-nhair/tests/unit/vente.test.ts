import { createHmac } from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { seedCatalog } from "@/lib/catalog";
import { decrementStock, invoiceNumber, orderFromQuote } from "@/lib/orders";

vi.mock("server-only", () => ({}));

const address = { firstName: "Inès", lastName: "Martin", email: "ines@example.fr", phone: "", address: "1 rue de la Paix", postalCode: "75002", city: "Paris" };
const quote = {
  lines: [
    { id: "fabulous" as const, quantity: 2, unitCents: 1990, totalCents: 3980 },
    { id: "pack" as const, quantity: 1, unitCents: 6990, totalCents: 6990 },
  ],
  subtotalCents: 10970,
  shippingCents: 0,
  freeShipping: true,
  totalCents: 10970,
  errors: [],
};
const order = orderFromQuote({ number: "NNH-20261028-ABC123", quote, carrier: "colissimo", address, cgvVersion: "v1", accessKey: "k".repeat(32) });

describe("commandes", () => {
  it("commande enregistrée avec le nom des produits et la preuve d'acceptation des CGV", () => {
    expect(order.status).toBe("attente-paiement");
    expect(order.lines[0].name).toBe("FABULOUS HAIR SERUM");
    expect(order.cgv.version).toBe("v1");
  });

  it("stock : sérums vendus seuls et dans les packs ; stock non suivi inchangé ; jamais négatif", () => {
    const c = seedCatalog();
    c.fabulous.stock = 10;
    c.miraculous.stock = 1;
    const next = decrementStock(c, [...quote.lines, { id: "miraculous", quantity: 3 }]);
    expect(next.fabulous.stock).toBe(7); // 2 seuls + 1 dans le pack
    expect(next.miraculous.stock).toBe(0);
    expect(next.luxurious.stock).toBeNull();
    expect(c.fabulous.stock).toBe(10); // catalogue d'origine intact
  });

  it("numéro de facture à la suite", () => {
    expect(invoiceNumber(2026, 1)).toBe("F-2026-00001");
    expect(invoiceNumber(2026, 123)).toBe("F-2026-00123");
  });
});

describe("Stripe", async () => {
  const { checkoutSessionParams, verifyStripeSignature } = await import("@/lib/payments/stripe");

  it("session de paiement : montants du serveur, en euros, commande rattachée", () => {
    const p = checkoutSessionParams(order, "https://exemple.fr");
    expect(p.get("client_reference_id")).toBe(order.number);
    expect(p.get("line_items[0][price_data][unit_amount]")).toBe("1990");
    expect(p.get("line_items[0][quantity]")).toBe("2");
    expect(p.get("line_items[1][price_data][product_data][name]")).toBe("PACK DES 3 SOINS");
    expect(p.get("line_items[2][quantity]")).toBeNull(); // livraison offerte : pas de ligne
    expect(p.get("line_items[0][price_data][currency]")).toBe("eur");
    expect(p.get("success_url")).toContain(`commande=${order.number}&cle=${order.accessKey}`);
  });

  it("signature des événements : acceptée si valide et récente, refusée sinon", () => {
    const secret = "whsec_test";
    const payload = '{"type":"checkout.session.completed"}';
    const t = Math.floor(Date.now() / 1000);
    const sig = createHmac("sha256", secret).update(`${t}.${payload}`).digest("hex");
    expect(verifyStripeSignature(payload, `t=${t},v1=${sig}`, secret)).toBe(true);
    expect(verifyStripeSignature(`${payload} `, `t=${t},v1=${sig}`, secret)).toBe(false);
    expect(verifyStripeSignature(payload, `t=${t - 600},v1=${createHmac("sha256", secret).update(`${t - 600}.${payload}`).digest("hex")}`, secret)).toBe(false);
    expect(verifyStripeSignature(payload, null, secret)).toBe(false);
    expect(verifyStripeSignature(payload, `t=${t},v1=${sig}`, "")).toBe(false);
  });
});

describe("paiement confirmé (stockage local)", () => {
  let dir = "";
  beforeAll(async () => {
    dir = await mkdtemp(path.join(tmpdir(), "nnh-vente-"));
    vi.stubEnv("NNH_DATA_DIR", dir);
  });
  afterAll(async () => {
    vi.unstubAllEnvs();
    await rm(dir, { recursive: true, force: true });
  });

  it("commande payée une seule fois : stock, facture, montant vérifié", async () => {
    const store = await import("@/lib/store");
    const { processPaidSession } = await import("@/lib/order-processing");
    await store.saveOrder(order);
    await store.saveCatalog({ ...seedCatalog(), fabulous: { ...seedCatalog().fabulous, stock: 5 } });
    const session = { id: "cs_test_1", client_reference_id: order.number, amount_total: 10970, currency: "eur", payment_status: "paid" as const, payment_intent: "pi_1" };

    expect(await processPaidSession({ ...session, amount_total: 100 })).toEqual({ ok: false, reason: "montant différent" });
    expect(await processPaidSession(session)).toEqual({ ok: true });
    expect(await processPaidSession(session)).toEqual({ ok: true, reason: "déjà traitée" });

    const saved = await store.getOrder(order.number);
    expect(saved?.status).toBe("payee");
    expect(saved?.invoiceNumber).toMatch(/^F-\d{4}-00001$/);
    expect(saved?.emails?.error).toBe("envoi des emails pas encore configuré");
    expect((await store.getCatalog()).fabulous.stock).toBe(2);
    expect(await store.listOrders()).toHaveLength(1);
  });
});
