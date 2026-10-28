import { NextResponse } from "next/server";
import { readLimited } from "@/lib/http";
import { processPaidSession } from "@/lib/order-processing";
import { type StripeCheckoutSession, stripeConfig, verifyStripeSignature } from "@/lib/payments/stripe";
import { logError } from "@/lib/store";

export const dynamic = "force-dynamic";

// Événements envoyés par Stripe (adresse à déclarer dans Stripe > Développeurs > Webhooks) :
// checkout.session.completed et checkout.session.async_payment_succeeded = paiement reçu.
export async function POST(request: Request) {
  const config = stripeConfig();
  const payload = await readLimited(request, 512 * 1024).catch(() => null);
  if (payload === null) return NextResponse.json({ error: "requête trop grande" }, { status: 413 });
  if (!verifyStripeSignature(payload, request.headers.get("stripe-signature"), config.webhookSecret)) {
    return NextResponse.json({ error: "signature" }, { status: 400 });
  }
  try {
    const event = JSON.parse(payload) as { type: string; data: { object: StripeCheckoutSession } };
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      const result = await processPaidSession(event.data.object);
      return NextResponse.json({ received: true, ...result });
    }
    return NextResponse.json({ received: true, ignored: event.type });
  } catch (e) {
    await logError("webhook Stripe", e);
    // 500 : Stripe renverra l'événement plus tard
    return NextResponse.json({ error: "traitement" }, { status: 500 });
  }
}
