"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartProvider";

type CartLinkProps = {
  compact?: boolean;
};

export default function CartLink({ compact = false }: CartLinkProps) {
  const { openCart, totalItems } = useCart();

  return (
    <button
      onClick={openCart}
      className={`relative inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-lavender-mist)] text-[var(--color-deep-violet)] ${
        compact ? "h-11 w-11" : "px-4 py-2 text-sm font-bold"
      }`}
      aria-label={`Panier, ${totalItems} article${totalItems > 1 ? "s" : ""}`}
      type="button"
    >
      <ShoppingBag size={18} />
      {!compact && <span>Panier</span>}
      {totalItems > 0 && (
        <span className="absolute -right-2 -top-2 grid h-6 min-w-6 place-items-center rounded-full bg-[var(--color-deep-violet)] px-1 text-xs font-black text-white">
          {totalItems}
        </span>
      )}
    </button>
  );
}
