import type { Metadata } from "next";
import UpcomingPage from "@/components/UpcomingPage";
import { upcomingPages } from "@/content/site";

export const metadata: Metadata = { title: upcomingPages.soins.title, robots: { index: false } };

export default function SoinsPage() {
  return <UpcomingPage {...upcomingPages.soins} />;
}
