import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { CGV_VERSION } from "@/content/juridique";
import { clientIp } from "@/lib/auth";
import { checkAttempts, recordFailure } from "@/lib/auth-core";
import { readLimited } from "@/lib/http";
import { newOrderNumber, validateAddress } from "@/lib/order";
import { orderFromQuote } from "@/lib/orders";
import { createCheckoutSession, stripeConfig } from "@/lib/payments/stripe";
import { computeQuote, sanitizeCart } from "@/lib/pricing";
import type { CarrierId } from "@/lib/settings";
import { siteUrl } from "@/lib/site-url";
import { getCatalog, getSettings, logError, recordCgvAcceptance, saveOrder, updateAttempts, updateOrder } from "@/lib/store";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 8000;

// « Commander et payer » : vérifie l'acceptation des CGV, l'adresse et le total (recalculé ici, jamais celui du
// navigateur), enregistre la commande « en attente de paiement » avec la preuve d'acceptation des CGV, puis
// ouvre la page de paiement Stripe. Sans clé Stripe dans Netlify : commande enregistrée, paiement indisponible.
const MAX_ORDERS_PER_HOUR = 10;
export async function POST(request: Request) {
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) return NextResponse.json({ error: "requête trop grande" }, { status: 413 });
  const text = await readLimited(request, MAX_BODY_BYTES).catch(() => null);
  if (text === null) return NextResponse.json({ error: "requête trop grande" }, { status: 413 });
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(text) ?? {};
  } catch {
    return NextResponse.json({ error: "requête invalide" }, { status: 400 });
  }

  // 10 commandes par heure et par IP au maximum (anti-abus)
  const ip = await clientIp();
  let limited = false;
  await updateAttempts("order-attempts", (log) => {
    limited = checkAttempts(log, [[`commande:${ip}`, MAX_ORDERS_PER_HOUR]]);
    return limited ? log : recordFailure(log, [`commande:${ip}`], 60 * 60 * 1000);
  }).catch(() => undefined);
  if (limited) return NextResponse.json({ error: "trop-de-commandes" }, { status: 429 });

  if (body.acceptCgv !== true) return NextResponse.json({ error: "cgv" }, { status: 400 });
  const address = validateAddress(body.address);
  if (!address.ok) return NextResponse.json({ error: "adresse", fields: address.fields }, { status: 400 });

  try {
    const { items, errors } = sanitizeCart(body.items);
    const carrier = body.carrier === "colissimo" || body.carrier === "mondial-relay" ? (body.carrier as CarrierId) : null;
    if (!carrier) return NextResponse.json({ error: "transporteur" }, { status: 400 });
    const [catalog, settings] = await Promise.all([getCatalog(), getSettings()]);
    const quote = computeQuote(catalog, settings, items, carrier);
    if (errors.length || quote.errors.length || quote.shippingCents === null) return NextResponse.json({ error: "panier", quote }, { status: 409 });

    const order = orderFromQuote({
      number: newOrderNumber(),
      quote,
      carrier,
      address: address.value,
      cgvVersion: CGV_VERSION,
      accessKey: randomBytes(16).toString("hex"),
    });
    await saveOrder(order);
    await recordCgvAcceptance({ orderNumber: order.number, acceptedAt: order.cgv.acceptedAt, cgvVersion: CGV_VERSION });
    const headers = { "Cache-Control": "no-store" };
    if (!stripeConfig().enabled) {
      return NextResponse.json({ orderNumber: order.number, cgvVersion: CGV_VERSION, paymentAvailable: false }, { headers });
    }
    const session = await createCheckoutSession(order, siteUrl());
    await updateOrder(order.number, (o) => ({ ...o, payment: { provider: "stripe", sessionId: session.id } }));
    return NextResponse.json({ orderNumber: order.number, cgvVersion: CGV_VERSION, paymentAvailable: true, paymentUrl: session.url }, { headers });
  } catch (e) {
    await logError("api/commande", e);
    return NextResponse.json({ error: "indisponible" }, { status: 500 });
  }
}
