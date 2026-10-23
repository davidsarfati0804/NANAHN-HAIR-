import { NextResponse } from "next/server";
import { CGV_VERSION } from "@/content/juridique";
import { readLimited } from "@/lib/http";
import { newOrderNumber, validateAddress } from "@/lib/order";
import { computeQuote, sanitizeCart } from "@/lib/pricing";
import type { CarrierId } from "@/lib/settings";
import { getCatalog, getSettings, logError, recordCgvAcceptance } from "@/lib/store";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 8000;

// « Commander et payer » : vérifie l'acceptation des CGV, l'adresse et le total, puis enregistre la preuve
// d'acceptation (date, version des CGV, numéro de commande). Le paiement en ligne n'est pas encore actif :
// rien n'est encaissé et aucune autre donnée n'est conservée.
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

    const orderNumber = newOrderNumber();
    await recordCgvAcceptance({ orderNumber, acceptedAt: new Date().toISOString(), cgvVersion: CGV_VERSION });
    return NextResponse.json({ orderNumber, cgvVersion: CGV_VERSION, paymentAvailable: false }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    await logError("api/commande", e);
    return NextResponse.json({ error: "indisponible" }, { status: 500 });
  }
}
