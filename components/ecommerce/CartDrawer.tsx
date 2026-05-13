"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { products } from "@/data/products";
import { formatPrice, useCart } from "./CartProvider";

export default function CartDrawer() {
  const pathname = usePathname();
  const {
    closeCart,
    decrement,
    increment,
    isCartOpen,
    lines,
    removeItem,
    subtotalCents,
    totalItems,
  } = useCart();

  useEffect(() => {
    closeCart();
  }, [closeCart, pathname]);

  if (!isCartOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 transition"
    >
      <button
        aria-label="Fermer le panier"
        className="absolute inset-0 bg-[var(--color-ink)]/35 transition-opacity"
        onClick={closeCart}
        type="button"
      />
      <aside
        className="absolute right-0 top-0 flex h-full w-full max-w-[430px] flex-col bg-white shadow-[-20px_0_60px_rgba(53,32,95,0.18)]"
        role="dialog"
        aria-modal="true"
        aria-label="Panier"
      >
        <header className="flex items-center justify-between border-b border-[var(--color-lavender-mist)] p-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--color-plum)]">
              Ton panier
            </p>
            <h2 className="mt-1 text-2xl font-black text-[var(--color-deep-violet)]">
              {totalItems} article{totalItems > 1 ? "s" : ""}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="grid h-11 w-11 place-items-center rounded-full bg-[var(--color-lavender-soft)] text-[var(--color-deep-violet)]"
            type="button"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col p-5">
            <div className="rounded-[2rem] bg-[var(--color-lavender-soft)] p-6 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white text-[var(--color-deep-violet)]">
                <ShoppingBag size={24} />
              </div>
              <h3 className="mt-5 text-2xl font-black text-[var(--color-deep-violet)]">
                Ton panier est vide
              </h3>
              <p className="mt-3 leading-7 text-[var(--color-ink)]">
                Découvre nos sérums et compose ton mix capillaire.
              </p>
            </div>

            <div className="mt-6">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[var(--color-plum)]">
                Indispensables
              </p>
              <div className="mt-3 grid gap-3">
                {products.slice(0, 3).map((product) => (
                  <Link
                    key={product.id}
                    href={`/produits/${product.id}`}
                    onClick={closeCart}
                    className="rounded-2xl border border-[var(--color-lavender-mist)] p-4 font-black text-[var(--color-deep-violet)]"
                  >
                    {product.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-5">
              <div className="grid gap-4">
                {lines.map((line) => (
                  <article
                    key={line.id}
                    className="grid grid-cols-[82px_1fr] gap-4 rounded-[1.5rem] border border-[var(--color-lavender-mist)] p-3"
                  >
                    <div className="relative h-24 overflow-hidden rounded-[1.2rem] bg-[var(--color-lavender-soft)]">
                      {line.image ? (
                        <Image
                          src={line.image}
                          alt={line.imageAlt ?? line.name}
                          fill
                          sizes="82px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="grid h-full place-items-center">
                          <ShoppingBag size={22} className="text-[var(--color-deep-violet)]" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-black leading-5 text-[var(--color-deep-violet)]">
                            {line.name}
                          </h3>
                          <p className="mt-1 text-sm font-bold text-[var(--color-plum)]">
                            {line.price}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(line.id)}
                          className="text-[var(--color-plum)]"
                          type="button"
                          aria-label={`Retirer ${line.name}`}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="flex items-center overflow-hidden rounded-full border border-[var(--color-lavender-mist)]">
                          <button
                            onClick={() => decrement(line.id)}
                            className="grid h-9 w-9 place-items-center text-[var(--color-deep-violet)]"
                            type="button"
                            aria-label={`Réduire ${line.name}`}
                          >
                            <Minus size={15} />
                          </button>
                          <span className="min-w-8 text-center text-sm font-black text-[var(--color-deep-violet)]">
                            {line.quantity}
                          </span>
                          <button
                            onClick={() => increment(line.id)}
                            className="grid h-9 w-9 place-items-center text-[var(--color-deep-violet)]"
                            type="button"
                            aria-label={`Ajouter ${line.name}`}
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                        <p className="font-black text-[var(--color-deep-violet)]">
                          {formatPrice(line.priceCents * line.quantity)}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <footer className="border-t border-[var(--color-lavender-mist)] p-5">
              <div className="mb-4 rounded-2xl bg-[var(--color-lavender-soft)] p-4">
                <div className="flex justify-between gap-4 text-lg font-black text-[var(--color-deep-violet)]">
                  <span>Sous-total</span>
                  <span>{formatPrice(subtotalCents)}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--color-ink)]">
                  Livraison et code NNH26 calculés au checkout final.
                </p>
              </div>
              <Link
                href="/panier"
                onClick={closeCart}
                className="block rounded-full bg-[var(--color-lavender)] px-6 py-4 text-center font-black text-white"
              >
                Voir le panier
              </Link>
              <button
                className="mt-3 w-full rounded-full border border-[var(--color-lavender)] px-6 py-3 font-black text-[var(--color-deep-violet)] transition hover:bg-[var(--color-lavender-soft)]"
                type="button"
              >
                Procéder au paiement
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
