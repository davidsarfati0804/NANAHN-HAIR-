import type { Metadata } from "next";
import Link from "next/link";
import { logout } from "@/app/admin/actions";
import { adminTexts as t } from "@/content/site";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: t.title, robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-deep-violet px-5 py-3 text-white">
        <nav aria-label="Back-office">
          <ul className="flex flex-wrap gap-4 text-sm font-bold">
            {t.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="underline-offset-4 hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <form action={logout}>
          <button type="submit" className="rounded-full bg-white px-4 py-2 text-sm font-bold text-deep-violet">
            {t.logout}
          </button>
        </form>
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
