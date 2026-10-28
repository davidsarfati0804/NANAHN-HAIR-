import { isAdmin } from "@/lib/auth";
import { appendAudit, backupAll } from "@/lib/store";

export const dynamic = "force-dynamic";

// Sauvegarde téléchargeable (fichier JSON) : catalogue, réglages, commandes, messages, journal…
// À faire juste avant la mise en ligne, puis chaque semaine (voir GUIDE.md)
export async function GET() {
  if (!(await isAdmin())) return new Response("Accès refusé", { status: 401 });
  const backup = await backupAll();
  await appendAudit("sauvegarde téléchargée", `${Object.keys(backup.donnees).length} éléments`);
  const day = backup.date.slice(0, 10);
  return new Response(JSON.stringify(backup, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="sauvegarde-na-nah-nhair-${day}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
