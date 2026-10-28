import "server-only";
import { confirmationDocuments, confirmationEmail } from "@/lib/emails/confirmation";
import { sendMail, mailConfig } from "@/lib/emails/send";
import { addressLine, decrementStock, invoiceNumber, type Order } from "@/lib/orders";
import type { StripeCheckoutSession } from "@/lib/payments/stripe";
import { siteUrl } from "@/lib/site-url";
import { appendAudit, getOrder, logError, nextInvoiceCounter, updateCatalog, updateOrder } from "@/lib/store";
import { formatPrice } from "@/lib/money";

export const invoiceUrl = (o: Order) => `${siteUrl()}/facture/${o.number}?cle=${o.accessKey}`;

// Paiement confirmé par Stripe : commande payée, stock, facture, emails. Sans effet si déjà traité.
export async function processPaidSession(session: StripeCheckoutSession): Promise<{ ok: boolean; reason?: string }> {
  const number = session.client_reference_id ?? "";
  const order = await getOrder(number);
  if (!order) return { ok: false, reason: "commande inconnue" };
  if (session.payment_status !== "paid") return { ok: true, reason: "paiement pas encore confirmé" };
  if (session.amount_total !== order.totalCents || (session.currency ?? "").toLowerCase() !== "eur") {
    await appendAudit("paiement : montant différent", `${number} : reçu ${session.amount_total} ${session.currency}, attendu ${order.totalCents}`);
    return { ok: false, reason: "montant différent" };
  }

  let firstTime = false;
  const paidAt = new Date().toISOString();
  await updateOrder(number, (o) => {
    firstTime = o.status === "attente-paiement" || o.status === "annulee";
    if (!firstTime) return o;
    return {
      ...o,
      status: "payee",
      payment: { provider: "stripe", sessionId: session.id, paidAt, paymentIntent: session.payment_intent ?? undefined },
    };
  });
  if (!firstTime) return { ok: true, reason: "déjà traitée" };

  // Stock, puis facture numérotée à la suite
  await updateCatalog((c) => decrementStock(c, order.lines));
  const year = Number(paidAt.slice(0, 4));
  const invoice = invoiceNumber(year, await nextInvoiceCounter(year));
  const paid = await updateOrder(number, (o) => ({ ...o, invoiceNumber: invoice }));
  await appendAudit("commande payée", `${number} · ${formatPrice(paid.totalCents)} · facture ${invoice}`);
  await sendOrderEmails(paid);
  return { ok: true };
}

// Email de confirmation à la cliente et alerte à la boutique ; le résultat est noté dans la commande
export async function sendOrderEmails(order: Order) {
  const site = siteUrl();
  try {
    const mail = confirmationEmail(
      {
        orderNumber: order.number,
        firstName: order.address.firstName,
        lines: order.lines.map((l) => ({ name: l.name, quantity: l.quantity, totalCents: l.totalCents })),
        shippingCents: order.shippingCents,
        freeShipping: order.freeShipping,
        totalCents: order.totalCents,
        address: addressLine(order.address),
        invoiceUrl: invoiceUrl(order),
      },
      site,
    );
    const sent = await sendMail({
      to: order.address.email,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
      attachments: confirmationDocuments().map((d) => ({ filename: d.filename, path: `${site}${d.path}` })),
    });
    await sendMail({
      to: mailConfig().notify,
      subject: `Nouvelle commande ${order.number} (${formatPrice(order.totalCents)})`,
      text: [
        `Commande ${order.number} payée.`,
        ...order.lines.map((l) => `${l.name} × ${l.quantity}`),
        `Total : ${formatPrice(order.totalCents)}`,
        `Livraison : ${addressLine(order.address)}`,
        `Email : ${order.address.email}${order.address.phone ? ` · Téléphone : ${order.address.phone}` : ""}`,
        "",
        `Détail dans le back-office : ${site}/admin/commandes`,
      ].join("\n"),
    });
    await updateOrder(order.number, (o) => ({
      ...o,
      emails: sent ? { confirmationSentAt: new Date().toISOString() } : { error: "envoi des emails pas encore configuré" },
    }));
  } catch (e) {
    await logError("email de confirmation", e);
    await updateOrder(order.number, (o) => ({ ...o, emails: { error: e instanceof Error ? e.message : String(e) } })).catch(() => undefined);
  }
}
