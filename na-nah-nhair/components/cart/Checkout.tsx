"use client";

import { useEffect, useState } from "react";
import ButtonLink from "@/components/ButtonLink";
import { useCart } from "@/components/cart/CartProvider";
import { productName } from "@/components/cart/names";
import { useCatalog } from "@/components/cart/useCatalog";
import ToComplete from "@/components/ToComplete";
import { cartTexts, checkoutTexts as t, legal } from "@/content/site";
import { formatPrice } from "@/lib/money";
import type { Quote } from "@/lib/pricing";
import type { CarrierId } from "@/lib/settings";

const ADDRESS_FIELDS = ["firstName", "lastName", "email", "address", "postalCode", "city"] as const;
type AddressField = (typeof ADDRESS_FIELDS)[number];
const autoComplete: Record<AddressField, string> = {
  firstName: "given-name",
  lastName: "family-name",
  email: "email",
  address: "street-address",
  postalCode: "postal-code",
  city: "address-level2",
};

export default function Checkout() {
  const { items, ready } = useCart();
  const { data } = useCatalog();
  const [carrier, setCarrier] = useState<CarrierId | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [failed, setFailed] = useState(false);
  const [address, setAddress] = useState<Record<AddressField, string>>({ firstName: "", lastName: "", email: "", address: "", postalCode: "", city: "" });
  const [badFields, setBadFields] = useState<string[]>([]);
  const [cgv, setCgv] = useState(false);
  const [cgvError, setCgvError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ orderNumber: string; cgvVersion: string } | null>(null);
  const [submitError, setSubmitError] = useState(false);

  const submit = async () => {
    setSubmitError(false);
    if (!cgv) {
      setCgvError(true);
      return;
    }
    setSubmitting(true);
    try {
      const r = await fetch("/api/commande", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, carrier, address, acceptCgv: cgv }),
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok) setResult({ orderNumber: data.orderNumber, cgvVersion: data.cgvVersion });
      else if (data.error === "cgv") setCgvError(true);
      else if (data.error === "adresse") setBadFields(data.fields ?? []);
      else setSubmitError(true);
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

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
  const free = quote?.freeShipping ?? true;
  // Livraison payante : seuls les transporteurs dont le tarif est connu sont proposés
  const offered = carriers.filter(([, c]) => c.active && (free || c.priceCents !== null));
  const lineErrors = (quote?.errors ?? []).flatMap((e) => {
    if (e.code === "insufficient-stock") return [t.lineError(productName(e.id), cartTexts.errors["insufficient-stock"](e.available))];
    if (e.code === "unavailable") return [t.lineError(productName(e.id), cartTexts.errors.unavailable)];
    return [];
  });
  const carrierError = quote?.errors.some((e) => e.code === "carrier-price-missing" || e.code === "unknown-carrier");

  return (
    <Shell>
      <div className="grid gap-10 md:grid-cols-[1.2fr_1fr]">
        <section aria-labelledby="livraison">
          <h2 id="livraison" className="titre-h2">
            {t.carrierTitle}
          </h2>
          <p className="mt-1 text-sm">{t.delay}</p>
          <fieldset className="mt-4 grid gap-3">
            <legend className="sr-only">{t.carrierTitle}</legend>
            {data && offered.length === 0 && <p role="alert">{t.noCarrier}</p>}
            {offered.map(([id, c]) => (
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
          {carrierError && (
            <p role="alert" className="mt-3 font-bold text-luxurious-deep">
              {t.carrierPriceMissing}
            </p>
          )}
          {carrier === "mondial-relay" && (
            <div className="mt-4 rounded-3xl border-2 border-lavender p-5">
              <h3 className="titre-h3">{t.relayTitle}</h3>
              <ToComplete label="sélection du point relais (identifiants du compte Mondial Relay)" className="mt-2" />
            </div>
          )}

          <h2 id="adresse" className="mt-10 titre-h2">
            {t.addressTitle}
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {ADDRESS_FIELDS.map((k) => (
              <label key={k} className={`flex flex-col text-sm font-bold ${k === "email" || k === "address" ? "sm:col-span-2" : ""}`}>
                {t.fields[k]}
                <input
                  name={k}
                  type={k === "email" ? "email" : "text"}
                  inputMode={k === "postalCode" ? "numeric" : undefined}
                  autoComplete={autoComplete[k]}
                  required
                  value={address[k]}
                  aria-invalid={badFields.includes(k)}
                  onChange={(e) => {
                    setAddress({ ...address, [k]: e.target.value });
                    setBadFields(badFields.filter((f) => f !== k));
                  }}
                  className="mt-1 h-12 rounded-2xl border-2 border-deep-violet bg-white px-4 text-base font-normal text-deep-violet aria-[invalid=true]:border-luxurious-deep"
                />
              </label>
            ))}
          </div>
          {badFields.length > 0 && (
            <p role="alert" className="mt-3 font-bold text-luxurious-deep">
              {t.addressError}
            </p>
          )}
        </section>

        <section aria-labelledby="recap" className="rounded-[2rem] bg-lavender p-6 text-deep-violet">
          <h2 id="recap" className="titre-h2">
            {t.summaryTitle}
          </h2>
          {failed && <p role="alert">{t.quoteError}</p>}
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
                      : t.carrierRequired}
                </dd>
                <dt className="text-lg font-bold">{cartTexts.total}</dt>
                <dd className="text-right text-lg font-bold" data-testid="total-serveur">
                  {formatPrice(quote.totalCents)}
                </dd>
              </dl>
              {!data?.settings.vatApplicable && (
                <p className="mt-1 text-right text-sm" data-testid="mention-tva">
                  {legal.vatMention}
                </p>
              )}
              {lineErrors.map((msg) => (
                <p key={msg} role="alert" className="mt-3 font-bold">
                  {msg}
                </p>
              ))}
            </>
          )}

          {/* Récapitulatif avant paiement : adresse et délai de livraison */}
          <dl className="mt-4 space-y-2 border-t border-deep-violet/30 pt-4 text-sm">
            <div>
              <dt className="font-bold">{t.addressTitle}</dt>
              <dd data-testid="recap-adresse">
                {ADDRESS_FIELDS.every((k) => address[k].trim())
                  ? `${address.firstName} ${address.lastName}, ${address.address}, ${address.postalCode} ${address.city}`
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="font-bold">{t.delayLabel}</dt>
              <dd>{t.delayValue}</dd>
            </div>
          </dl>

          {/* Case non pré-cochée, juste avant le bouton de paiement */}
          <label className="mt-6 flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={cgv}
              onChange={(e) => {
                setCgv(e.target.checked);
                if (e.target.checked) setCgvError(false);
              }}
              aria-invalid={cgvError}
              aria-describedby={cgvError ? "cgv-erreur" : undefined}
              className="mt-0.5 h-6 w-6 shrink-0 accent-deep-violet"
            />
            <span>
              {t.cgvBefore}
              <a href="/cgv" target="_blank" rel="noopener" className="font-bold underline underline-offset-4">
                {t.cgvLink}
              </a>
              {t.cgvAfter}
            </span>
          </label>
          {cgvError && (
            <p id="cgv-erreur" role="alert" className="mt-2 text-sm font-bold text-luxurious-deep">
              {t.cgvError}
            </p>
          )}

          <p className="mt-4 text-sm">
            {t.withdrawal.text}
            <a href="/cgv" target="_blank" rel="noopener" className="font-bold underline underline-offset-4">
              {t.withdrawal.cgv}
            </a>
            {t.withdrawal.and}
            <a href="/retractation" target="_blank" rel="noopener" className="font-bold underline underline-offset-4">
              {t.withdrawal.page}
            </a>
            {t.withdrawal.end}
          </p>
          <button
            type="button"
            onClick={submit}
            disabled={submitting || !quote || !carrier || lineErrors.length > 0 || !!result}
            aria-describedby="paiement-info"
            className="mt-4 bouton bouton--principal w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {t.pay}
          </button>
          <p id="paiement-info" role="status" className="mt-2 text-sm">
            {!carrier && offered.length > 0 ? `${t.carrierRequired} ` : ""}
            {result ? `${t.accepted(result.orderNumber, result.cgvVersion)} ` : ""}
            {t.paymentPending}
          </p>
          {submitError && (
            <p role="alert" className="mt-2 text-sm font-bold text-luxurious-deep">
              {t.submitError}
            </p>
          )}
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
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="mb-8 titre-h1">{t.title}</h1>
      {children}
    </div>
  );
}
