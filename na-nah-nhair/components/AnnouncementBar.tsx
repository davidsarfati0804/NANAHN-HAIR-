import Link from "next/link";
import { announcement } from "@/content/site";

export default function AnnouncementBar() {
  return (
    <Link
      href={announcement.href}
      className="block bg-logo-yellow px-4 py-2.5 text-center text-[1.2rem] font-bold leading-snug text-logo-violet underline-offset-4 hover:underline"
    >
      {announcement.text}
    </Link>
  );
}
