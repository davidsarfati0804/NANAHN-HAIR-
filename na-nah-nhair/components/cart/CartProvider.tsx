"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { isProductId, type ProductId } from "@/lib/catalog";
import { type CartItem, MAX_QUANTITY_PER_LINE, sanitizeCart } from "@/lib/pricing";

const STORAGE_KEY = "nnh-panier-v1";

type CartContextValue = {
  items: CartItem[];
  ready: boolean;
  count: number;
  add: (id: ProductId, quantity?: number) => void;
  setQuantity: (id: ProductId, quantity: number) => void;
  remove: (id: ProductId) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function load(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? sanitizeCart(JSON.parse(raw)).items : [];
  } catch {
    return [];
  }
}

// Panier persistant : conservé dans le navigateur, même après fermeture de l'onglet
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lecture du stockage navigateur après le rendu serveur
    setItems(load());
    setReady(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setItems(load());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const update = useCallback((fn: (prev: CartItem[]) => CartItem[]) => {
    setItems((prev) => {
      const next = fn(prev).filter((i) => i.quantity > 0);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // stockage indisponible (navigation privée) : le panier reste en mémoire
      }
      return next;
    });
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      ready,
      count: items.reduce((n, i) => n + i.quantity, 0),
      add: (id, quantity = 1) =>
        isProductId(id) &&
        update((prev) => {
          const existing = prev.find((i) => i.id === id);
          if (!existing) return [...prev, { id, quantity: Math.min(quantity, MAX_QUANTITY_PER_LINE) }];
          return prev.map((i) =>
            i.id === id ? { ...i, quantity: Math.min(i.quantity + quantity, MAX_QUANTITY_PER_LINE) } : i,
          );
        }),
      setQuantity: (id, quantity) =>
        update((prev) =>
          prev.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(0, Math.min(Math.floor(quantity), MAX_QUANTITY_PER_LINE)) } : i,
          ),
        ),
      remove: (id) => update((prev) => prev.filter((i) => i.id !== id)),
      clear: () => update(() => []),
    }),
    [items, ready, update],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé dans <CartProvider>");
  return ctx;
}
