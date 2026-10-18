"use client";

import Link from "next/link";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { type ContactState, sendContact } from "@/app/contact/actions";
import { contactTexts as t } from "@/content/site";

export default function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, null);
  const [startedAt, setStartedAt] = useState(0);
  const form = useRef<HTMLFormElement>(null);
  const status = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- heure d'affichage du formulaire (anti-spam)
  useEffect(() => setStartedAt(Date.now()), []);
  useEffect(() => {
    if (state?.ok) form.current?.reset();
    if (state) status.current?.focus();
  }, [state]);

  const err = state?.fieldErrors ?? {};
  const field = "mt-1 w-full rounded-2xl border-2 border-deep-violet bg-white px-4 py-3 text-ink aria-[invalid=true]:border-luxurious-deep";

  return (
    <form
      ref={form}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => action(data));
      }}
      className="grid gap-5"
    >
      <div ref={status} tabIndex={-1} role="status" aria-live="polite" className="outline-none">
        {state?.ok && <p className="rounded-2xl bg-fabulous-soft p-4 font-bold text-fabulous-deep">{t.success}</p>}
        {state?.error && <p className="rounded-2xl bg-luxurious-soft p-4 font-bold text-luxurious-deep">{state.error}</p>}
      </div>

      {/* Champ piège invisible pour les robots */}
      <div aria-hidden className="absolute -left-[9999px] h-0 overflow-hidden">
        <label>
          Site web
          <input name="site_web" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <input type="hidden" name="debut" value={startedAt} />

      <label className="font-bold text-deep-violet">
        {t.name}
        <input name="name" autoComplete="name" required maxLength={100} aria-invalid={Boolean(err.name)} aria-describedby={err.name ? "name-erreur" : undefined} className={field} />
        <FieldError name="name" errors={err} />
      </label>
      <label className="font-bold text-deep-violet">
        {t.email}
        <input name="email" type="email" autoComplete="email" required maxLength={254} aria-invalid={Boolean(err.email)} aria-describedby={err.email ? "email-erreur" : undefined} className={field} />
        <FieldError name="email" errors={err} />
      </label>
      <label className="font-bold text-deep-violet">
        {t.subject}
        <select name="subject" required defaultValue="" aria-invalid={Boolean(err.subject)} aria-describedby={err.subject ? "subject-erreur" : undefined} className={field}>
          <option value="" disabled>
            —
          </option>
          {t.subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <FieldError name="subject" errors={err} />
      </label>
      <label className="font-bold text-deep-violet">
        {t.message}
        <textarea name="message" required rows={6} maxLength={3000} aria-invalid={Boolean(err.message)} aria-describedby={err.message ? "message-erreur" : undefined} className={field} />
        <FieldError name="message" errors={err} />
      </label>
      <p className="text-sm">
        <Link href="/confidentialite" className="underline underline-offset-4">
          {t.privacy}
        </Link>
      </p>
      <button
        type="submit"
        disabled={pending || !startedAt}
        className="min-h-12 rounded-full bg-deep-violet px-8 py-3 text-sm font-bold uppercase text-white hover:bg-plum disabled:opacity-60 sm:justify-self-start"
      >
        {pending ? t.sending : t.submit}
      </button>
    </form>
  );
}

function FieldError({ name, errors }: { name: string; errors: Record<string, string> }) {
  if (!errors[name]) return null;
  return (
    <span id={`${name}-erreur`} className="mt-1 block text-sm font-bold text-luxurious-deep">
      {errors[name]}
    </span>
  );
}
