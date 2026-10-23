import { NextResponse } from "next/server";
import { readLimited } from "@/lib/http";
import { computeQuote, sanitizeCart } from "@/lib/pricing";
import type { CarrierId } from "@/lib/settings";
import { getCatalog, getSettings, logError } from "@/lib/store";

export const dynamic = "force-dynamic";

// Calcul qui fait foi : prix lus en base, jamais ceux envoyés par le navigateur
const MAX_BODY_BYTES = 5000;

export async function POST(request: Request) {
  // Taille contrôlée avant toute lecture du JSON
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > MAX_BODY_BYTES) return NextResponse.json({ error: "requête trop grande" }, { status: 413 });
  let body: unknown;
  try {
    const text = await readLimited(request, MAX_BODY_BYTES);
    if (text === null) return NextResponse.json({ error: "requête trop grande" }, { status: 413 });
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "requête invalide" }, { status: 400 });
  }

  try {
    const { items, errors } = sanitizeCart((body as { items?: unknown })?.items);
    const rawCarrier = (body as { carrier?: unknown })?.carrier;
    const carrier = rawCarrier === "colissimo" || rawCarrier === "mondial-relay" ? (rawCarrier as CarrierId) : null;
    const [catalog, settings] = await Promise.all([getCatalog(), getSettings()]);
    const quote = computeQuote(catalog, settings, items, carrier);
    if (rawCarrier !== undefined && rawCarrier !== null && !carrier) quote.errors.push({ code: "unknown-carrier" });
    quote.errors.unshift(...errors.filter((e) => e.code !== "empty-cart"));
    return NextResponse.json(quote, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    await logError("api/quote", e);
    return NextResponse.json({ error: "indisponible" }, { status: 500 });
  }
}
