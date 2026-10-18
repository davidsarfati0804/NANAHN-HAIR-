// Fonctions de sécurité du back-office (sans dépendance à Next.js, donc testables)
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const SCRYPT = { N: 32768, r: 8, p: 1, keylen: 64 };
const maxmem = 128 * SCRYPT.N * SCRYPT.r * 2;

// Mot de passe haché (scrypt + sel aléatoire) : « scrypt$N$r$p$sel$hash »
export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, SCRYPT.keylen, { N: SCRYPT.N, r: SCRYPT.r, p: SCRYPT.p, maxmem });
  return ["scrypt", SCRYPT.N, SCRYPT.r, SCRYPT.p, salt.toString("base64"), hash.toString("base64")].join("$");
}

export function verifyPassword(password: string, stored: string): boolean {
  const parts = stored.split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [N, r, p] = parts.slice(1, 4).map(Number);
  const salt = Buffer.from(parts[4], "base64");
  const expected = Buffer.from(parts[5], "base64");
  const actual = scryptSync(password, salt, expected.length, { N, r, p, maxmem: 128 * N * r * 2 });
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

// Session signée (HMAC-SHA256) : « données.signature »
export const SESSION_MAX_AGE_SECONDS = 8 * 60 * 60;

function sign(data: string, secret: string) {
  return createHmac("sha256", secret).update(data).digest("base64url");
}

export function createSessionToken(secret: string, now = Date.now()): string {
  const payload = Buffer.from(
    JSON.stringify({ v: 1, exp: now + SESSION_MAX_AGE_SECONDS * 1000, n: randomBytes(8).toString("hex") }),
  ).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

// notBefore : les sessions ouvertes avant cette date sont refusées (déconnexion côté serveur)
export function verifySessionToken(
  token: string | undefined,
  secret: string,
  now = Date.now(),
  notBefore = 0,
): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = Buffer.from(sign(payload, secret));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    const issuedAt = data.exp - SESSION_MAX_AGE_SECONDS * 1000;
    return data.v === 1 && typeof data.exp === "number" && data.exp > now && issuedAt >= notBefore;
  } catch {
    return false;
  }
}

// Double authentification : codes TOTP à 6 chiffres (RFC 6238, applications Google Authenticator, etc.)
const BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function base32Decode(input: string): Buffer {
  const clean = input.toUpperCase().replace(/[^A-Z2-7]/g, "");
  let bits = "";
  for (const c of clean) bits += BASE32.indexOf(c).toString(2).padStart(5, "0");
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(parseInt(bits.slice(i, i + 8), 2));
  return Buffer.from(bytes);
}

export function base32Encode(buf: Buffer): string {
  let bits = "";
  for (const b of buf) bits += b.toString(2).padStart(8, "0");
  let out = "";
  for (let i = 0; i < bits.length; i += 5) out += BASE32[parseInt(bits.slice(i, i + 5).padEnd(5, "0"), 2)];
  return out;
}

export function totpCode(secret: Buffer, counter: number, digits = 6, algorithm = "sha1"): string {
  const msg = Buffer.alloc(8);
  msg.writeBigUInt64BE(BigInt(counter));
  const h = createHmac(algorithm, secret).update(msg).digest();
  const offset = h[h.length - 1] & 0xf;
  const bin = (h.readUInt32BE(offset) & 0x7fffffff) % 10 ** digits;
  return String(bin).padStart(digits, "0");
}

export function verifyTotp(secretBase32: string, code: string, now = Date.now()): boolean {
  if (!/^\d{6}$/.test(code)) return false;
  const secret = base32Decode(secretBase32);
  const counter = Math.floor(now / 1000 / 30);
  // Tolérance d'une période (30 s) avant et après
  return [-1, 0, 1].some((d) => {
    const expected = Buffer.from(totpCode(secret, counter + d));
    return timingSafeEqual(expected, Buffer.from(code));
  });
}

// Limiteur persistant : les compteurs sont lus et écrits dans le stockage (partagés entre serveurs)
export type AttemptLog = Record<string, { count: number; reset: number }>;

export function checkAttempts(log: AttemptLog, keys: Array<[key: string, max: number]>, now = Date.now()): boolean {
  return keys.some(([key, max]) => {
    const h = log[key];
    return Boolean(h && h.reset > now && h.count >= max);
  });
}

export function recordFailure(log: AttemptLog, keys: string[], windowMs = 15 * 60 * 1000, now = Date.now()): AttemptLog {
  const next: AttemptLog = {};
  for (const [k, v] of Object.entries(log)) if (v.reset > now) next[k] = v;
  for (const key of keys) {
    const h = next[key];
    next[key] = !h ? { count: 1, reset: now + windowMs } : { ...h, count: h.count + 1 };
  }
  return next;
}
