import Link from "next/link";
import { brand, footer, legal } from "@/content/site";
import ToComplete from "@/components/ToComplete";
import Wordmark from "@/components/Wordmark";

export default function SiteFooter() {
  return (
    <footer className="mt-16 bg-deep-violet text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <Wordmark className="text-5xl" />
          <p className="mt-4 font-bold">{brand.signature}</p>
          <p className="mt-2 text-sm uppercase tracking-widest">{brand.madeIn}</p>
        </div>

        <div>
          <h2 className="text-2xl">{footer.contactTitle}</h2>
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
          <h2 className="mt-6 text-2xl">{footer.followTitle}</h2>
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
          <ul className="space-y-1 text-sm">
            {footer.legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="inline-block py-1.5 underline-offset-4 hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="border-t border-white/20 px-4 py-4 text-center text-xs">
        © {new Date().getFullYear()} {legal.brand} · SIRET {legal.siret}
      </p>
    </footer>
  );
}
