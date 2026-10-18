import type { MetadataRoute } from "next";
import { isIndexable, siteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  if (!isIndexable()) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/panier", "/commande", "/quiz/resultat"] },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
