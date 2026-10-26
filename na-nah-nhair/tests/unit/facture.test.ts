import { describe, expect, it } from "vitest";
import { invoiceHtml } from "@/lib/invoices/invoice";

const html = invoiceHtml({
  invoiceNumber: "F-2026-0001",
  orderNumber: "NNH-20261026-ABC123",
  date: "2026-10-26",
  customer: { name: "Inès Martin (test)", address: "1 rue de la Paix, 75002 Paris" },
  lines: [{ name: "Fabulous Hair Serum", quantity: 2, unitCents: 1990, totalCents: 3980 }],
  shippingCents: 0,
  freeShipping: true,
  totalCents: 3980,
});

describe("facture (franchise en base de TVA)", () => {
  it("identité de la société en en-tête, mention 293 B, aucune TVA ni « TTC »", () => {
    for (const v of ["BIOTYVIE", "SARL à associé unique au capital de 1 000 €", "RCS Paris 922 151 170", "SIRET 922 151 170 00011", "24 rue Octave Feuillet, 75116 Paris", "TVA non applicable, article 293 B du CGI"])
      expect(html.replaceAll(" ", " ")).toContain(v);
    expect(html).not.toMatch(/TTC|TVA \d|Montant TVA|HT\b/);
    expect(html).toContain("39,80");
  });
});

// Facture de test pour vérification visuelle : FACTURE_TEST=1 npx vitest run tests/unit/facture.test.ts
// puis node scripts/generer-facture-test.mjs (PDF et capture dans captures/)
it.runIf(process.env.FACTURE_TEST === "1")("écrit la facture de test", async () => {
  const { mkdirSync, writeFileSync } = await import("node:fs");
  mkdirSync("captures", { recursive: true });
  writeFileSync("captures/facture-test.html", html);
});
