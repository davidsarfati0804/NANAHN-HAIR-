// Email de confirmation de commande (modification 39) : texte de content/juridique/textes-boutique.md.
// Aucun service d'envoi n'est encore branché : ce module prépare l'email (objet, texte, HTML, pièces jointes)
// qui sera envoyé à la confirmation du paiement.
import { CGV_VERSION } from "@/content/juridique";
import { legal } from "@/content/site";
import { formatPrice } from "@/lib/money";

export type ConfirmationOrder = {
  orderNumber: string;
  firstName: string;
  lines: Array<{ name: string; quantity: number; totalCents: number }>;
  shippingCents: number;
  freeShipping: boolean;
  totalCents: number;
  address: string;
};

export const confirmationDocuments = () => [
  { filename: `cgv-${CGV_VERSION}.pdf`, path: `/documents/cgv-${CGV_VERSION}.pdf` },
  { filename: "formulaire-de-retractation.pdf", path: "/documents/formulaire-de-retractation.pdf" },
];

export function confirmationEmail(order: ConfirmationOrder, siteUrl: string) {
  const subject = "Ta commande NA NAH N'HAIR est confirmée";
  const recap = [
    ...order.lines.map((l) => `${l.name} × ${l.quantity} : ${formatPrice(l.totalCents)} TTC`),
    `Livraison : ${order.freeShipping ? "Livraison offerte" : formatPrice(order.shippingCents)}`,
    `Total TTC : ${formatPrice(order.totalCents)}`,
    `Adresse de livraison : ${order.address}`,
  ];
  const [cgv, form] = confirmationDocuments();
  const text = [
    `Bonjour ${order.firstName},`,
    "",
    `Merci pour ta commande n° ${order.orderNumber}. Elle est confirmée et sera préparée sous 3 jours ouvrés.`,
    "",
    "Récapitulatif",
    ...recap,
    "",
    "Ton droit de rétractation",
    `Tu disposes de 14 jours à compter de la réception de ta commande pour te rétracter, sans te justifier. Pour cela, écris-nous à ${legal.email}. Le modèle de formulaire de rétractation est joint à cet email et disponible ici : ${siteUrl}/retractation. Le soin doit être renvoyé neuf, non utilisé, dans son emballage d'origine, et les frais de retour sont à ta charge.`,
    "",
    "Tes documents",
    `- Conditions générales de vente : ${siteUrl}/cgv (PDF joint : ${cgv.filename})`,
    `- Modèle de formulaire de rétractation : ${siteUrl}/retractation (PDF joint : ${form.filename})`,
    "",
    `Une question ? Écris-nous à ${legal.email}.`,
    "",
    "À très vite,",
    "NA NAH N'HAIR",
    "",
    "Révèle ton Na Nah N'hair.",
  ].join("\n");
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const html = text
    .split("\n\n")
    .map((block) => `<p>${esc(block).replace(/\n/g, "<br>").replace(/(https?:\/\/\S+?)(?=[\s)<]|$)/g, '<a href="$1">$1</a>')}</p>`)
    .join("\n");
  return { subject, text, html, attachments: [cgv, form] };
}
