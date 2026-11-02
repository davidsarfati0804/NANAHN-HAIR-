// Alertes envoyées à la boutique (nouvelle commande, nouveau message), dans le gabarit commun des emails
import type { ContactInput } from "@/lib/contact";
import { formatPrice } from "@/lib/money";
import { addressLine, type Order } from "@/lib/orders";
import { emailLayout, emailColors as c, esc } from "./layout";

const row = (label: string, value: string) =>
  `<tr><td style="padding:6px 0;font-size:13px;color:${c.muted};width:130px;vertical-align:top;">${esc(label)}</td><td style="padding:6px 0;font-size:15px;color:${c.ink};">${value}</td></tr>`;

const block = (kicker: string, title: string, inner: string, cta?: { href: string; label: string }) => `
<tr><td style="padding:36px 40px 8px;" class="px">
  <p style="margin:0 0 8px;font-size:12px;letter-spacing:3px;text-transform:uppercase;font-weight:700;color:${c.muted};">${esc(kicker)}</p>
  <h1 style="margin:0;font-family:'Bebas Neue','Arial Narrow',Arial,sans-serif;font-weight:400;font-size:38px;line-height:40px;color:${c.ink};">${esc(title)}</h1>
</td></tr>
<tr><td style="padding:16px 40px ${cta ? "0" : "40px"};" class="px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${c.soft};border-radius:18px;"><tr><td style="padding:16px 20px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${inner}</table>
  </td></tr></table>
</td></tr>
${
  cta
    ? `<tr><td style="padding:24px 40px 40px;" class="px"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${c.ink}" style="border-radius:999px;"><a href="${esc(cta.href)}" style="display:inline-block;padding:14px 26px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${c.white};text-decoration:none;">${esc(cta.label)}</a></td></tr></table></td></tr>`
    : ""
}`;

export function orderAlertEmail(order: Order, siteUrl: string) {
  const subject = `Nouvelle commande ${order.number} (${formatPrice(order.totalCents)})`;
  const products = order.lines.map((l) => `${esc(l.name)} × ${l.quantity}`).join("<br>");
  const contact = `<a href="mailto:${esc(order.address.email)}" style="color:${c.ink};">${esc(order.address.email)}</a>${order.address.phone ? ` · ${esc(order.address.phone)}` : ""}`;
  const html = emailLayout({
    siteUrl,
    title: subject,
    preheader: `${order.address.firstName} ${order.address.lastName} · ${formatPrice(order.totalCents)}`,
    body: block(
      "Nouvelle commande payée",
      `Commande ${order.number}`,
      [
        row("Produits", products),
        row("Total", `<strong>${formatPrice(order.totalCents)}</strong>`),
        row("Livraison", order.carrier === "colissimo" ? "Colissimo" : "Mondial Relay"),
        row("Adresse", esc(addressLine(order.address))),
        row("Contact", contact),
      ].join(""),
      { href: `${siteUrl}/admin/commandes`, label: "Ouvrir les commandes" },
    ),
  });
  const text = [
    `Commande ${order.number} payée.`,
    ...order.lines.map((l) => `${l.name} × ${l.quantity}`),
    `Total : ${formatPrice(order.totalCents)}`,
    `Livraison : ${addressLine(order.address)}`,
    `Email : ${order.address.email}${order.address.phone ? ` · Téléphone : ${order.address.phone}` : ""}`,
    "",
    `Détail dans le back-office : ${siteUrl}/admin/commandes`,
  ].join("\n");
  return { subject, text, html };
}

export function contactAlertEmail(m: ContactInput, siteUrl: string) {
  const subject = `Nouveau message : ${m.subject}`;
  const html = emailLayout({
    siteUrl,
    title: subject,
    preheader: `${m.name} · ${m.subject}`,
    body: block(
      "Nouveau message du site",
      m.subject,
      [
        row("De", `${esc(m.name)} · <a href="mailto:${esc(m.email)}" style="color:${c.ink};">${esc(m.email)}</a>`),
        row("Message", esc(m.message).replace(/\n/g, "<br>")),
      ].join("") +
        `<tr><td colspan="2" style="padding:10px 0 0;font-size:13px;color:${c.muted};">Réponds directement à cet email pour lui écrire.</td></tr>`,
    ),
  });
  const text = `De : ${m.name} <${m.email}>\nSujet : ${m.subject}\n\n${m.message}\n\n(Réponds directement à cet email pour lui écrire.)`;
  return { subject, text, html };
}
