import { cancelOrder, resendOrderEmail, shipOrder } from "@/app/admin/actions";
import { adminTexts } from "@/content/site";
import { requireAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/money";
import { addressLine, ORDER_STATUS_LABELS } from "@/lib/orders";
import { stripeConfig } from "@/lib/payments/stripe";
import { mailConfig } from "@/lib/emails/send";
import { listOrders } from "@/lib/store";

const t = adminTexts.orders;
const date = (iso: string) => new Date(iso).toLocaleString("fr-FR", { timeZone: "Europe/Paris" });

export default async function AdminOrdersPage() {
  await requireAdmin(); // chaque page vérifie elle-même : le layout ne suffit pas
  const orders = await listOrders();
  const stripe = stripeConfig();
  return (
    <div>
      <h1 className="titre-h1">{t.title}</h1>
      <ul className="mt-4 space-y-1 text-sm">
        <li>{stripe.enabled ? (stripe.testMode ? t.stripeTest : t.stripeLive) : t.stripeOff}</li>
        <li>{mailConfig().enabled ? t.mailOn : t.mailOff}</li>
      </ul>
      {orders.length === 0 ? (
        <p className="mt-8">{t.empty}</p>
      ) : (
        <ul className="mt-8 grid gap-4">
          {orders.map((o) => (
            <li key={o.number} className="rounded-3xl border-2 border-lavender p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-deep-violet">
                    {o.number} · {formatPrice(o.totalCents)}
                  </p>
                  <p className="text-sm">
                    <time dateTime={o.createdAt}>{date(o.createdAt)}</time> · <strong>{ORDER_STATUS_LABELS[o.status]}</strong>
                    {o.invoiceNumber && ` · facture ${o.invoiceNumber}`}
                  </p>
                </div>
                {o.invoiceNumber && (
                  <a href={`/facture/${o.number}`} target="_blank" className="min-h-11 rounded-full border-2 border-deep-violet px-4 py-2 text-sm font-bold text-deep-violet">
                    {t.invoice}
                  </a>
                )}
              </div>
              <ul className="mt-3 text-sm">
                {o.lines.map((l) => (
                  <li key={l.id}>
                    {l.name} × {l.quantity} : {formatPrice(l.totalCents)}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-sm">
                {addressLine(o.address)} · <a href={`mailto:${o.address.email}`} className="underline underline-offset-4">{o.address.email}</a>
                {o.address.phone && ` · ${o.address.phone}`}
              </p>
              <p className="mt-1 text-sm">
                {t.cgv(o.cgv.version, date(o.cgv.acceptedAt))}
                {o.emails?.confirmationSentAt && ` · ${t.mailSent(date(o.emails.confirmationSentAt))}`}
                {o.emails?.error && ` · ${t.mailError(o.emails.error)}`}
                {o.shipping && ` · ${t.shipped(date(o.shipping.shippedAt), o.shipping.tracking)}`}
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {(o.status === "payee" || o.status === "expediee") && (
                  <form action={shipOrder} className="flex flex-wrap items-end gap-2">
                    <input type="hidden" name="number" value={o.number} />
                    <label className="flex flex-col text-sm font-bold">
                      {t.tracking}
                      <input name="tracking" defaultValue={o.shipping?.tracking ?? ""} className="mt-1 h-11 rounded-full border-2 border-deep-violet px-4 font-normal" />
                    </label>
                    <button type="submit" className="min-h-11 rounded-full bg-deep-violet px-4 text-sm font-bold text-white">
                      {o.status === "expediee" ? t.updateShipping : t.ship}
                    </button>
                  </form>
                )}
                {(o.status === "payee" || o.status === "expediee") && (
                  <form action={resendOrderEmail}>
                    <input type="hidden" name="number" value={o.number} />
                    <button type="submit" className="min-h-11 rounded-full border-2 border-deep-violet px-4 text-sm font-bold text-deep-violet">
                      {t.resend}
                    </button>
                  </form>
                )}
                {o.status === "attente-paiement" && (
                  <form action={cancelOrder}>
                    <input type="hidden" name="number" value={o.number} />
                    <button type="submit" className="min-h-11 rounded-full bg-luxurious-deep px-4 text-sm font-bold text-white">
                      {t.cancel}
                    </button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
