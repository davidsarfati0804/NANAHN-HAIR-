import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import LavenderBox from "@/components/LavenderBox";
import ToComplete from "@/components/ToComplete";
import { contactTexts as t, legal } from "@/content/site";

export const metadata: Metadata = { title: t.title, description: t.intro, alternates: { canonical: "/contact" } };

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr]">
      <div>
        <h1 className="text-7xl text-deep-violet sm:text-8xl">{t.title}</h1>
        <p className="mb-8 mt-3 text-lg">{t.intro}</p>
        <ContactForm />
      </div>
      <aside className="md:pt-32">
        <LavenderBox>
          <h2 className="font-body text-xl font-bold">{t.coordinatesTitle}</h2>
          <address className="mt-3 space-y-1 not-italic">
            <p>{legal.brand}</p>
            <p>{legal.address}</p>
            <p>
              <a href={`tel:${legal.phone.replace(/\s/g, "")}`} className="inline-block py-1 underline underline-offset-4">
                {legal.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${legal.email}`} className="inline-block py-1 underline underline-offset-4">
                {legal.email}
              </a>
            </p>
          </address>
          <h2 className="mt-6 font-body text-xl font-bold">{t.instagramTitle}</h2>
          <div className="mt-2">
            {legal.instagram ? (
              <a href={legal.instagram} className="underline underline-offset-4" rel="noopener noreferrer" target="_blank">
                Instagram
              </a>
            ) : (
              <ToComplete label="lien Instagram" />
            )}
          </div>
        </LavenderBox>
      </aside>
    </div>
  );
}
