import type { Metadata } from "next";
import { notFound } from "next/navigation";
import UpcomingPage from "@/components/UpcomingPage";
import { productBySlug, products, upcomingPages } from "@/content/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: productBySlug(slug)?.name, robots: { index: false } };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = productBySlug(slug);
  if (!product) notFound();
  return <UpcomingPage title={product.name} phase={upcomingPages.soins.phase} />;
}
