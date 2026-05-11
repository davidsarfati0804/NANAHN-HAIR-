"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useCart } from "./CartProvider";

type AddToCartButtonProps = {
  item: {
    id: string;
    name: string;
    price: string;
    priceCents: number;
    image?: string;
    imageAlt?: string;
  };
  label?: string;
  variant?: "lavender" | "white";
};

export default function AddToCartButton({
  item,
  label = "Ajouter au panier",
  variant = "lavender",
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const isWhite = variant === "white";

  const handleClick = () => {
    addItem(item);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 font-bold transition ${
        isWhite
          ? "bg-white text-[var(--color-deep-violet)] hover:-translate-y-0.5"
          : "bg-[var(--color-lavender)] text-white hover:bg-[var(--color-plum)]"
      }`}
      type="button"
    >
      <Plus size={18} />
      {added ? "Ajouté au panier" : label}
    </button>
  );
}
