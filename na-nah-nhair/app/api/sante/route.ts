import { NextResponse } from "next/server";
import { adminConfig, isAdmin } from "@/lib/auth";
import { deployBranch, deployContext, storeName } from "@/lib/deploy";
import { storeDeepCheck, storeHealth } from "@/lib/store";

export const dynamic = "force-dynamic";

// Page de diagnostic : /api/sante. Publique : l'état seulement (pour la surveillance du site).
// Le détail (contexte, stockage, back-office, ?detail=1) est réservé au back-office connecté.
export async function GET(request: Request) {
  const started = Date.now();
  const store = await storeHealth();
  const headers = { "Cache-Control": "no-store" };
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: store.lectureOk, administrationActivee: adminConfig().configured, dureeTotaleMs: Date.now() - started, date: new Date().toISOString() }, { headers });
  }
  const detail = new URL(request.url).searchParams.get("detail") === "1";
  return NextResponse.json(
    {
      ok: store.lectureOk,
      contexte: deployContext(),
      branche: deployBranch() || null,
      magasin: storeName(),
      noeud: process.version,
      stockage: store,
      // Présence (oui/non) des variables fournies par Netlify, sans leur valeur
      environnementNetlify: {
        NETLIFY_BLOBS_CONTEXT: Boolean(process.env.NETLIFY_BLOBS_CONTEXT),
        contexteGlobal: Boolean((globalThis as { netlifyBlobsContext?: unknown }).netlifyBlobsContext),
        SITE_ID: Boolean(process.env.SITE_ID),
      },
      backOfficeConfigure: adminConfig().configured,
      ...(detail ? { diagnosticBlobs: await storeDeepCheck() } : {}),
      dureeTotaleMs: Date.now() - started,
      date: new Date().toISOString(),
    },
    { headers },
  );
}
