import ProductForm from "@/components/admin/ProductForm";
import { adminTexts as t, pack, products } from "@/content/site";
import { PRODUCT_IDS } from "@/lib/catalog";
import { getCatalog } from "@/lib/store";

export default async function AdminProductsPage() {
  const catalog = await getCatalog();
  const name = (id: string) => (id === "pack" ? pack.name : products.find((p) => p.slug === id)!.name);
  return (
    <div>
      <h1 className="text-6xl text-deep-violet">{t.products.title}</h1>
      <div className="mt-8 grid gap-6">
        {PRODUCT_IDS.map((id) => (
          <ProductForm key={id} product={catalog[id]} name={name(id)} />
        ))}
      </div>
    </div>
  );
}
