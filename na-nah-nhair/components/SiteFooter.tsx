import Link from "next/link";
import { brand, contactTexts, footer, legal } from "@/content/site";
import ManageCookiesButton from "@/components/consent/ManageCookiesButton";
import BrandName, { BrandText } from "@/components/BrandName";

export default function SiteFooter() {
  return (
    <footer className="mt-10 bg-deep-violet sm:mt-16 text-white print:hidden">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:gap-10 sm:px-6 sm:py-24 md:grid-cols-3">
        <div>
          <p className="text-4xl">
            <BrandName />
          </p>
          <p className="mt-4 font-bold">
            <BrandText text={brand.signature} />
          </p>
          <p className="mt-2 text-sm uppercase tracking-widest">{brand.madeIn}</p>
        </div>

        <div>
          <h2 className="titre-h3 text-white">{footer.contactTitle}</h2>
          <address className="mt-3 space-y-1 text-sm not-italic">
            <p>{legal.address}</p>
            <p>
              <a href={`tel:${legal.phone.replace(/\s/g, "")}`} className="inline-block py-1.5 underline underline-offset-4">
                {legal.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${legal.email}`} className="inline-block py-1.5 underline underline-offset-4">
                {legal.email}
              </a>
            </p>
          </address>
          <h2 className="mt-6 titre-h3 text-white">{footer.followTitle}</h2>
          <div className="mt-2">
            <a
              href={legal.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={contactTexts.instagramLabel}
              className="inline-block py-1.5 underline underline-offset-4"
            >
              {legal.instagramHandle}
            </a>
          </div>
        </div>

        <nav aria-label="Informations légales">
          {/* Une seule ligne de liens, séparés par « · » */}
          <ul className="flex flex-wrap items-center text-sm">
            {footer.legalLinks.map((link, i) => (
              <li key={link.href} className="flex items-center">
                <Link href={link.href} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                  {link.label}
                </Link>
                {/* Séparateur après le lien : jamais en début de ligne sur téléphone */}
                {i < footer.legalLinks.length - 1 && (
                  <span aria-hidden className="px-2">
                    ·
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="border-t border-white/20 px-4 py-4 text-center text-sm">
        © {new Date().getFullYear()} <BrandText text={legal.brand} /> · SIRET {legal.siret} · <ManageCookiesButton />
        <span className="mt-1 block text-[0.8125rem]">{legal.vatMention}</span>
      </p>
    </footer>
  );
}
