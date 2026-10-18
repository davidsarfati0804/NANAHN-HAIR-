import { NextResponse } from "next/server";
import { toPublic } from "@/lib/catalog";
import { getCatalog, getSettings, logError } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [catalog, settings] = await Promise.all([getCatalog(), getSettings()]);
    return NextResponse.json(
      { products: toPublic(catalog), settings },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    await logError("api/catalog", e);
    return NextResponse.json({ error: "indisponible" }, { status: 500 });
  }
}
