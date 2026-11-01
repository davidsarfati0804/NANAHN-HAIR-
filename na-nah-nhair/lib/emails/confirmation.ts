// Email de confirmation de commande (modification 39) : texte de content/juridique/textes-boutique.md.
// Envoyé à la confirmation du paiement (lib/order-processing.ts, par lib/emails/send.ts).
// Version HTML (01/11/2026) : mise en page d'email professionnelle (tableaux de 600 px, styles en ligne,
// compatible Gmail, Outlook, Apple Mail), même texte que la version texte.
import { CGV_VERSION } from "@/content/juridique";
import { legal } from "@/content/site";
import type { ProductId } from "@/lib/catalog";
import { formatPrice } from "@/lib/money";
import { emailLayout, esc, type EmailColors, emailColors as c } from "./layout";

export type ConfirmationOrder = {
  orderNumber: string;
  firstName: string;
  lines: Array<{ id?: ProductId; name: string; quantity: number; totalCents: number }>;
  shippingCents: number;
  freeShipping: boolean;
  totalCents: number;
  address: string;
  // Lien vers la facture (ajout du 28/10/2026, texte à valider : TEXTES-A-VALIDER.md)
  invoiceUrl?: string;
};

export const confirmationDocuments = () => [
  { filename: `cgv-${CGV_VERSION}.pdf`, path: `/documents/cgv-${CGV_VERSION}.pdf` },
  { filename: "formulaire-de-retractation.pdf", path: "/documents/formulaire-de-retractation.pdf" },
];

// Vignette de chaque produit (public/images/email/, 128 px de large)
const thumb = (siteUrl: string, id?: ProductId) => (id ? `${siteUrl}/images/email/${id}-128.jpg` : null);

