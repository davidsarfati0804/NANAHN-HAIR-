import Link from "next/link";
import { pack, products } from "@/content/site";
import { adminTexts as t } from "@/content/site";
import { availableQuantity, PRODUCT_IDS } from "@/lib/catalog";
import { formatPrice } from "@/lib/money";
import { getCatalog, getSettings } from "@/lib/store";

export default async function AdminHome() {
  const [catalog, settings] = await Promise.all([getCatalog(), getSettings()]);
  const name = (id: string) => (id === "pack" ? pack.name : products.find((p) => p.slug === id)!.name);
  return (
    <div>
      <h1 className="text-6xl text-deep-violet">{t.title}</h1>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PRODUCT_IDS.map((id) => {
          const available = availableQuantity(catalog, id);
          return (
            <li key={id} className="rounded-3xl bg-lavender p-5 text-deep-violet">
              <p className="font-bold">{name(id)}</p>
              <p className="mt-2 font-display text-4xl">{formatPrice(catalog[id].priceCents)}</p>
              <p className="text-sm">
                {available === 0 ? t.products.soldOut : available === null ? "Stock non suivi" : `${available} disponible(s)`}
              </p>
            </li>
          );
        })}
      </ul>
      <p className="mt-6">
        Livraison :{" "}
        {settings.freeShippingThresholdCents === 0
          ? "offerte sur toutes les commandes"
          : `offerte à partir de ${formatPrice(settings.freeShippingThresholdCents)}`}
        .{" "}
        <Link href="/admin/livraison" className="font-bold underline underline-offset-4">
          Modifier
        </Link>
      </p>
      <p className="mt-6 rounded-3xl border-2 border-dashed border-gold bg-yellow p-4 text-sm font-bold">
        Commandes, codes promo et factures : phase 6 (avec Stripe).
      </p>
    </div>
  );
}
