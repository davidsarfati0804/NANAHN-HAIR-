"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { pack, products } from "@/data/products";

export type CartLine = {
  id: string;
  name: string;
  price: string;
  priceCents: number;
  image?: string;
  imageAlt?: string;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  isCartOpen: boolean;
  totalItems: number;
  subtotalCents: number;
  addItem: (item: Omit<CartLine, "quantity">, qty?: number) => void;
  openCart: () => void;
  closeCart: () => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "nanah-nhair-cart";

const catalog = [
  ...products.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    priceCents: product.priceCents,
    image: product.image,
    imageAlt: product.name,
  })),
  {
    id: pack.id,
    name: pack.name,
    price: pack.price,
    priceCents: pack.priceCents,
    image: pack.image,
    imageAlt: pack.name,
  },
];

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hasLoadedCart, setHasLoadedCart] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) {
      setHasLoadedCart(true);
      return;
    }

    try {
      const parsed = JSON.parse(stored) as CartLine[];
      const restoredLines = parsed
        .map((line) => {
          const catalogItem = catalog.find((item) => item.id === line.id);
          if (!catalogItem) {
            return null;
          }

          return {
            ...catalogItem,
            quantity: Math.max(1, Number(line.quantity) || 1),
          };
        })
        .filter(Boolean) as CartLine[];
      setLines(restoredLines);
    } catch {
      window.localStorage.removeItem(storageKey);
    } finally {
      setHasLoadedCart(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedCart) {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(lines));
  }, [hasLoadedCart, lines]);

  const addItem = useCallback((item: Omit<CartLine, "quantity">, qty = 1) => {
    setLines((current) => {
      const existing = current.find((line) => line.id === item.id);
      if (existing) {
        return current.map((line) =>
          line.id === item.id ? { ...line, quantity: line.quantity + qty } : line,
        );
      }

      return [...current, { ...item, quantity: qty }];
    });
    setIsCartOpen(true);
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const increment = useCallback((id: string) => {
    setLines((current) =>
      current.map((line) =>
        line.id === id ? { ...line, quantity: line.quantity + 1 } : line,
      ),
    );
  }, []);

  const decrement = useCallback((id: string) => {
    setLines((current) =>
      current
        .map((line) =>
          line.id === id ? { ...line, quantity: line.quantity - 1 } : line,
        )
        .filter((line) => line.quantity > 0),
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setLines((current) => current.filter((line) => line.id !== id));
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const totalItems = lines.reduce((total, line) => total + line.quantity, 0);
    const subtotalCents = lines.reduce(
      (total, line) => total + line.priceCents * line.quantity,
      0,
    );

    return {
      lines,
      isCartOpen,
      totalItems,
      subtotalCents,
      addItem,
      openCart,
      closeCart,
      increment,
      decrement,
      removeItem,
      clearCart,
    };
  }, [
    addItem,
    clearCart,
    closeCart,
    decrement,
    increment,
    isCartOpen,
    lines,
    openCart,
    removeItem,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}

export function formatPrice(cents: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}
