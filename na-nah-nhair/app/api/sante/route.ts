import { NextResponse } from "next/server";
import { storeHealth } from "@/lib/store";

export const dynamic = "force-dynamic";

// Page de diagnostic : /api/sante (à ouvrir dans le navigateur et à copier en cas de problème)
export async function GET() {
  const started = Date.now();
  const store = await storeHealth();
  return NextResponse.json(
    {
      ok: store.lectureOk,
      contexte: process.env.CONTEXT ?? "local",
      branche: process.env.BRANCH ?? null,
      noeud: process.version,
      stockage: store,
      backOfficeConfigure: Boolean(process.env.ADMIN_PASSWORD_HASH && process.env.ADMIN_SESSION_SECRET),
      dureeTotaleMs: Date.now() - started,
      date: new Date().toISOString(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
