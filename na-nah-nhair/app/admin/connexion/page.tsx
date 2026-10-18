import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { adminTexts as t } from "@/content/site";
import { adminConfig, isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: t.login.title, robots: { index: false, follow: false } };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  const config = adminConfig();
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-6xl text-deep-violet">{t.login.title}</h1>
      {config.configured ? (
        <LoginForm withTotp={Boolean(config.totpSecret)} />
      ) : (
        <p role="alert" className="mt-8 rounded-3xl bg-yellow p-5 font-bold text-ink">
          {t.login.notConfigured}
        </p>
      )}
    </div>
  );
}
