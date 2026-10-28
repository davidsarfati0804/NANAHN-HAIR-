import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { legal } from "@/content/site";

// Envoi des emails par le compte Gmail (ou Google Workspace) de la boutique, en SMTP.
// Variables Netlify : SMTP_USER (adresse Gmail), SMTP_PASSWORD (mot de passe d'application Google,
// jamais le mot de passe du compte), et au besoin MAIL_FROM, MAIL_NOTIFY, SMTP_HOST, SMTP_PORT.
export function mailConfig() {
  const user = process.env.SMTP_USER ?? "";
  const password = process.env.SMTP_PASSWORD ?? "";
  return {
    enabled: Boolean(user && password),
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    user,
    password,
    from: process.env.MAIL_FROM || `NA NAH N'HAIR <${user}>`,
    // Adresse qui reçoit les alertes (nouvelle commande, nouveau message)
    notify: process.env.MAIL_NOTIFY || legal.email,
  };
}

export type Mail = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  attachments?: Array<{ filename: string; path: string }>;
};

let transport: Transporter | null = null;

// Renvoie false (sans erreur) si l'envoi n'est pas encore configuré
export async function sendMail(mail: Mail): Promise<boolean> {
  const config = mailConfig();
  if (!config.enabled) return false;
  transport ??= nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: { user: config.user, pass: config.password },
    // Pas de lecture de fichiers locaux ; les pièces jointes sont téléchargées depuis le site lui-même
    disableFileAccess: true,
  });
  await transport.sendMail({ from: config.from, replyTo: mail.replyTo ?? legal.email, ...mail });
  return true;
}
