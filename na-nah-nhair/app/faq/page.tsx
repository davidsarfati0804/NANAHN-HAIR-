import type { Metadata } from "next";
import FaqList from "@/components/FaqList";
import { faq, seo } from "@/content/site";

export const metadata: Metadata = {
  alternates: { canonical: "/faq" },
  title: faq.title,
  description: seo.faqDescription,
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="titre-h1">{faq.title}</h1>
      <nav aria-label="Rubriques de la FAQ" className="mt-6 flex flex-wrap gap-2">
        {faq.groups.map((g) => (
          <a
            key={g.title}
            href={`#${slugify(g.title)}`}
            className="inline-flex min-h-11 items-center rounded-full bg-lavender px-4 py-2 text-sm font-bold text-deep-violet hover:bg-lavender-soft"
          >
            {g.title}
          </a>
        ))}
      </nav>
      {faq.groups.map((g) => (
        <section key={g.title} aria-labelledby={slugify(g.title)} className="mt-12 scroll-mt-32">
          <h2 id={slugify(g.title)} className="mb-4 titre-h2">
            {g.title}
          </h2>
          <FaqList items={g.items} />
        </section>
      ))}
    </div>
  );
}

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
}
