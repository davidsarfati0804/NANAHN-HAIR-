"use client";

import { useEffect } from "react";
import { useCart } from "@/components/cart/CartProvider";

// Vide le panier une fois la commande passée (page de confirmation)
export default function ClearCart() {
  const { ready, count, clear } = useCart();
  useEffect(() => {
    if (ready && count > 0) clear();
  }, [ready, count, clear]);
  return null;
}
