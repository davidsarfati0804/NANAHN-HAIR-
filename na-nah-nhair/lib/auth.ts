import "server-only";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createRateLimiter, createSessionToken, SESSION_MAX_AGE_SECONDS, verifySessionToken } from "@/lib/auth-core";

export const SESSION_COOKIE = "nnh_admin";
export const loginLimiter = createRateLimiter();

// Le back-office n'est accessible que si les variables d'environnement sont définies (voir GUIDE.md)
export function adminConfig() {
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  const totpSecret = process.env.ADMIN_TOTP_SECRET || null;
  const configured = Boolean(passwordHash?.startsWith("scrypt$") && sessionSecret && sessionSecret.length >= 32);
  return { configured, passwordHash: passwordHash ?? "", sessionSecret: sessionSecret ?? "", totpSecret };
}

export async function isAdmin(): Promise<boolean> {
  const { configured, sessionSecret } = adminConfig();
  if (!configured) return false;
  const jar = await cookies();
  return verifySessionToken(jar.get(SESSION_COOKIE)?.value, sessionSecret);
}

// À appeler au début de chaque page et de chaque action du back-office
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/connexion");
}

export async function startSession() {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, createSessionToken(adminConfig().sessionSecret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" && process.env.NNH_INSECURE_COOKIES !== "1",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-nf-client-connection-ip") ?? h.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
}
