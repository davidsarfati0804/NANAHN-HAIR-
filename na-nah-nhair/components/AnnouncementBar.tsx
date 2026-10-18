import Link from "next/link";
import { announcement } from "@/content/site";

export default function AnnouncementBar() {
  return (
    <Link
      href={announcement.href}
      className="block bg-deep-violet px-4 py-3 text-center text-sm font-bold uppercase tracking-widest text-white hover:bg-plum"
    >
      {announcement.text}
    </Link>
  );
}
