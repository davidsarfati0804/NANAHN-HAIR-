"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";

export default function CartCount() {
  const { count, ready } = useCart();
  const n = ready ? count : 0;
  return (
    <Link
      href="/panier"
      className="rounded-full border-2 border-deep-violet px-4 py-2 text-sm font-bold uppercase text-deep-violet hover:bg-lavender-soft"
      aria-label={`Panier, ${n} article${n > 1 ? "s" : ""}`}
    >
      Panier <span data-testid="cart-count">({n})</span>
    </Link>
  );
}
