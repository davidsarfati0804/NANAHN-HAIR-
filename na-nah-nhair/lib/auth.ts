import "server-only";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSessionToken, SESSION_MAX_AGE_SECONDS, verifySessionToken } from "@/lib/auth-core";
import { deployContext } from "@/lib/deploy";
import { getSessionEpoch, setSessionEpoch } from "@/lib/store";

export const SESSION_COOKIE = "nnh_admin";

// Le back-office n'est accessible que si les variables d'environnement sont définies (voir GUIDE.md)
export function adminConfig() {
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  const totpSecret = process.env.ADMIN_TOTP_SECRET || null;
  // Double authentification obligatoire : sans code à 6 chiffres, le back-office reste fermé
  const configured = Boolean(passwordHash?.startsWith("scrypt$") && sessionSecret && sessionSecret.length >= 32 && totpSecret);
  return { configured, passwordHash: passwordHash ?? "", sessionSecret: sessionSecret ?? "", totpSecret };
}

export async function isAdmin(): Promise<boolean> {
  const { configured, sessionSecret } = adminConfig();
  if (!configured) return false;
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  try {
    return verifySessionToken(token, sessionSecret, Date.now(), await getSessionEpoch());
  } catch {
    return false; // stockage indisponible : accès refusé
  }
}

// À appeler au début de chaque page et de chaque action du back-office
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/connexion");
}

export async function startSession() {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, createSessionToken(adminConfig().sessionSecret), {
    httpOnly: true,
    // NNH_INSECURE_COOKIES (tests locaux en http) est ignoré sur Netlify
    secure: process.env.NODE_ENV === "production" && (process.env.NNH_INSECURE_COOKIES !== "1" || deployContext() !== "local"),
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

// Déconnexion : le cookie est supprimé ET toutes les sessions ouvertes jusqu'ici sont invalidées
export async function endSession() {
  await setSessionEpoch(Date.now());
  (await cookies()).delete(SESSION_COOKIE);
}

// Seule l'IP posée par Netlify est fiable ; X-Forwarded-For peut être falsifié par le client
export async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-nf-client-connection-ip") ?? "ip-inconnue";
}
