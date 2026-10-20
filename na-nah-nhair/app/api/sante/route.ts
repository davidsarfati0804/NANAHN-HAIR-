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
      // Présence (oui/non) des variables fournies par Netlify, sans leur valeur
      environnementNetlify: {
        NETLIFY_BLOBS_CONTEXT: Boolean(process.env.NETLIFY_BLOBS_CONTEXT),
        contexteGlobal: Boolean((globalThis as { netlifyBlobsContext?: unknown }).netlifyBlobsContext),
        SITE_ID: Boolean(process.env.SITE_ID),
      },
      backOfficeConfigure: Boolean(process.env.ADMIN_PASSWORD_HASH && process.env.ADMIN_SESSION_SECRET),
      dureeTotaleMs: Date.now() - started,
      date: new Date().toISOString(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
