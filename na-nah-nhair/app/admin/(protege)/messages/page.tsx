import { removeMessage } from "@/app/admin/actions";
import { adminTexts as t } from "@/content/site";
import { requireAdmin } from "@/lib/auth";
import { getContactMessages } from "@/lib/store";

export default async function AdminMessagesPage() {
  await requireAdmin(); // chaque page vérifie elle-même : le layout ne suffit pas
  const messages = await getContactMessages();
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="titre-h1">{t.messages.title}</h1>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- téléchargement d'un fichier */}
        <a href="/admin/messages-export" className="inline-flex min-h-11 items-center rounded-full border-2 border-deep-violet px-5 text-sm font-bold text-deep-violet">
          {t.messages.export}
        </a>
      </div>
      {messages.length === 0 ? (
        <p className="mt-8">{t.messages.empty}</p>
      ) : (
        <ul className="mt-8 grid gap-4">
          {messages.map((m) => (
            <li key={m.id} className="rounded-3xl border-2 border-lavender p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-deep-violet">
                    {m.name} · <a href={`mailto:${m.email}`} className="underline underline-offset-4">{m.email}</a>
                  </p>
                  <p className="text-sm">
                    {m.subject} · <time dateTime={m.at}>{new Date(m.at).toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}</time>
                  </p>
                </div>
                <form action={removeMessage}>
                  <input type="hidden" name="id" value={m.id} />
                  <button type="submit" title={t.messages.rgpd} className="min-h-11 rounded-full bg-luxurious-deep px-4 text-sm font-bold text-white">
                    {t.messages.delete}
                  </button>
                </form>
              </div>
              <p className="mt-3 whitespace-pre-wrap break-words">{m.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
