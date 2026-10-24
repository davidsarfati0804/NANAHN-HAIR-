import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import LavenderBox from "@/components/LavenderBox";
import { contactTexts as t, legal } from "@/content/site";
import { BrandText } from "@/components/BrandName";

export const metadata: Metadata = { title: t.title, description: t.intro, alternates: { canonical: "/contact" } };

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:gap-10 sm:px-6 sm:py-24 md:grid-cols-[1.4fr_1fr]">
      <div>
        <h1 className="titre-h1">{t.title}</h1>
        <p className="mb-8 mt-3 accroche">{t.intro}</p>
        <ContactForm />
      </div>
      <aside className="md:pt-32">
        <LavenderBox>
          <h2 className="titre-h3">{t.coordinatesTitle}</h2>
          <address className="mt-3 space-y-1 not-italic">
            <p>
              <BrandText text={legal.brand} />
            </p>
            <p>{legal.address}</p>
            <p>
              <a href={`tel:${legal.phone.replace(/\s/g, "")}`} className="inline-block py-2.5 underline underline-offset-4">
                {legal.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${legal.email}`} className="inline-block py-2.5 underline underline-offset-4">
                {legal.email}
              </a>
            </p>
          </address>
          <h2 className="mt-6 titre-h3">{t.instagramTitle}</h2>
          <div className="mt-2">
            <a
              href={legal.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.instagramLabel}
              className="inline-block py-2.5 underline underline-offset-4"
            >
              {legal.instagramHandle}
            </a>
          </div>
        </LavenderBox>
      </aside>
    </div>
  );
}
