// Gabarit commun des emails (01/11/2026) : fond lavande clair, carte blanche de 600 px, bandeau crème avec le
// logo, pied de page avec l'identité de la société. Tableaux et styles en ligne : rendu fiable dans Gmail,
// Outlook, Apple Mail et sur téléphone.
import { legal } from "@/content/site";
import { colors } from "@/lib/design-tokens";

export const emailColors = {
  ink: colors.deepViolet,
  accent: colors.logoViolet,
  muted: "#6A6390",
  line: colors.lavender,
  soft: colors.lavenderSoft,
  page: colors.lavenderSoft,
  cream: colors.logoYellow,
  white: colors.white,
};
export type EmailColors = typeof emailColors;

export const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function emailLayout({ siteUrl, title, preheader, body }: { siteUrl: string; title: string; preheader: string; body: string }) {
  const c = emailColors;
  const host = siteUrl.replace(/^https?:\/\//, "");
  return `<!doctype html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(title)}</title>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
<style>
  body { margin:0; padding:0; background:${c.page}; }
  a { color:${c.ink}; }
  @media (max-width: 620px) {
    .card { width:100% !important; border-radius:0 !important; }
    .px { padding-left:22px !important; padding-right:22px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${c.page};font-family:Montserrat,'Helvetica Neue',Arial,sans-serif;color:${c.ink};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${c.page};">${esc(preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${c.page};">
<tr><td align="center" style="padding:24px 0;">
  <table role="presentation" class="card" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:${c.white};border-radius:28px;overflow:hidden;">
    <tr><td align="center" bgcolor="${c.cream}" style="background:${c.cream};padding:20px 0;">
      <a href="${esc(siteUrl)}" style="text-decoration:none;"><img src="${siteUrl}/images/email/logo-240.jpg" width="96" height="96" alt="Na Nah N'hair !" style="display:block;border:0;border-radius:18px;"></a>
    </td></tr>
${body}
    <tr><td bgcolor="${c.ink}" style="background:${c.ink};padding:28px 40px;color:${c.white};font-size:12px;line-height:19px;" class="px">
      <p style="margin:0 0 8px;font-family:'Bebas Neue','Arial Narrow',Arial,sans-serif;font-size:22px;line-height:24px;letter-spacing:0.5px;">NA NAH N'HAIR</p>
      <p style="margin:0;">
        <a href="${esc(siteUrl)}" style="color:${c.white};text-decoration:underline;">${esc(host)}</a> ·
        <a href="${legal.instagram}" style="color:${c.white};text-decoration:underline;">Instagram ${esc(legal.instagramHandle)}</a> ·
        <a href="mailto:${legal.email}" style="color:${c.white};text-decoration:underline;">${legal.email}</a>
      </p>
      <p style="margin:10px 0 0;opacity:0.8;">${esc(legal.company.name)}, ${esc(legal.company.form)} au capital de ${esc(legal.company.capital)} · ${esc(legal.company.rcs)} · ${esc(legal.address)} · ${esc(legal.vatMention)}</p>
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}
