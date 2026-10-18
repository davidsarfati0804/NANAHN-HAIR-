import type { MetadataRoute } from "next";
import { legalPages } from "@/content/legal";
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
    ...legalPages.map((p) => `/${p.slug}`),
  ];
  return paths.map((path) => ({ url: `${base}${path}`, changeFrequency: "weekly", priority: path === "/" ? 1 : 0.7 }));
}
