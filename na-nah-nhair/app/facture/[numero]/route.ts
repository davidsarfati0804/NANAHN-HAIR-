import { timingSafeEqual } from "node:crypto";
import { isAdmin } from "@/lib/auth";
import { invoiceHtml } from "@/lib/invoices/invoice";
import { addressLine } from "@/lib/orders";
import { getOrder } from "@/lib/store";

export const dynamic = "force-dynamic";

const sameKey = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

// Facture d'une commande payée (lien envoyé dans l'email de confirmation, ou back-office). À imprimer en PDF.
export async function GET(request: Request, { params }: { params: Promise<{ numero: string }> }) {
  const { numero } = await params;
  const key = new URL(request.url).searchParams.get("cle") ?? "";
  const order = await getOrder(numero);
  const allowed = order && (sameKey(key, order.accessKey) || (await isAdmin()));
  if (!order || !allowed || !order.invoiceNumber) return new Response("Facture introuvable", { status: 404 });
  const html = invoiceHtml({
    invoiceNumber: order.invoiceNumber,
    orderNumber: order.number,
    date: (order.payment?.paidAt ?? order.createdAt).slice(0, 10),
    customer: { name: `${order.address.firstName} ${order.address.lastName}`, address: addressLine(order.address).split(", ").slice(1).join(", ") },
    lines: order.lines,
    shippingCents: order.shippingCents,
    freeShipping: order.freeShipping,
    totalCents: order.totalCents,
  });
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex" },
  });
}
