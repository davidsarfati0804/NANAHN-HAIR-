"use client";

import { useEffect, useState } from "react";
import ButtonLink from "@/components/ButtonLink";
import { useCart } from "@/components/cart/CartProvider";
import { productName } from "@/components/cart/names";
import { useCatalog } from "@/components/cart/useCatalog";
import ToComplete from "@/components/ToComplete";
import { cartTexts, checkoutTexts as t } from "@/content/site";
import { formatPrice } from "@/lib/money";
import type { Quote } from "@/lib/pricing";
import type { CarrierId } from "@/lib/settings";

export default function Checkout() {
  const { items, ready } = useCart();
  const { data } = useCatalog();
  const [carrier, setCarrier] = useState<CarrierId | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [failed, setFailed] = useState(false);

  // Le total affiché est celui calculé par le serveur
  useEffect(() => {
    if (!ready || items.length === 0) return;
    const controller = new AbortController();
    fetch("/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, carrier }),
      signal: controller.signal,
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((q: Quote) => {
        setQuote(q);
        setFailed(false);
      })
      .catch((e) => {
        if (controller.signal.aborted) return;
        console.error(e);
        setFailed(true);
      });
    return () => controller.abort();
  }, [items, carrier, ready]);

  if (ready && items.length === 0) {
    return (
      <Shell>
        <p className="text-lg">{cartTexts.empty}</p>
        <ButtonLink href={cartTexts.emptyCta.href} className="mt-6">
          {cartTexts.emptyCta.label}
        </ButtonLink>
      </Shell>
    );
  }

  const carriers = data ? (Object.entries(data.settings.carriers) as Array<[CarrierId, { label: string; priceCents: number | null; active: boolean }]>) : [];
  const stockProblem = quote?.errors.some((e) => e.code === "unavailable" || e.code === "insufficient-stock");

  return (
    <Shell>
      <div className="grid gap-10 md:grid-cols-[1.2fr_1fr]">
        <section aria-labelledby="livraison">
          <h2 id="livraison" className="text-4xl text-deep-violet">
            {t.carrierTitle}
          </h2>
          <p className="mt-1 text-sm">{t.delay}</p>
          <fieldset className="mt-4 grid gap-3">
            <legend className="sr-only">{t.carrierTitle}</legend>
            {carriers
              .filter(([, c]) => c.active)
              .map(([id, c]) => (
                <label
                  key={id}
                  className="flex cursor-pointer items-center justify-between gap-4 rounded-3xl border-2 border-deep-violet px-5 py-4 has-[:checked]:bg-lavender-soft"
                >
                  <span className="flex items-center gap-3 font-bold text-deep-violet">
                    <input
                      type="radio"
                      name="carrier"
                      value={id}
                      checked={carrier === id}
                      onChange={() => setCarrier(id)}
                      className="h-5 w-5 accent-deep-violet"
                    />
                    {c.label}
                  </span>
                  <span className="text-sm font-bold">
                    {quote?.freeShipping ? cartTexts.shippingFree : c.priceCents !== null ? formatPrice(c.priceCents) : ""}
                  </span>
                </label>
              ))}
          </fieldset>
          {carrier === "mondial-relay" && (
            <div className="mt-4 rounded-3xl border-2 border-lavender-mist p-5">
              <h3 className="font-body text-lg font-bold text-deep-violet">{t.relayTitle}</h3>
              <ToComplete label="sélection du point relais (identifiants du compte Mondial Relay)" className="mt-2" />
            </div>
          )}
        </section>

        <section aria-labelledby="recap" className="rounded-[2rem] bg-lavender p-6 text-deep-violet">
          <h2 id="recap" className="text-4xl">
            {t.summaryTitle}
          </h2>
          {failed && <p role="alert">Impossible de calculer le total. Réessaie dans un instant.</p>}
          {!quote && !failed && <p role="status">{cartTexts.loading}</p>}
          {quote && (
            <>
              <ul className="mt-4 space-y-2">
                {quote.lines.map((l) => (
                  <li key={l.id} className="flex justify-between gap-4">
                    <span>
                      {productName(l.id)} × {l.quantity}
                    </span>
                    <span className="font-bold">{formatPrice(l.totalCents)}</span>
                  </li>
                ))}
              </ul>
              <dl className="mt-4 grid grid-cols-2 gap-y-1 border-t border-deep-violet/30 pt-4">
                <dt>{cartTexts.subtotal}</dt>
                <dd className="text-right font-bold">{formatPrice(quote.subtotalCents)}</dd>
                <dt>{cartTexts.shipping}</dt>
                <dd className="text-right font-bold">
                  {quote.freeShipping
                    ? cartTexts.shippingFree
                    : quote.shippingCents !== null
                      ? formatPrice(quote.shippingCents)
                      : cartTexts.shippingTbd}
                </dd>
                <dt className="text-lg font-bold">{cartTexts.total}</dt>
                <dd className="text-right text-lg font-bold" data-testid="total-serveur">
                  {formatPrice(quote.totalCents)}
                </dd>
              </dl>
              <p className="mt-2 text-xs">{t.serverNote}</p>
              {stockProblem && (
                <p role="alert" className="mt-3 font-bold">
                  {cartTexts.errors.unavailable}
                </p>
              )}
            </>
          )}

          <button
            type="button"
            disabled
            aria-describedby="paiement-info"
            className="mt-6 min-h-12 w-full cursor-not-allowed rounded-full bg-deep-violet px-6 py-3 text-sm font-bold uppercase text-white opacity-60"
          >
            {t.pay}
          </button>
          <p id="paiement-info" className="mt-2 text-sm">
            {!carrier ? `${t.carrierRequired} ` : ""}
            {t.paymentPending}
          </p>
          <ButtonLink href="/panier" variant="secondary" className="mt-4 w-full">
            {t.backToCart}
          </ButtonLink>
        </section>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      <h1 className="mb-8 text-7xl text-deep-violet sm:text-8xl">{t.title}</h1>
      {children}
    </div>
  );
}
