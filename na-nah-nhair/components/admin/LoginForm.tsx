"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";
import { adminTexts as t } from "@/content/site";

export default function LoginForm({ withTotp }: { withTotp: boolean }) {
  const [state, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="mt-8 grid gap-4">
      <label className="grid gap-1 font-bold text-deep-violet">
        {t.login.password}
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="h-12 rounded-2xl border-2 border-deep-violet px-4 font-normal text-ink"
        />
      </label>
      {withTotp && (
        <label className="grid gap-1 font-bold text-deep-violet">
          {t.login.totp}
          <input
            name="totp"
            inputMode="numeric"
            pattern="[0-9 ]{6,7}"
            required
            autoComplete="one-time-code"
            className="h-12 rounded-2xl border-2 border-deep-violet px-4 font-normal tracking-[0.3em] text-ink"
          />
        </label>
      )}
      {state?.error && (
        <p role="alert" className="font-bold text-luxurious-deep">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="min-h-12 rounded-full bg-deep-violet px-6 py-3 text-sm font-bold uppercase text-white hover:bg-plum disabled:opacity-60"
      >
        {t.login.submit}
      </button>
    </form>
  );
}
