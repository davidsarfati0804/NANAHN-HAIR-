"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { useCatalog } from "@/components/cart/useCatalog";
import { shop } from "@/content/site";
import { fromPublic, type ProductId } from "@/lib/catalog";
import { MAX_QUANTITY_PER_LINE, maxAddable } from "@/lib/pricing";

// Bouton « Ajouter au panier ». `available` vient du serveur (null = stock non suivi).
export default function AddToCart({
  id,
  name,
  available,
  withQuantity = false,
  className = "",
  buttonClassName = "bg-deep-violet text-white hover:bg-plum",
}: {
  id: ProductId;
  name: string;
  available: number | null;
  withQuantity?: boolean;
  className?: string;
  buttonClassName?: string;
}) {
  const { add, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const inputId = useId();

  const { data } = useCatalog();
  const inCart = items.find((i) => i.id === id)?.quantity ?? 0;
  // Avec le catalogue à jour : tient compte des sérums contenus dans les packs du panier
  const max = data
    ? maxAddable(fromPublic(data.products), items, id)
    : Math.min(MAX_QUANTITY_PER_LINE, available === null ? MAX_QUANTITY_PER_LINE : available) - inCart;
  const soldOut = available === 0;
  const canAdd = !soldOut && max >= 1;

  return (
    <div className={className}>
      {soldOut ? (
        <p className="inline-block rounded-full bg-deep-violet px-6 py-3 text-sm font-bold uppercase text-white">{shop.soldOut}</p>
      ) : (
        <form
          className="flex flex-wrap items-end gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!canAdd) return;
            add(id, Math.min(quantity, max));
            setQuantity(1);
            setAdded(true);
          }}
        >
          {withQuantity && (
            <label htmlFor={inputId} className="flex flex-col text-sm font-bold">
              {shop.quantity}
              <input
                id={inputId}
                type="number"
                inputMode="numeric"
                min={1}
                max={Math.max(1, max)}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(Number(e.target.value) || 1, Math.max(1, max))))}
                className="mt-1 h-12 w-20 rounded-full border-2 border-deep-violet bg-white px-3 text-center text-deep-violet"
              />
            </label>
          )}
          <button
            type="submit"
            disabled={!canAdd}
            className={`bouton disabled:cursor-not-allowed disabled:opacity-50 ${buttonClassName}`}
          >
            {shop.addToCart}
            <span className="sr-only"> : {name}</span>
          </button>
        </form>
      )}
      {available !== null && available > 0 && available <= 5 && (
        <p className="mt-2 text-sm font-bold">{shop.lowStock(available)}</p>
      )}
      <p role="status" aria-live="polite" className="mt-2 min-h-5 text-sm font-bold">
        {added && (
          <>
            {shop.added} ·{" "}
            <Link href="/panier" className="underline underline-offset-4">
              {shop.viewCart}
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
