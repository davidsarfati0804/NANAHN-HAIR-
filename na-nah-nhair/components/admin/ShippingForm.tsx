"use client";

import { startTransition, useActionState } from "react";
import { type FormState, updateShipping } from "@/app/admin/actions";
import { adminTexts as t } from "@/content/site";
import type { CarrierId, ShopSettings } from "@/lib/settings";

const euros = (c: number | null) => (c === null ? "" : (c / 100).toFixed(2).replace(".", ","));

export default function ShippingForm({ settings }: { settings: ShopSettings }) {
  const [state, action, pending] = useActionState<FormState, FormData>(updateShipping, null);
  const field = "h-11 rounded-2xl border-2 border-deep-violet bg-white px-3 text-ink";
  return (
    <form
      // Soumission manuelle : en cas d'erreur, les saisies restent affichées (pas de remise à zéro du formulaire)
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => action(data));
      }}
      className="mt-8 grid gap-6">
      <label className="grid max-w-sm gap-1 text-sm font-bold">
        {t.shipping.threshold}
        <input name="threshold" defaultValue={euros(settings.freeShippingThresholdCents)} inputMode="decimal" required className={field} />
        <span className="font-normal">{t.shipping.thresholdHelp}</span>
      </label>
      {(Object.entries(settings.carriers) as Array<[CarrierId, ShopSettings["carriers"][CarrierId]]>).map(([id, c]) => (
        <fieldset key={id} className="rounded-3xl border-2 border-lavender-mist p-5">
          <legend className="px-2 font-bold text-deep-violet">{c.label}</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1 text-sm font-bold">
              {t.shipping.carrierPrice}
              <input name={`price-${id}`} defaultValue={euros(c.priceCents)} inputMode="decimal" className={field} />
              <span className="font-normal">{t.shipping.carrierPriceHelp}</span>
            </label>
            <label className="flex items-center gap-2 text-sm font-bold">
              <input type="checkbox" name={`active-${id}`} defaultChecked={c.active} className="h-5 w-5 accent-deep-violet" />
              {t.shipping.carrierActive}
            </label>
          </div>
        </fieldset>
      ))}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="min-h-11 rounded-full bg-deep-violet px-6 py-2 text-sm font-bold uppercase text-white hover:bg-plum disabled:opacity-60"
        >
          {t.shipping.save}
        </button>
        <p role="status" aria-live="polite" className={`text-sm font-bold ${state?.error ? "text-luxurious-deep" : "text-fabulous-deep"}`}>
          {state?.error ?? (state?.ok ? t.saved : "")}
        </p>
      </div>
    </form>
  );
}
