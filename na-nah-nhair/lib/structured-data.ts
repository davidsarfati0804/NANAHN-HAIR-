import { brand, legal } from "@/content/site";
import type { PublicProduct } from "@/lib/catalog";
import { siteUrl } from "@/lib/site-url";

export function productJsonLd(p: { name: string; description: string; path: string; shop: PublicProduct }) {
  const url = `${siteUrl()}${p.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    brand: { "@type": "Brand", name: brand.name },
    ...(p.shop.photoUrl ? { image: `${siteUrl()}${p.shop.photoUrl}` } : {}),
    url,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "EUR",
      price: (p.shop.priceCents / 100).toFixed(2),
      availability: p.shop.available === 0 ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.name,
    url: siteUrl(),
    email: legal.email,
    telephone: legal.phone,
    address: { "@type": "PostalAddress", streetAddress: "24 rue Octave Feuillet", postalCode: "75116", addressLocality: "Paris", addressCountry: "FR" },
  };
}
