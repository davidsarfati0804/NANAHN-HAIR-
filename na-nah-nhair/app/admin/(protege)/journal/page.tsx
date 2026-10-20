import { requireAdmin } from "@/lib/auth";
import { adminTexts as t } from "@/content/site";
import { type AuditEntry, getAudit, getErrors } from "@/lib/store";

export default async function AdminJournalPage() {
  await requireAdmin(); // chaque page vérifie elle-même : le layout ne suffit pas
  const [audit, errors] = await Promise.all([getAudit(), getErrors()]);
  return (
    <div>
      <h1 className="titre-h1">{t.journal.title}</h1>
      <Log title={t.journal.audit} entries={audit} />
      <Log title={t.journal.errors} entries={errors} />
    </div>
  );
}

function Log({ title, entries }: { title: string; entries: AuditEntry[] }) {
  return (
    <section className="mt-8">
      <h2 className="titre-h3">{title}</h2>
      {entries.length === 0 ? (
        <p className="mt-2">{t.journal.empty}</p>
      ) : (
        <ol className="mt-2 divide-y divide-lavender rounded-3xl border-2 border-lavender text-sm">
          {entries.slice(0, 100).map((e, i) => (
            <li key={i} className="grid gap-1 px-4 py-2 sm:grid-cols-[12rem_8rem_1fr]">
              <time dateTime={e.at}>{new Date(e.at).toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}</time>
              <span className="font-bold">{e.action}</span>
              <span className="break-all">{e.detail}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
