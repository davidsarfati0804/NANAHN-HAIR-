"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { formatPrice, useCart } from "./CartProvider";

export default function CartPageClient() {
  const { clearCart, decrement, increment, lines, removeItem, subtotalCents } = useCart();
  const shippingLabel = subtotalCents > 0 ? "À configurer" : "0,00 €";

  return (
    <main className="bg-white px-5 py-12 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-plum)]">
              Panier
            </p>
            <h1 className="mt-3 text-4xl font-black text-[var(--color-deep-violet)] md:text-6xl">
              Ton mix avant checkout
            </h1>
          </div>
          <Link
            href="/#boutique"
            className="rounded-full border border-[var(--color-lavender)] px-6 py-3 text-center font-black text-[var(--color-deep-violet)] transition hover:bg-[var(--color-lavender-soft)]"
          >
            Continuer le shopping
          </Link>
        </div>

        {lines.length === 0 ? (
          <div className="rounded-[2rem] bg-[var(--color-lavender-soft)] p-8 text-center md:p-12">
            <h2 className="text-3xl font-black text-[var(--color-deep-violet)]">
              Ton panier est vide
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-7 text-[var(--color-ink)]">
              Ajoute un sérum ou le pack zéro prise de tête pour préparer ta commande.
            </p>
            <Link
              href="/#boutique"
              className="mt-7 inline-flex rounded-full bg-[var(--color-lavender)] px-7 py-4 font-black text-white"
            >
              Découvrir les sérums
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <section className="grid gap-4">
              {lines.map((line) => (
                <article
                  key={line.id}
                  className="grid gap-5 rounded-[2rem] border border-[var(--color-lavender-mist)] bg-white p-5 shadow-[0_16px_36px_rgba(53,32,95,0.07)] sm:grid-cols-[110px_1fr_auto]"
                >
                  <div className="relative h-28 overflow-hidden rounded-[1.4rem] bg-[var(--color-lavender-soft)] text-[var(--color-deep-violet)]">
                    {line.image ? (
                      <Image
                        src={line.image}
                        alt={line.imageAlt ?? line.name}
                        fill
                        sizes="110px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="grid h-full place-items-center">
                        <ShoppingBag size={24} />
                      </div>
                    )}
                  </div>

                  <div>
                    <h2 className="text-2xl font-black text-[var(--color-deep-violet)]">
                      {line.name}
                    </h2>
                    <p className="mt-2 font-bold text-[var(--color-plum)]">{line.price}</p>
                    <button
                      onClick={() => removeItem(line.id)}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--color-plum)]"
                      type="button"
                    >
                      <Trash2 size={16} />
                      Retirer
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <div className="flex items-center overflow-hidden rounded-full border border-[var(--color-lavender-mist)]">
                      <button
                        onClick={() => decrement(line.id)}
                        className="grid h-10 w-10 place-items-center text-[var(--color-deep-violet)]"
                        type="button"
                        aria-label={`Réduire ${line.name}`}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="min-w-10 text-center font-black text-[var(--color-deep-violet)]">
                        {line.quantity}
                      </span>
                      <button
                        onClick={() => increment(line.id)}
                        className="grid h-10 w-10 place-items-center text-[var(--color-deep-violet)]"
                        type="button"
                        aria-label={`Ajouter ${line.name}`}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <p className="text-xl font-black text-[var(--color-deep-violet)]">
                      {formatPrice(line.priceCents * line.quantity)}
                    </p>
                  </div>
                </article>
              ))}
            </section>

            <aside className="h-fit rounded-[2rem] bg-[var(--color-deep-violet)] p-6 text-white shadow-[0_18px_45px_rgba(53,32,95,0.18)]">
              <h2 className="text-2xl font-black">Résumé</h2>
              <div className="mt-6 grid gap-4 text-sm">
                <div className="flex justify-between gap-4 border-b border-white/15 pb-4">
                  <span className="text-white/75">Sous-total</span>
                  <span className="font-black">{formatPrice(subtotalCents)}</span>
                </div>
                <div className="flex justify-between gap-4 border-b border-white/15 pb-4">
                  <span className="text-white/75">Livraison</span>
                  <span className="font-black">{shippingLabel}</span>
                </div>
                <div className="flex justify-between gap-4 text-xl">
                  <span className="font-black">Total provisoire</span>
                  <span className="font-black">{formatPrice(subtotalCents)}</span>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-white/10 p-4">
                <p className="text-sm font-black">Code promo</p>
                <p className="mt-1 text-sm text-white/75">
                  TODO: connecter le code NNH26 au checkout final.
                </p>
              </div>

              <button
                className="mt-6 w-full rounded-full bg-white px-6 py-4 font-black text-[var(--color-deep-violet)]"
                type="button"
              >
                Checkout à connecter
              </button>
              <button
                onClick={clearCart}
                className="mt-3 w-full rounded-full border border-white/30 px-6 py-3 font-bold text-white"
                type="button"
              >
                Vider le panier
              </button>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
