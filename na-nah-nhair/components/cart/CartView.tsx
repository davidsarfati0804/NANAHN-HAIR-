"use client";

import Link from "next/link";
import ButtonLink from "@/components/ButtonLink";
import { useCart } from "@/components/cart/CartProvider";
import { productHref, productName } from "@/components/cart/names";
import { useCatalog } from "@/components/cart/useCatalog";
import { cartTexts as t } from "@/content/site";
import { formatPrice } from "@/lib/money";
import { computeQuote } from "@/lib/pricing";
import { seedCatalog } from "@/lib/catalog";

export default function CartView() {
  const { items, ready, setQuantity, remove } = useCart();
  const { data, error } = useCatalog();

  if (!ready || (!data && !error)) {
    return (
      <Shell>
        <p role="status">{t.loading}</p>
      </Shell>
    );
  }
  if (items.length === 0) {
    return (
      <Shell>
        <p className="text-lg">{t.empty}</p>
        <ButtonLink href={t.emptyCta.href} className="mt-6">
          {t.emptyCta.label}
        </ButtonLink>
      </Shell>
    );
  }
  if (!data) {
    return (
      <Shell>
        <p role="alert">Impossible de charger les prix. Réessaie dans un instant.</p>
      </Shell>
    );
  }

  // Affichage : même calcul que le serveur, avec les prix et stocks reçus du serveur
  const catalog = seedCatalog();
  for (const id of Object.keys(catalog) as Array<keyof typeof catalog>) {
    catalog[id] = { ...catalog[id], priceCents: data.products[id].priceCents };
  }
  const quote = computeQuote(catalog, data.settings, items);
  const errorFor = (id: string) => {
    const available = data.products[id as keyof typeof data.products].available;
    const line = items.find((i) => i.id === id)!;
    if (available === 0) return t.errors.unavailable;
    if (available !== null && line.quantity > available) return t.errors["insufficient-stock"](available);
    return null;
  };
  const blocked = items.some((i) => errorFor(i.id));

  return (
    <Shell>
      <ul className="divide-y divide-lavender-mist border-y border-lavender-mist">
        {quote.lines.map((line) => {
          const name = productName(line.id);
          const err = errorFor(line.id);
          const available = data.products[line.id].available;
          const max = Math.min(99, available ?? 99);
          return (
            <li key={line.id} className="flex flex-wrap items-center gap-4 py-5" data-testid={`ligne-${line.id}`}>
              <div className="min-w-48 flex-1">
                <Link href={productHref(line.id)} className="font-bold text-deep-violet underline-offset-4 hover:underline">
                  {name}
                </Link>
                <p className="text-sm">{formatPrice(line.unitCents)}</p>
                {err && (
                  <p role="alert" className="mt-1 text-sm font-bold text-luxurious-deep">
                    {err}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2" role="group" aria-label={`${t.quantityLabel} : ${name}`}>
                <button
                  type="button"
                  onClick={() => setQuantity(line.id, line.quantity - 1)}
                  className="h-10 w-10 rounded-full border-2 border-deep-violet font-bold text-deep-violet"
                  aria-label={`${t.decrease} : ${name}`}
                >
                  −
                </button>
                <span className="w-8 text-center font-bold" aria-live="polite" data-testid={`quantite-${line.id}`}>
                  {line.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(line.id, line.quantity + 1)}
                  disabled={line.quantity >= max}
                  className="h-10 w-10 rounded-full border-2 border-deep-violet font-bold text-deep-violet disabled:opacity-40"
                  aria-label={`${t.increase} : ${name}`}
                >
                  +
                </button>
              </div>
              <p className="w-24 text-right font-bold">{formatPrice(line.totalCents)}</p>
              <button
                type="button"
                onClick={() => remove(line.id)}
                className="text-sm font-bold text-plum underline underline-offset-4"
              >
                {t.remove}
                <span className="sr-only"> {name}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <dl className="ml-auto mt-6 grid max-w-sm grid-cols-2 gap-y-2">
        <dt>{t.subtotal}</dt>
        <dd className="text-right font-bold" data-testid="sous-total">
          {formatPrice(quote.subtotalCents)}
        </dd>
        <dt>{t.shipping}</dt>
        <dd className="text-right font-bold">{quote.freeShipping ? t.shippingFree : t.shippingTbd}</dd>
        <dt className="border-t border-lavender-mist pt-2 text-lg font-bold">{t.total}</dt>
        <dd className="border-t border-lavender-mist pt-2 text-right text-lg font-bold" data-testid="total">
          {formatPrice(quote.totalCents)}
        </dd>
      </dl>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <ButtonLink href="/boutique" variant="secondary">
          {t.continue}
        </ButtonLink>
        {blocked ? (
          <button type="button" disabled className="min-h-12 rounded-full bg-deep-violet px-6 py-3 text-sm font-bold uppercase text-white opacity-50">
            {t.checkout}
          </button>
        ) : (
          <ButtonLink href="/commande">{t.checkout}</ButtonLink>
        )}
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <h1 className="mb-8 text-7xl text-deep-violet sm:text-8xl">{t.title}</h1>
      {children}
    </div>
  );
}
