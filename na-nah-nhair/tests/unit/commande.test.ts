import { describe, expect, it } from "vitest";
import { confirmationEmail } from "@/lib/emails/confirmation";
import { newOrderNumber, validateAddress } from "@/lib/order";

const address = { firstName: "Inès", lastName: "Martin", email: "ines@example.fr", phone: "", address: "1 rue de la Paix", postalCode: "75002", city: "Paris" };

describe("commande : adresse et numéro", () => {
  it("adresse valide acceptée, champs manquants ou invalides signalés", () => {
    expect(validateAddress(address)).toEqual({ ok: true, value: address });
    const r = validateAddress({ ...address, email: "x", postalCode: "750", city: " " });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.fields.sort()).toEqual(["city", "email", "postalCode"]);
    expect(validateAddress(null).ok).toBe(false);
  });

  it("téléphone facultatif, mais vérifié s'il est saisi", () => {
    expect(validateAddress({ ...address, phone: "06 12 34 56 78" }).ok).toBe(true);
    const r = validateAddress({ ...address, phone: "abc" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.fields).toEqual(["phone"]);
  });

  it("livraison en France métropolitaine, Corse comprise : outre-mer refusé", () => {
    expect(validateAddress({ ...address, postalCode: "20000" }).ok).toBe(true);
    for (const cp of ["97100", "97400", "98800"]) expect(validateAddress({ ...address, postalCode: cp }).ok, cp).toBe(false);
  });

  it("numéro de commande lisible et unique", () => {
    const a = newOrderNumber(new Date("2026-10-23T10:00:00Z"));
    expect(a).toMatch(/^NNH-20261023-[0-9A-F]{6}$/);
    expect(newOrderNumber()).not.toBe(newOrderNumber());
  });
});

describe("email de confirmation", () => {
  const mail = confirmationEmail(
    {
      orderNumber: "NNH-20261023-ABC123",
      firstName: "Inès",
      lines: [{ name: "Fabulous Hair Serum", quantity: 1, totalCents: 1990 }],
      shippingCents: 0,
      freeShipping: true,
      totalCents: 1990,
      address: "1 rue de la Paix, 75002 Paris",
    },
    "https://exemple.fr",
  );

  it("objet, rétractation 14 jours, liens CGV et formulaire, email de contact uniquement", () => {
    expect(mail.subject).toBe("Ta commande NA NAH N'HAIR est confirmée");
    expect(mail.text).toContain("Tu disposes de 14 jours à compter de la réception de ta commande pour te rétracter");
    expect(mail.text).toContain("https://exemple.fr/cgv");
    expect(mail.text).toContain("https://exemple.fr/retractation");
    expect(mail.text).toContain("Contact@nanahnhair.com");
    expect(mail.text).not.toMatch(/01 80 18 29 29|téléphone/i);
    expect(mail.text).toContain("Livraison offerte");
    expect(mail.html).toContain('<a href="https://exemple.fr/cgv">');
    // Franchise en base de TVA (modification 53)
    expect(mail.text).toContain("TVA non applicable, article 293 B du CGI");
    expect(mail.text).not.toContain("TTC");
  });

  it("CGV et formulaire de rétractation joints en PDF", () => {
    expect(mail.attachments.map((a) => a.filename)).toEqual(["cgv-v1.pdf", "formulaire-de-retractation.pdf"]);
  });
});
