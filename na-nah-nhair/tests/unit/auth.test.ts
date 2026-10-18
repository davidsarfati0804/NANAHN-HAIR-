import { describe, expect, it } from "vitest";
import {
  base32Decode,
  base32Encode,
  createRateLimiter,
  createSessionToken,
  hashPassword,
  totpCode,
  verifyPassword,
  verifySessionToken,
  verifyTotp,
} from "@/lib/auth-core";

describe("mot de passe", () => {
  it("haché avec sel, vérifié, jamais stocké en clair", () => {
    const h1 = hashPassword("un mot de passe solide");
    const h2 = hashPassword("un mot de passe solide");
    expect(h1).not.toContain("solide");
    expect(h1).not.toBe(h2);
    expect(verifyPassword("un mot de passe solide", h1)).toBe(true);
    expect(verifyPassword("mauvais", h1)).toBe(false);
    expect(verifyPassword("x", "pas-un-hash")).toBe(false);
  });
});

describe("session", () => {
  const secret = "s".repeat(40);
  it("valide, puis expirée après 8 h", () => {
    const now = Date.now();
    const token = createSessionToken(secret, now);
    expect(verifySessionToken(token, secret, now)).toBe(true);
    expect(verifySessionToken(token, secret, now + 8 * 3600 * 1000 + 1)).toBe(false);
  });
  it("falsification refusée", () => {
    const token = createSessionToken(secret);
    const [payload, sig] = token.split(".");
    const forged = Buffer.from(JSON.stringify({ v: 1, exp: Date.now() + 1e12 })).toString("base64url");
    expect(verifySessionToken(`${forged}.${sig}`, secret)).toBe(false);
    expect(verifySessionToken(`${payload}.${sig}x`, secret)).toBe(false);
    expect(verifySessionToken(token, "autre".repeat(10))).toBe(false);
    expect(verifySessionToken(undefined, secret)).toBe(false);
    expect(verifySessionToken("n'importe quoi", secret)).toBe(false);
  });
});

describe("double authentification TOTP", () => {
  it("vecteurs officiels RFC 6238 (SHA-1)", () => {
    const secret = Buffer.from("12345678901234567890");
    const cases: Array<[number, string]> = [
      [59, "94287082"],
      [1111111109, "07081804"],
      [1234567890, "89005924"],
      [2000000000, "69279037"],
    ];
    for (const [t, code] of cases) expect(totpCode(secret, Math.floor(t / 30), 8)).toBe(code);
  });
  it("base32 aller-retour et vérification avec tolérance de 30 s", () => {
    const raw = Buffer.from("12345678901234567890");
    const b32 = base32Encode(raw);
    expect(base32Decode(b32)).toEqual(raw);
    const now = 1_700_000_000_000;
    const code = totpCode(raw, Math.floor(now / 30000));
    expect(verifyTotp(b32, code, now)).toBe(true);
    expect(verifyTotp(b32, code, now + 30_000)).toBe(true);
    expect(verifyTotp(b32, code, now + 120_000)).toBe(false);
    expect(verifyTotp(b32, "abcdef", now)).toBe(false);
  });
});

describe("limitation des tentatives", () => {
  it("bloque après 5 échecs pendant 15 minutes", () => {
    const rl = createRateLimiter();
    const now = 0;
    for (let i = 0; i < 5; i++) rl.fail("ip", now);
    expect(rl.isBlocked("ip", now)).toBe(true);
    expect(rl.isBlocked("autre-ip", now)).toBe(false);
    expect(rl.isBlocked("ip", now + 15 * 60 * 1000 + 1)).toBe(false);
  });
});
