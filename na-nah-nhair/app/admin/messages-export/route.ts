import { isAdmin } from "@/lib/auth";
import { getContactMessages } from "@/lib/store";

export const dynamic = "force-dynamic";

// Export CSV des messages (droit d'accès RGPD, archivage)
export async function GET() {
  if (!(await isAdmin())) return new Response("Accès refusé", { status: 401 });
  const rows = (await getContactMessages()).map((m) => [m.at, m.name, m.email, m.subject, m.message]);
  // Les cellules commençant par = + - @ sont neutralisées (injection de formules dans Excel)
  const cell = (v: string) => `"${(/^[=+\-@]/.test(v) ? `'${v}` : v).replace(/"/g, '""')}"`;
  const csv = [["date", "nom", "email", "sujet", "message"], ...rows].map((r) => r.map(cell).join(";")).join("\r\n");
  return new Response(`﻿${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="messages-na-nah-nhair.csv"',
      "Cache-Control": "no-store",
    },
  });
}
