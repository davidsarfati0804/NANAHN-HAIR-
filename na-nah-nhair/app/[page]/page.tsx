import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ResetConsent from "@/components/consent/ResetConsent";
import LavenderBox from "@/components/LavenderBox";
import LegalMarkdown from "@/components/legal/LegalMarkdown";
import { legalDocBySlug, legalDocs, legalText } from "@/content/juridique";
import { legalTexts } from "@/content/site";

// Pages juridiques (modification 39) : mentions légales, CGV, rétractation, confidentialité, cookies
export const dynamicParams = false;

export function generateStaticParams() {
  return legalDocs.map((d) => ({ page: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const { page } = await params;
  const d = legalDocBySlug(page);
  return d ? { title: d.title, description: d.description, alternates: { canonical: `/${d.slug}` } } : {};
}

export default async function LegalPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const d = legalDocBySlug(page);
  if (!d) notFound();

  return (
    <article className="mx-auto max-w-2xl px-4 py-10 leading-relaxed sm:px-6 sm:py-24">
      {d.pdf && (
        <p className="mb-6 print:hidden">
          <a href={d.pdf.href} download className="bouton bouton--secondaire">
            {d.pdf.label}
          </a>
        </p>
      )}
      <LegalMarkdown md={legalText(d)} toc={d.slug === "cgv"} />
      {d.slug === "cookies" && (
        <LavenderBox className="mt-10 print:hidden">
          <p className="font-bold">{legalTexts.cookieChoiceTitle}</p>
          <ResetConsent />
        </LavenderBox>
      )}
      <p className="mt-10 print:hidden">
        <Link href="/contact" className="inline-block py-2 font-bold text-deep-violet underline underline-offset-4">
          {legalTexts.contactLink}
        </Link>
      </p>
    </article>
  );
}
