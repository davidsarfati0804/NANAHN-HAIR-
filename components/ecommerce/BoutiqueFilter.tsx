"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import type { Product } from "@/data/products";

const LABELS: Record<string, string> = {
  all: "Tous",
  nutrition: "Nutrition",
  pousse: "Pousse",
  brillance: "Brillance",
};

const CATEGORIES = ["all", "nutrition", "pousse", "brillance"] as const;

type Props = { products: Product[] };

export default function BoutiqueFilter({ products }: Props) {
  const [active, setActive] = useState<string>("all");

  const filtered = active === "all" ? products : products.filter((p) => p.category === active);

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            type="button"
            className={`rounded-full px-5 py-2 text-sm font-black transition ${
              active === cat
                ? "bg-[var(--color-lavender)] text-white shadow-[0_8px_20px_rgba(170,161,200,0.4)]"
                : "bg-[var(--color-lavender-soft)] text-[var(--color-deep-violet)] hover:bg-[var(--color-lavender-mist)]"
            }`}
          >
            {LABELS[cat]}
          </button>
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
