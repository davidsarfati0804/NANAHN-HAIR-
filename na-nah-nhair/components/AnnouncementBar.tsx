import Link from "next/link";
import { announcement } from "@/content/site";
import { BrandText } from "@/components/BrandName";

export default function AnnouncementBar() {
  return (
    <Link
      href={announcement.href}
      className="block bg-logo-yellow px-4 py-1.5 text-center text-base sm:py-2.5 sm:text-[1.2rem] font-bold leading-snug text-deep-violet underline-offset-4 hover:underline"
    >
      <BrandText text={announcement.text} tone="logo" />
    </Link>
  );
}
