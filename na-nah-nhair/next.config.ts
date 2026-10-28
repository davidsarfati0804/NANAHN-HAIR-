import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));

const isDev = process.env.NODE_ENV === "development";

// Ressources autorisées : uniquement le site lui-même (à élargir pour Stripe en phase 6)
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Contexte Netlify connu au build seulement (absent à l'exécution des fonctions) : figé ici pour
  // séparer les données de la production, de site-2 et des aperçus (lib/deploy.ts)
  env: {
    NNH_BUILD_CONTEXT: process.env.CONTEXT ?? "",
    NNH_BUILD_BRANCH: process.env.BRANCH ?? "",
  },
  // Images servies telles quelles (pas d'optimiseur Netlify) : les photos produits ont leurs propres
  // versions responsives (scripts/preparer-photos.py)
  images: { unoptimized: true },
  turbopack: {
    root: projectRoot,
  },
  experimental: {
    // Photos produits envoyées depuis le back-office (4 Mo maximum, voir app/admin/actions.ts)
    serverActions: { bodySizeLimit: "5mb" },
  },
  // Ancienne page « Retours » remplacée par la page Rétractation (modification 39), et adresses du premier
  // site (branche main, archivé le 28/10/2026) vers leurs équivalents : Google et les anciens liens suivent
  async redirects() {
    const moved = (source: string, destination: string) => ({ source, destination, permanent: true });
    return [
      moved("/retours", "/retractation"),
      moved("/a-propos", "/mon-histoire"),
      moved("/produits/pack-zero-prise-de-tete", "/pack"),
      moved("/produits/:slug(fabulous|miraculous|luxurious)", "/soins/:slug"),
      moved("/produits/:autre*", "/soins"),
      moved("/produits", "/soins"),
      moved("/politique-confidentialite", "/confidentialite"),
      moved("/livraison-retours", "/faq#livraison"),
      moved("/routines", "/soins"),
      moved("/resultats", "/quiz"),
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/guide-de-style", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }, { key: "Cache-Control", value: "no-store" }] },
    ];
  },
};

export default nextConfig;
