import type { Metadata } from "next";
import ButtonLink from "@/components/ButtonLink";
import ClearCart from "@/components/cart/ClearCart";
import { confirmedTexts as t } from "@/content/site";
import { getOrder } from "@/lib/store";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: t.title, robots: { index: false, follow: false } };

// Retour de la page de paiement Stripe : remerciement, état de la commande, panier vidé
export default async function OrderConfirmed({ searchParams }: { searchParams: Promise<{ commande?: string; cle?: string }> }) {
  const { commande = "", cle = "" } = await searchParams;
  const order = await getOrder(commande).catch(() => null);
  const known = order && order.accessKey === cle;
  const paid = known && order.status !== "attente-paiement";
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 sm:py-24">
      <ClearCart />
      <h1 className="titre-h1">{t.title}</h1>
      {known ? (
        <>
          <p className="accroche mt-4">{t.number(order.number)}</p>
          <p className="mt-4">{paid ? t.paid(order.address.email) : t.pending}</p>
        </>
      ) : (
        <p className="accroche mt-4">{t.unknown}</p>
      )}
      <ButtonLink href="/" className="mt-8">
        {t.home}
      </ButtonLink>
    </div>
  );
}
