import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ResetConsent from "@/components/consent/ResetConsent";
import LavenderBox from "@/components/LavenderBox";
import ToComplete from "@/components/ToComplete";
import { legalBySlug, legalPages } from "@/content/legal";
import { legalTexts } from "@/content/site";
import { BrandText } from "@/components/BrandName";

// Pages juridiques : mentions légales, CGV, confidentialité, cookies, retours
export const dynamicParams = false;

export function generateStaticParams() {
  return legalPages.map((p) => ({ page: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const { page } = await params;
  const p = legalBySlug(page);
  return p ? { title: p.title, description: p.description, alternates: { canonical: `/${p.slug}` } } : {};
}

export default async function LegalPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const p = legalBySlug(page);
  if (!p) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-[clamp(2.75rem,10vw,5rem)] text-deep-violet">{p.title}</h1>
      {p.sections.map((s) => (
        <section key={s.title} className="mt-10">
          <h2 className="font-body text-2xl font-bold text-deep-violet">{s.title}</h2>
          {s.paragraphs?.map((para) => (
            <p key={para} className="mt-3">
              <BrandText text={para} />
            </p>
          ))}
          {s.items && (
            <ul className="mt-3 list-disc space-y-1 pl-6">
              {s.items.map((item) => (
                <li key={item}>
                  <BrandText text={item} />
                </li>
              ))}
            </ul>
          )}
          {s.todo && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {s.todo.map((t) => (
                <li key={t}>
                  <ToComplete label={t} className="text-xs" />
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
      {p.slug === "cookies" && (
        <LavenderBox className="mt-10">
          <p className="font-bold">{legalTexts.cookieChoiceTitle}</p>
          <ResetConsent />
        </LavenderBox>
      )}
      <p className="mt-10">
        <Link href="/contact" className="inline-block py-2 font-bold text-plum underline underline-offset-4">
          {legalTexts.contactLink}
        </Link>
      </p>
    </article>
  );
}
