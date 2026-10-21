import Link from "next/link";
import { brand, footer, legal } from "@/content/site";
import ToComplete from "@/components/ToComplete";
import BrandName, { BrandText } from "@/components/BrandName";

export default function SiteFooter() {
  return (
    <footer className="mt-10 bg-deep-violet sm:mt-16 text-white">
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
            {legal.instagram ? (
              <a href={legal.instagram} className="inline-block py-1.5 underline underline-offset-4">
                Instagram
              </a>
            ) : (
              <ToComplete label="lien Instagram" />
            )}
          </div>
        </div>

        <nav aria-label="Informations légales">
          <ul className="flex flex-wrap gap-x-4 text-sm md:block md:space-y-1">
            {footer.legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline md:inline-block md:min-h-0 md:py-1.5">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="border-t border-white/20 px-4 py-4 text-center text-sm">
        © {new Date().getFullYear()} <BrandText text={legal.brand} /> · SIRET {legal.siret}
      </p>
    </footer>
  );
}
