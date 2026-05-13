"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navigation } from "@/data/site";
import CartLink from "./CartLink";

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const close = () => setIsMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--color-lavender-mist)] bg-white/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 lg:px-8">
          <Link
            href="/"
            className="relative block h-16 w-[112px] shrink-0 overflow-hidden rounded-xl bg-[var(--color-pantone-7499)] shadow-sm ring-1 ring-[var(--color-lavender-mist)] transition hover:opacity-85 sm:h-[76px] sm:w-[132px]"
            aria-label="Na Nah N'hair accueil"
            onClick={close}
          >
            <Image
              src="/images/logo-na-nah-nhair-brand.png"
              alt=""
              fill
              priority
              sizes="(min-width: 640px) 132px, 112px"
              className="object-contain p-1"
            />
          </Link>

          <nav className="hidden items-center gap-5 text-sm font-semibold text-[var(--color-deep-violet)] lg:flex">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-[var(--color-plum)]">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <CartLink compact />
            <Link
              href="/boutique"
              className="hidden rounded-full bg-[var(--color-lavender)] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(170,161,200,0.45)] transition hover:-translate-y-0.5 hover:bg-[var(--color-plum)] lg:inline-flex"
            >
              Commander maintenant
            </Link>
            <button
              onClick={() => setIsMenuOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-lavender-soft)] text-[var(--color-deep-violet)] transition hover:bg-[var(--color-lavender-mist)] lg:hidden"
              aria-label="Ouvrir le menu"
              type="button"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden">
          <div className="flex items-center justify-between border-b border-[var(--color-lavender-mist)] px-5 py-4">
            <Link
              href="/"
              className="relative block h-16 w-[112px] overflow-hidden rounded-xl bg-[var(--color-pantone-7499)] ring-1 ring-[var(--color-lavender-mist)]"
              onClick={close}
              aria-label="Accueil"
            >
              <Image
                src="/images/logo-na-nah-nhair-brand.png"
                alt=""
                fill
                sizes="112px"
                className="object-contain p-1"
              />
            </Link>
            <button
              onClick={close}
              className="grid h-11 w-11 place-items-center rounded-full bg-[var(--color-lavender-soft)] text-[var(--color-deep-violet)]"
              aria-label="Fermer le menu"
              type="button"
            >
              <X size={22} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5 py-4">
            {navigation.filter((item) => item.href !== "/panier").map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className="flex items-center border-b border-[var(--color-lavender-mist)] py-5 text-2xl font-black text-[var(--color-deep-violet)] transition hover:text-[var(--color-plum)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-[var(--color-lavender-mist)] px-5 pb-10 pt-5">
            <Link
              href="/boutique"
              onClick={close}
              className="block rounded-full bg-[var(--color-lavender)] px-7 py-4 text-center font-black text-white shadow-[0_12px_30px_rgba(170,161,200,0.45)]"
            >
              Commander maintenant
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
