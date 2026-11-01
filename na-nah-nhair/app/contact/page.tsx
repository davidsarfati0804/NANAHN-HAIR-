import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import LavenderBox from "@/components/LavenderBox";
import { contactTexts as t, legal } from "@/content/site";
import { BrandText } from "@/components/BrandName";

export const metadata: Metadata = { title: t.title, description: t.intro, alternates: { canonical: "/contact" } };

export default function ContactPage() {
  return (
    // Ordinateur (modification 63) : conteneur centré, formulaire à gauche (60 %), coordonnées à droite (40 %),
    // carte alignée sur le premier champ et visible au défilement. Tablette et mobile : l'un sous l'autre.
    <div className="mx-auto grid max-w-5xl px-4 py-10 sm:px-6 sm:py-24 lg:max-w-6xl lg:grid-cols-[3fr_2fr] lg:gap-x-14">
      <div className="lg:col-start-1">
        <h1 className="titre-h1">{t.title}</h1>
        <p className="mb-8 mt-3 accroche">{t.intro}</p>
      </div>
      <div className="lg:col-start-1 lg:row-start-2">
        <ContactForm />
      </div>
      <aside className="mt-8 sm:mt-10 lg:sticky lg:top-28 lg:col-start-2 lg:row-start-2 lg:mt-5 lg:self-start">
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
