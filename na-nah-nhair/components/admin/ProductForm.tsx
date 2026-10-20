"use client";

import { startTransition, useActionState } from "react";
import { type FormState, updateProduct } from "@/app/admin/actions";
import { adminTexts as t } from "@/content/site";
import type { CatalogProduct } from "@/lib/catalog";

export default function ProductForm({ product, name }: { product: CatalogProduct; name: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(updateProduct, null);
  const price = (product.priceCents / 100).toFixed(2).replace(".", ",");
  const field = "h-11 rounded-2xl border-2 border-deep-violet bg-white px-3 text-deep-violet";

  return (
    <form
      // Soumission manuelle : en cas d'erreur, les saisies restent affichées (pas de remise à zéro du formulaire)
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => action(data));
      }}
      className="rounded-3xl border-2 border-lavender p-5" aria-label={name}>
      <input type="hidden" name="id" value={product.id} />
      <h2 className="titre-h3">{name}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-bold">
          {t.products.price}
          <input name="price" defaultValue={price} inputMode="decimal" required className={field} />
        </label>
        {product.id === "pack" ? (
          <p className="text-sm">{t.products.packStock}</p>
        ) : (
          <label className="grid gap-1 text-sm font-bold">
            {t.products.stock}
            <input name="stock" defaultValue={product.stock ?? ""} inputMode="numeric" className={field} />
            <span className="font-normal">{t.products.stockHelp}</span>
          </label>
        )}
        <label className="flex items-center gap-2 text-sm font-bold">
          <input type="checkbox" name="active" defaultChecked={product.active} className="h-5 w-5 accent-deep-violet" />
          {t.products.available}
        </label>
        <label className="grid gap-1 text-sm font-bold">
          {t.products.photo}
          <input name="photo" type="file" accept="image/jpeg,image/png,image/webp" className="text-sm font-normal" />
        </label>
        {product.photoKey && (
          <div className="flex items-center gap-3 text-sm">
            {/* eslint-disable-next-line @next/next/no-img-element -- aperçu du back-office */}
            <img src={`/media/${product.photoKey}`} alt="" className="h-16 w-16 rounded-xl object-cover" />
            <label className="flex items-center gap-2 font-bold">
              <input type="checkbox" name="removePhoto" className="h-5 w-5 accent-deep-violet" />
              {t.products.removePhoto}
            </label>
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="min-h-11 rounded-full bg-deep-violet px-6 py-2 text-sm font-bold uppercase text-white hover:bg-plum disabled:opacity-60"
        >
          {t.products.save}
        </button>
        <p role="status" aria-live="polite" className={`text-sm font-bold ${state?.error ? "text-luxurious-deep" : "text-fabulous-deep"}`}>
          {state?.error ?? (state?.ok ? t.saved : "")}
        </p>
      </div>
    </form>
  );
}
