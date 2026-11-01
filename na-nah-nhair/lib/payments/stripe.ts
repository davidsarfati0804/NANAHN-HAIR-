import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { Order } from "@/lib/orders";

// Paiement Stripe Checkout (page de paiement hébergée par Stripe : carte, Apple Pay, Google Pay).
// Actif seulement quand STRIPE_SECRET_KEY est défini dans Netlify (clé de test sk_test_… d'abord).
// Aucune clé dans le code : variables d'environnement uniquement.
export function stripeConfig() {
  // Espaces, retours à la ligne ou guillemets collés par erreur autour de la valeur : ignorés
  const clean = (v: string | undefined) => (v ?? "").trim().replace(/^["']|["']$/g, "").trim();
  const secretKey = clean(process.env.STRIPE_SECRET_KEY);
  const webhookSecret = clean(process.env.STRIPE_WEBHOOK_SECRET);
  return {
    enabled: /^sk_(test|live)_/.test(secretKey),
    testMode: secretKey.startsWith("sk_test_"),
    secretKey,
    webhookSecret,
    apiBase: process.env.STRIPE_API_BASE || "https://api.stripe.com",
  };
}

// État des réglages, sans jamais révéler de valeur (page /api/sante)
export function stripeStatus() {
  const raw = process.env.STRIPE_SECRET_KEY;
  const c = stripeConfig();
  const key = raw === undefined ? "absente" : c.enabled ? (c.testMode ? "test" : "réelle") : `présente mais non reconnue (${c.secretKey.length} caractères, commence par « ${c.secretKey.slice(0, 3)} »)`;
  const webhook = process.env.STRIPE_WEBHOOK_SECRET === undefined ? "absent" : c.webhookSecret.startsWith("whsec_") ? "présent" : "présent mais non reconnu";
  return { cle: key, webhook };
}

// Paramètres de la session de paiement (format attendu par l'API Stripe), à partir d'une commande enregistrée
export function checkoutSessionParams(order: Order, siteUrl: string): URLSearchParams {
  const p = new URLSearchParams();
  p.set("mode", "payment");
  p.set("locale", "fr");
  p.set("client_reference_id", order.number);
  p.set("metadata[commande]", order.number);
  p.set("payment_intent_data[metadata][commande]", order.number);
  p.set("customer_email", order.address.email);
  p.set("success_url", `${siteUrl}/commande/confirmee?commande=${order.number}&cle=${order.accessKey}`);
  p.set("cancel_url", `${siteUrl}/commande?paiement=annule`);
  // La session expire au bout de 30 minutes (minimum accepté par Stripe)
  p.set("expires_at", String(Math.floor(Date.now() / 1000) + 30 * 60));
  const lines = [
    ...order.lines.map((l) => ({ name: l.name, unit: l.unitCents, quantity: l.quantity })),
    ...(order.shippingCents > 0 ? [{ name: "Livraison", unit: order.shippingCents, quantity: 1 }] : []),
  ];
  lines.forEach((l, i) => {
    p.set(`line_items[${i}][quantity]`, String(l.quantity));
    p.set(`line_items[${i}][price_data][currency]`, "eur");
    p.set(`line_items[${i}][price_data][unit_amount]`, String(l.unit));
    p.set(`line_items[${i}][price_data][product_data][name]`, l.name);
  });
  return p;
}

export async function createCheckoutSession(order: Order, siteUrl: string): Promise<{ id: string; url: string }> {
  const config = stripeConfig();
  const res = await fetch(`${config.apiBase}/v1/checkout/sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
      // Une commande = une session, même si la cliente clique deux fois
      "Idempotency-Key": `session-${order.number}`,
    },
    body: checkoutSessionParams(order, siteUrl),
  });
  const data = (await res.json().catch(() => ({}))) as { id?: string; url?: string; error?: { message?: string } };
  if (!res.ok || !data.id || !data.url) throw new Error(`Stripe ${res.status} : ${data.error?.message ?? "réponse invalide"}`);
  return { id: data.id, url: data.url };
}

// Vérifie la signature d'un événement envoyé par Stripe (en-tête Stripe-Signature, tolérance 5 minutes)
export function verifyStripeSignature(payload: string, header: string | null, secret: string, now = Date.now()): boolean {
  if (!header || !secret) return false;
  const parts = Object.fromEntries(header.split(",").map((kv) => kv.split("=", 2) as [string, string]));
  const t = Number(parts.t);
  if (!t || Math.abs(now / 1000 - t) > 300) return false;
  const expected = createHmac("sha256", secret).update(`${t}.${payload}`).digest("hex");
  return header
    .split(",")
    .filter((kv) => kv.startsWith("v1="))
    .some((kv) => {
      const sig = kv.slice(3);
      return sig.length === expected.length && timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
    });
}

export type StripeCheckoutSession = {
  id: string;
  client_reference_id: string | null;
  amount_total: number | null;
  currency: string | null;
  payment_status: "paid" | "unpaid" | "no_payment_required";
  payment_intent: string | null;
};
