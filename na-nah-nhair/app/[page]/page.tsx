import type { Metadata } from "next";
import { notFound } from "next/navigation";
import UpcomingPage from "@/components/UpcomingPage";
import { upcomingPages } from "@/content/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(upcomingPages)
    .filter((page) => page !== "soins")
    .map((page) => ({ page }));
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const { page } = await params;
  return { title: upcomingPages[page]?.title, robots: { index: false } };
}

export default async function Page({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const info = upcomingPages[page];
  if (!info) notFound();
  return <UpcomingPage title={info.title} phase={info.phase} />;
}
