import Link from "next/link";
import { Camera, Mail, Music2 } from "lucide-react";
import { faqs, values } from "@/data/site";

export function AboutSection() {
  return (
    <section id="apropos" className="bg-white px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="rounded-[2rem] bg-[var(--color-lavender)] p-8 text-white md:p-10">
          <Music2 size={34} />
          <h2 className="mt-6 text-4xl font-black md:text-6xl">De ma chambre à vos salles de bain</h2>
        </div>
        <div>
          <p className="text-xl font-bold leading-9 text-[var(--color-ink)]">
            Na Nah N’hair est née d’un moment de partage, d’entraide et de complicité. Tout a commencé avec l’envie d’aider une femme incroyable à retrouver confiance après une période difficile. De soins faits avec amour est née une marque pensée pour faire du bien aux cheveux, mais aussi au moral.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {values.map((value) => (
              <span key={value} className="rounded-full bg-[var(--color-lavender-soft)] px-5 py-3 font-black text-[var(--color-deep-violet)]">
                {value}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  return (
    <section id="faq" className="bg-[var(--color-blush)] px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-4xl font-black text-[var(--color-deep-violet)] md:text-6xl">FAQ</h2>
        <div className="mt-8 divide-y divide-[var(--color-lavender-mist)] overflow-hidden rounded-[2rem] bg-white shadow-[0_16px_36px_rgba(53,32,95,0.08)]">
          {faqs.map((faq) => (
            <details key={faq.question} className="group p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-black text-[var(--color-deep-violet)]">
                {faq.question}
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--color-lavender-soft)] text-[var(--color-plum)] transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 leading-7 text-[var(--color-ink)]">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CartPlaceholder() {
  return (
    <section id="panier" className="bg-white px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-[var(--color-lavender-mist)] p-7 md:flex md:items-center md:justify-between md:p-10">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-plum)]">Panier</p>
          <h2 className="mt-2 text-3xl font-black text-[var(--color-deep-violet)]">Prêt pour le tunnel e-commerce</h2>
          <p className="mt-3 max-w-2xl leading-7 text-[var(--color-ink)]">
            Les boutons sont prêts à être connectés à Shopify, Stripe, Medusa, WooCommerce ou un panier sur mesure.
          </p>
        </div>
        <Link href="#boutique" className="mt-6 inline-flex rounded-full bg-[var(--color-lavender)] px-6 py-4 font-black text-white md:mt-0">
          Continuer le shopping
        </Link>
      </div>
    </section>
  );
}

export function SiteFooter() {
  const links = [
    "Contact",
    "Livraison & retours",
    "CGV",
    "Mentions légales",
    "Politique de confidentialité",
  ];

  return (
    <footer className="bg-[var(--color-deep-violet)] px-5 py-12 text-white lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_1.3fr_0.7fr]">
        <div>
          <div className="grid h-16 w-24 place-items-center rounded-2xl bg-[var(--color-lavender)] text-center text-xs font-black leading-none">
            NA
            <br />
            NAH
            <br />
            N’HAIR
          </div>
          <p className="mt-5 text-sm text-white/70">Copyright Na Nah N’hair</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {links.map((link) => (
            <Link key={link} href="#" className="text-sm font-bold text-white/82 transition hover:text-white">
              {link}
            </Link>
          ))}
          {/* TODO: remplacer les liens # par les vraies pages CGV, mentions légales, confidentialité, livraison et retours. */}
        </div>
        <div className="flex gap-3 md:justify-end">
          <Link href="mailto:contact@nanahnhair.example" className="grid h-11 w-11 place-items-center rounded-full bg-white/10" aria-label="Contact email">
            <Mail size={18} />
          </Link>
          <Link href="#" className="grid h-11 w-11 place-items-center rounded-full bg-white/10" aria-label="Instagram Na Nah N'hair">
            <Camera size={18} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
