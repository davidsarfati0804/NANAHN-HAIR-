import { pack, products } from "@/content/site";
import type { ProductId } from "@/lib/catalog";

export function productName(id: ProductId): string {
  return id === "pack" ? pack.name : products.find((p) => p.slug === id)!.name;
}

export function productHref(id: ProductId): string {
  return id === "pack" ? "/pack" : `/soins/${id}`;
}

export function productPhoto(id: ProductId) {
  return id === "pack" ? pack.photo : products.find((p) => p.slug === id)!.photo;
}
