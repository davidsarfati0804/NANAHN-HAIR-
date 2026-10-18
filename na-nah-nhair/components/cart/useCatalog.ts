"use client";

import { useEffect, useState } from "react";
import type { ProductId, PublicProduct } from "@/lib/catalog";
import type { ShopSettings } from "@/lib/settings";

export type PublicCatalog = { products: Record<ProductId, PublicProduct>; settings: ShopSettings };

// Prix et disponibilités à jour, lus sur le serveur
export function useCatalog() {
  const [data, setData] = useState<PublicCatalog | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/catalog", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => !cancelled && setData(d))
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, []);
  return { data, error };
}