export function confirmationEmail(order: ConfirmationOrder, siteUrl: string) {
  const subject = "Ta commande NA NAH N'HAIR est confirmée";
  const shipping = order.freeShipping ? "Livraison offerte" : formatPrice(order.shippingCents);
  const [cgv, form] = confirmationDocuments();
  const withdrawal = `Tu disposes de 14 jours à compter de la réception de ta commande pour te rétracter, sans te justifier. Pour cela, écris-nous à ${legal.email}. Le modèle de formulaire de rétractation est joint à cet email et disponible ici : ${siteUrl}/retractation. Le soin doit être renvoyé neuf, non utilisé, dans son emballage d'origine, et les frais de retour sont à ta charge.`;

  const text = [
    `Bonjour ${order.firstName},`,
    "",
    `Merci pour ta commande n° ${order.orderNumber}. Elle est confirmée et sera préparée sous 3 jours ouvrés.`,
    "",
    "Récapitulatif",
    ...order.lines.map((l) => `${l.name} × ${l.quantity} : ${formatPrice(l.totalCents)}`),
    `Livraison : ${shipping}`,
    `Total : ${formatPrice(order.totalCents)}`,
    legal.vatMention,
    `Adresse de livraison : ${order.address}`,
    "",
    "Ton droit de rétractation",
    withdrawal,
    "",
    "Tes documents",
    `- Conditions générales de vente : ${siteUrl}/cgv (PDF joint : ${cgv.filename})`,
    `- Modèle de formulaire de rétractation : ${siteUrl}/retractation (PDF joint : ${form.filename})`,
    ...(order.invoiceUrl ? [`- Ta facture : ${order.invoiceUrl}`] : []),
    "",
    `Une question ? Écris-nous à ${legal.email}.`,
    "",
    "À très vite,",
    "NA NAH N'HAIR",
    "",
    "Révèle ton Na Nah N'hair.",
  ].join("\n");

  const link = (href: string, label: string, color: string = c.ink) =>
    `<a href="${esc(href)}" style="color:${color};font-weight:700;text-decoration:underline;">${esc(label)}</a>`;
  const mail = `<a href="mailto:${legal.email}" style="color:${c.ink};font-weight:700;text-decoration:underline;">${legal.email}</a>`;

  const lineRows = order.lines
    .map((l) => {
      const img = thumb(siteUrl, l.id);
      return `<tr>
  <td width="64" style="padding:12px 0;vertical-align:middle;">${img ? `<img src="${img}" width="48" height="60" alt="" style="display:block;border:0;border-radius:10px;">` : ""}</td>
  <td style="padding:12px 12px 12px 0;vertical-align:middle;font-size:15px;line-height:20px;color:${c.ink};"><strong>${esc(l.name)}</strong><br><span style="color:${c.muted};font-size:13px;">Quantité : ${l.quantity}</span></td>
  <td align="right" style="padding:12px 0;vertical-align:middle;font-size:15px;color:${c.ink};white-space:nowrap;">${formatPrice(l.totalCents)}</td>
</tr>
<tr><td colspan="3" style="border-top:1px solid ${c.line};font-size:0;line-height:0;">&nbsp;</td></tr>`;
    })
    .join("\n");

  const body = `
<tr><td style="padding:40px 40px 8px;" class="px">
  <p style="margin:0 0 8px;font-size:12px;letter-spacing:3px;text-transform:uppercase;font-weight:700;color:${c.muted};">Commande confirmée</p>
  <h1 style="margin:0;font-family:'Bebas Neue','Arial Narrow',Arial,sans-serif;font-weight:400;font-size:44px;line-height:44px;color:${c.ink};">Merci pour ta commande&nbsp;!</h1>
</td></tr>
<tr><td style="padding:16px 40px 0;font-size:16px;line-height:26px;color:${c.ink};" class="px">
  <p style="margin:0 0 12px;">Bonjour ${esc(order.firstName)},</p>
  <p style="margin:0;">Merci pour ta commande n°&nbsp;<strong style="white-space:nowrap;">${esc(order.orderNumber)}</strong>. Elle est confirmée et sera préparée sous 3&nbsp;jours ouvrés.</p>
</td></tr>
${
  order.invoiceUrl
    ? `<tr><td style="padding:28px 40px 0;" class="px">${button(order.invoiceUrl, "Voir ma facture", c)}</td></tr>`
    : ""
}
<tr><td style="padding:32px 40px 0;" class="px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${c.soft};border-radius:20px;">
    <tr><td style="padding:20px 24px 8px;">
      <h2 style="margin:0 0 4px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:${c.ink};">Récapitulatif</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
${lineRows}
        <tr>
          <td colspan="2" style="padding:12px 0 4px;font-size:15px;color:${c.ink};">Livraison</td>
          <td align="right" style="padding:12px 0 4px;font-size:15px;color:${c.ink};white-space:nowrap;">${shipping}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding:8px 0 4px;font-size:18px;font-weight:700;color:${c.ink};">Total</td>
          <td align="right" style="padding:8px 0 4px;font-size:22px;font-weight:700;color:${c.ink};white-space:nowrap;">${formatPrice(order.totalCents)}</td>
        </tr>
        <tr><td colspan="3" align="right" style="padding:0 0 16px;font-size:12px;color:${c.muted};">${esc(legal.vatMention)}</td></tr>
      </table>
    </td></tr>
    <tr><td style="padding:0 24px 20px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${c.white};border-radius:14px;">
        <tr><td style="padding:14px 16px;font-size:14px;line-height:21px;color:${c.ink};"><strong>Adresse de livraison</strong><br>${esc(order.address)}</td></tr>
      </table>
    </td></tr>
  </table>
</td></tr>
<tr><td style="padding:32px 40px 0;font-size:15px;line-height:24px;color:${c.ink};" class="px">
  <h2 style="margin:0 0 8px;font-size:17px;color:${c.ink};">Ton droit de rétractation</h2>
  <p style="margin:0;">Tu disposes de 14 jours à compter de la réception de ta commande pour te rétracter, sans te justifier. Pour cela, écris-nous à ${mail}. Le modèle de formulaire de rétractation est joint à cet email et disponible ici&nbsp;: ${link(`${siteUrl}/retractation`, `${siteUrl.replace(/^https?:\/\//, "")}/retractation`)}. Le soin doit être renvoyé neuf, non utilisé, dans son emballage d'origine, et les frais de retour sont à ta charge.</p>
</td></tr>
<tr><td style="padding:28px 40px 0;font-size:15px;line-height:24px;color:${c.ink};" class="px">
  <h2 style="margin:0 0 8px;font-size:17px;color:${c.ink};">Tes documents</h2>
  <p style="margin:0 0 6px;">${link(`${siteUrl}/cgv`, "Conditions générales de vente")} <span style="color:${c.muted};font-size:13px;">(PDF joint : ${cgv.filename})</span></p>
  <p style="margin:0 0 6px;">${link(`${siteUrl}/retractation`, "Modèle de formulaire de rétractation")} <span style="color:${c.muted};font-size:13px;">(PDF joint : ${form.filename})</span></p>
  ${order.invoiceUrl ? `<p style="margin:0;">${link(order.invoiceUrl, "Ta facture")}</p>` : ""}
</td></tr>
<tr><td style="padding:32px 40px 40px;font-size:15px;line-height:24px;color:${c.ink};" class="px">
  <p style="margin:0 0 20px;">Une question&nbsp;? Écris-nous à ${mail}.</p>
  <p style="margin:0;">À très vite,<br><strong>NA NAH N'HAIR</strong></p>
  <p style="margin:12px 0 0;font-family:'Bebas Neue','Arial Narrow',Arial,sans-serif;font-size:24px;line-height:26px;color:${c.accent};">Révèle ton Na Nah N'hair.</p>
</td></tr>`;

  const html = emailLayout({
    siteUrl,
    title: subject,
    preheader: `Commande n° ${order.orderNumber} confirmée · ${formatPrice(order.totalCents)}`,
    body,
  });
  return { subject, text, html, attachments: [cgv, form] };
}

function button(href: string, label: string, colors: EmailColors) {
  // Bouton « à l'épreuve d'Outlook » : cellule de tableau colorée, lien en bloc
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
  <td align="center" bgcolor="${colors.ink}" style="border-radius:999px;">
    <a href="${esc(href)}" style="display:inline-block;padding:15px 30px;font-size:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${colors.white};text-decoration:none;border-radius:999px;">${esc(label)}</a>
  </td></tr></table>`;
}
