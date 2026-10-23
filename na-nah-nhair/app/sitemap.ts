import type { MetadataRoute } from "next";
import { legalDocs } from "@/content/juridique";
import { products } from "@/content/site";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const paths = [
    "/",
    "/soins",
    ...products.map((p) => `/soins/${p.slug}`),
    "/pack",
    "/boutique",
    "/quiz",
    "/mon-histoire",
    "/faq",
    "/contact",
    ...legalDocs.map((d) => `/${d.slug}`),
  ];
  return paths.map((path) => ({ url: `${base}${path}`, changeFrequency: "weekly", priority: path === "/" ? 1 : 0.7 }));
}
