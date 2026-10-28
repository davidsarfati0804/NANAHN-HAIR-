"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminTexts as t } from "@/content/site";
import { adminConfig, clientIp, endSession, requireAdmin, startSession } from "@/lib/auth";
import { checkAttempts, matchTotp, recordFailure, verifyPassword } from "@/lib/auth-core";
import { isProductId } from "@/lib/catalog";
import { parseEuroInput } from "@/lib/money";
import type { CarrierId } from "@/lib/settings";
import {
  appendAudit,
  deleteContactMessage,
  deleteMedia,
  getCatalog,
  getSettings,
  putMedia,
  saveCatalog,
  consumeTotpCounter,
  updateAttempts,
  saveSettings,
} from "@/lib/store";

// 5 essais par IP par tranche de 15 minutes (réservés avant la vérification : des envois simultanés ne
// passent pas la limite). Au-delà de 50 échecs toutes IP confondues, chaque essai est ralenti, mais les bons
// identifiants restent acceptés : personne ne peut bloquer la gérante.
const PER_IP = 5;
const GLOBAL_SLOWDOWN = 50;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export type FormState = { ok?: boolean; error?: string } | null;

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const config = adminConfig();
  if (!config.configured) return { error: t.login.notConfigured };
  const ip = await clientIp();
  const ipKey = `ip:${ip}`;
  let blocked = false;
  let busy = false;
  let tries = 0;
  await updateAttempts("login-attempts", (log) => {
    blocked = checkAttempts(log, [[ipKey, PER_IP]]);
    busy = checkAttempts(log, [["global", GLOBAL_SLOWDOWN]]);
    if (blocked) return log;
    const next = recordFailure(log, [ipKey, "global"]);
    tries = next[ipKey].count;
    return next;
  });
  if (blocked) return { error: t.login.blocked };
  if (busy) await sleep(2000);

  const password = String(formData.get("password") ?? "");
  const code = String(formData.get("totp") ?? "").replace(/\s/g, "");
  const passwordOk = password.length > 0 && password.length < 200 && verifyPassword(password, config.passwordHash);
  const counter = passwordOk && config.totpSecret ? matchTotp(config.totpSecret, code) : null;
  // Un code à 6 chiffres ne sert qu'une seule fois
  const ok = counter !== null && (await consumeTotpCounter(counter));

  if (!ok) {
    // Journal : le premier échec et le blocage seulement (pas d'inondation du journal)
    if (tries === 1 || tries === PER_IP) await appendAudit(tries === PER_IP ? "connexion bloquée 15 min" : "connexion refusée", `IP ${ip}`);
    await sleep(400); // ralentit les essais en série
    return { error: t.login.invalid };
  }
  await updateAttempts("login-attempts", (log) => {
    const { [ipKey]: _cleared, ...rest } = log;
    void _cleared;
    return rest;
  });
  await startSession();
  await appendAudit("connexion", `IP ${ip}`);
  redirect("/admin");
}

export async function logout() {
  await endSession();
  await appendAudit("déconnexion", "toutes les sessions fermées");
  redirect("/admin/connexion");
}

const PHOTO_TYPES: Record<string, (b: Uint8Array) => boolean> = {
  "image/jpeg": (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  "image/png": (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  "image/webp": (b) => String.fromCharCode(...b.slice(0, 4)) === "RIFF" && String.fromCharCode(...b.slice(8, 12)) === "WEBP",
};
const MAX_PHOTO_BYTES = 4 * 1024 * 1024;

export async function updateProduct(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = formData.get("id");
  if (!isProductId(id)) return { error: "Produit inconnu." };

  const priceCents = parseEuroInput(String(formData.get("price") ?? ""));
  if (priceCents === null || priceCents < 1 || priceCents > 1_000_000) return { error: t.products.errors.price };

  let stock: number | null = null;
  if (id !== "pack") {
    const raw = String(formData.get("stock") ?? "").trim();
    if (raw !== "") {
      if (!/^\d{1,6}$/.test(raw) || Number(raw) > 100_000) return { error: t.products.errors.stock };
      stock = Number(raw);
    }
  }
  const active = formData.get("active") === "on";

  const catalog = await getCatalog();
  const before = catalog[id];
  let photoKey = before.photoKey;

  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    if (photo.size > MAX_PHOTO_BYTES) return { error: t.products.errors.photoSize };
    const bytes = new Uint8Array(await photo.arrayBuffer());
    const check = PHOTO_TYPES[photo.type];
    if (!check || !check(bytes)) return { error: t.products.errors.photoType };
    const key = `${id}-${randomBytes(6).toString("hex")}`;
    await putMedia(key, bytes.buffer as ArrayBuffer, photo.type);
    if (before.photoKey) await deleteMedia(before.photoKey);
    photoKey = key;
  } else if (formData.get("removePhoto") === "on" && before.photoKey) {
    await deleteMedia(before.photoKey);
    photoKey = null;
  }

  catalog[id] = { ...before, priceCents, stock, active, photoKey };
  await saveCatalog(catalog);
  await appendAudit(
    "produit",
    `${id} : prix ${before.priceCents} → ${priceCents} c, stock ${before.stock ?? "non suivi"} → ${stock ?? "non suivi"}, ${active ? "actif" : "inactif"}${photoKey !== before.photoKey ? ", photo modifiée" : ""}`,
  );
  // Seule la page du back-office est rechargée (le formulaire affiche les valeurs enregistrées) ;
  // les pages du site sont rendues à chaque visite
  revalidatePath("/admin/produits");
  return { ok: true };
}

export async function updateShipping(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const threshold = parseEuroInput(String(formData.get("threshold") ?? ""));
  if (threshold === null || threshold > 10_000_000) return { error: t.shipping.errors.threshold };

  const settings = await getSettings();
  for (const id of Object.keys(settings.carriers) as CarrierId[]) {
    const raw = String(formData.get(`price-${id}`) ?? "").trim();
    const price = raw === "" ? null : parseEuroInput(raw);
    if (raw !== "" && (price === null || price > 100_000)) return { error: t.shipping.errors.price };
    settings.carriers[id] = { ...settings.carriers[id], priceCents: price, active: formData.get(`active-${id}`) === "on" };
  }
  const active = Object.values(settings.carriers).filter((c) => c.active);
  if (active.length === 0) return { error: t.shipping.errors.noCarrier };
  if (threshold > 0 && active.some((c) => c.priceCents === null)) return { error: t.shipping.errors.missingPrice };
  settings.freeShippingThresholdCents = threshold;
  await saveSettings(settings);
  await appendAudit("livraison", `seuil ${threshold} c, ${JSON.stringify(settings.carriers)}`);
  revalidatePath("/admin/livraison");
  return { ok: true };
}

export async function removeMessage(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!/^[a-f0-9]{16}$/.test(id)) return;
  await deleteContactMessage(id);
  await appendAudit("message supprimé", id);
  revalidatePath("/admin/messages");
}
