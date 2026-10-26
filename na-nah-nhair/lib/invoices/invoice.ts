// Facture (modification 53) : identité de la société en en-tête, aucune ligne de TVA,
// mention « TVA non applicable, article 293 B du CGI ». Prête pour l'activation du paiement :
// la facture sera produite à la confirmation du paiement (PDF depuis ce HTML).
import { legal } from "@/content/site";
import { formatPrice } from "@/lib/money";

export type InvoiceOrder = {
  invoiceNumber: string;
  orderNumber: string;
  date: string; // AAAA-MM-JJ
  customer: { name: string; address: string };
  lines: Array<{ name: string; quantity: number; unitCents: number; totalCents: number }>;
  shippingCents: number;
  freeShipping: boolean;
  totalCents: number;
};

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function invoiceHtml(o: InvoiceOrder): string {
  const c = legal.company;
  const rows = o.lines
    .map((l) => `<tr><td>${esc(l.name)}</td><td class="n">${l.quantity}</td><td class="n">${formatPrice(l.unitCents)}</td><td class="n">${formatPrice(l.totalCents)}</td></tr>`)
    .join("");
  const [d, m, y] = [o.date.slice(8, 10), o.date.slice(5, 7), o.date.slice(0, 4)];
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>Facture ${esc(o.invoiceNumber)}</title>
<style>
body{font-family:Arial,sans-serif;color:#342B64;font-size:12px;margin:0}
header{display:flex;justify-content:space-between;border-bottom:2px solid #342B64;padding-bottom:12px}
h1{font-size:22px;margin:0 0 4px}
table{width:100%;border-collapse:collapse;margin-top:18px}
th,td{padding:6px 4px;border-bottom:1px solid #AAA1C8;text-align:left}
.n{text-align:right}
.total td{font-weight:bold;font-size:14px;border-bottom:none}
.mention{margin-top:14px;font-weight:bold}
</style></head><body>
<header>
  <div>
    <h1>${esc(c.name)}</h1>
    <div>${esc(c.form)} au capital de ${esc(c.capital)}</div>
    <div>${esc(c.rcs)} · SIRET ${esc(legal.siret)}</div>
    <div>Siège social : ${esc(legal.address)}</div>
    <div>Marque ${esc(legal.brand)} · ${esc(legal.email)}</div>
  </div>
  <div class="n">
    <h1>Facture</h1>
    <div>N° ${esc(o.invoiceNumber)}</div>
    <div>Date : ${d}/${m}/${y}</div>
    <div>Commande n° ${esc(o.orderNumber)}</div>
  </div>
</header>
<p><strong>Client</strong><br>${esc(o.customer.name)}<br>${esc(o.customer.address)}</p>
<table>
  <thead><tr><th>Produit</th><th class="n">Quantité</th><th class="n">Prix unitaire</th><th class="n">Montant</th></tr></thead>
  <tbody>${rows}
    <tr><td>Livraison</td><td></td><td></td><td class="n">${o.freeShipping ? "Livraison offerte" : formatPrice(o.shippingCents)}</td></tr>
    <tr class="total"><td>Total</td><td></td><td></td><td class="n">${formatPrice(o.totalCents)}</td></tr>
  </tbody>
</table>
<p class="mention">${esc(legal.vatMention)}</p>
</body></html>`;
}
