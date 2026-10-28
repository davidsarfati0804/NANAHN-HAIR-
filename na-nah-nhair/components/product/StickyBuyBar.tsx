"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { useCatalog } from "@/components/cart/useCatalog";
import { fromPublic } from "@/lib/catalog";
import { MAX_QUANTITY_PER_LINE, maxAddable } from "@/lib/pricing";
import { shop as texts } from "@/content/site";
import type { ProductId } from "@/lib/catalog";

// Barre d'achat fixée en bas sur téléphone : visible quand le bouton « Ajouter au panier »
// de la fiche n'est plus à l'écran. Masquée à partir de 768 px.
export default function StickyBuyBar({
  id,
  name,
  price,
  available,
  targetId,
  buttonClassName,
}: {
  id: ProductId;
  name: string;
  price: string;
  available: number | null;
  targetId: string;
  buttonClassName: string;
}) {
  const { add, items } = useCart();
  const { data } = useCatalog();
  // Même limite que le bouton de la fiche : stock restant, sérums déjà dans un pack compris
  const inCart = items.find((i) => i.id === id)?.quantity ?? 0;
  const max = data
    ? maxAddable(fromPublic(data.products), items, id)
    : Math.min(MAX_QUANTITY_PER_LINE, available === null ? MAX_QUANTITY_PER_LINE : available) - inCart;
  const canAdd = max >= 1;
  const [visible, setVisible] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    const observer = new IntersectionObserver(([e]) => setVisible(!e.isIntersecting && e.boundingClientRect.top < 0));
    observer.observe(target);
    return () => observer.disconnect();
  }, [targetId]);

  if (available === 0) return null;
  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-lavender bg-white px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] transition-transform duration-200 motion-reduce:transition-none md:hidden ${
        visible ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
    >
      <p className="min-w-0 leading-tight">
        <span className="block truncate text-sm font-bold">{name}</span>
        <span className="font-display text-2xl">{price}</span>
      </p>
      <button
        type="button"
        tabIndex={visible ? 0 : -1}
        disabled={!canAdd}
        onClick={() => {
          if (!canAdd) return;
          add(id, 1);
          setAdded(true);
        }}
        className={`${buttonClassName} shrink-0 px-5 disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {added ? texts.added : texts.addToCart}
      </button>
    </div>
  );
}
