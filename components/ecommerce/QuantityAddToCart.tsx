"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useCart } from "./CartProvider";

type Props = {
  item: {
    id: string;
    name: string;
    price: string;
    priceCents: number;
    image?: string;
    imageAlt?: string;
  };
};

export default function QuantityAddToCart({ item }: Props) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(item, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center overflow-hidden rounded-full border-2 border-[var(--color-lavender-mist)]">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="grid h-12 w-12 place-items-center text-[var(--color-deep-violet)] transition hover:bg-[var(--color-lavender-soft)] disabled:opacity-40"
          type="button"
          aria-label="Réduire la quantité"
          disabled={qty <= 1}
        >
          <Minus size={16} />
        </button>
        <span className="min-w-10 text-center font-black text-[var(--color-deep-violet)]">
          {qty}
        </span>
        <button
          onClick={() => setQty((q) => q + 1)}
          className="grid h-12 w-12 place-items-center text-[var(--color-deep-violet)] transition hover:bg-[var(--color-lavender-soft)]"
          type="button"
          aria-label="Augmenter la quantité"
        >
          <Plus size={16} />
        </button>
      </div>
      <button
        onClick={handleAdd}
        className="flex-1 rounded-full bg-[var(--color-lavender)] px-6 py-4 font-bold text-white transition hover:bg-[var(--color-plum)]"
        type="button"
      >
        {added ? "Ajouté au panier ✓" : "Ajouter au panier"}
      </button>
    </div>
  );
}
