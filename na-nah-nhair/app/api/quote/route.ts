import { NextResponse } from "next/server";
import { computeQuote, sanitizeCart } from "@/lib/pricing";
import type { CarrierId } from "@/lib/settings";
import { getCatalog, getSettings, logError } from "@/lib/store";

export const dynamic = "force-dynamic";

// Calcul qui fait foi : prix lus en base, jamais ceux envoyés par le navigateur
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "requête invalide" }, { status: 400 });
  }
  if (JSON.stringify(body).length > 5000) return NextResponse.json({ error: "requête trop grande" }, { status: 413 });

  try {
    const { items, errors } = sanitizeCart((body as { items?: unknown })?.items);
    const rawCarrier = (body as { carrier?: unknown })?.carrier;
    const carrier = rawCarrier === "colissimo" || rawCarrier === "mondial-relay" ? (rawCarrier as CarrierId) : null;
    const [catalog, settings] = await Promise.all([getCatalog(), getSettings()]);
    const quote = computeQuote(catalog, settings, items, carrier);
    if (rawCarrier !== undefined && rawCarrier !== null && !carrier) quote.errors.push({ code: "unknown-carrier" });
    quote.errors.unshift(...errors);
    return NextResponse.json(quote, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    await logError("api/quote", e);
    return NextResponse.json({ error: "indisponible" }, { status: 500 });
  }
}
