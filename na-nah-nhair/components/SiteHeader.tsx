"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { brand, navigation } from "@/content/site";
import CartCount from "@/components/cart/CartCount";
import Image from "next/image";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isCurrent = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

  // Échap ferme le menu mobile
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-lavender bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Logo transparent (SVG) centré dans un encadré crème aux coins arrondis (modification 18) */}
        <Link
          href="/"
          className="flex h-16 shrink-0 items-center justify-center rounded-[1.25rem] border border-lavender-soft bg-logo-yellow px-2.5 py-2 sm:h-[4.5rem] sm:rounded-[1.5rem] sm:px-3 sm:py-2.5"
        >
          <Image
            src={brand.logoSvg.src}
            width={brand.logoSvg.width}
            height={brand.logoSvg.height}
            alt={brand.logo.headerAlt}
            priority
            unoptimized
            className="h-full w-auto"
          />
        </Link>

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-6 text-sm font-bold uppercase tracking-wide">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  className="text-deep-violet hover:underline aria-[current=page]:text-deep-violet aria-[current=page]:underline aria-[current=page]:underline-offset-8"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <CartCount />
          <button
            type="button"
            className="min-h-11 rounded-full bg-deep-violet px-4 py-2 text-sm font-bold uppercase text-white lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Fermer" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <nav id="menu-mobile" aria-label="Navigation mobile" className="border-t border-lavender lg:hidden">
          <ul className="mx-auto max-w-6xl px-4 py-2 sm:px-6">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  className="block py-3 font-display text-3xl text-deep-violet aria-[current=page]:text-deep-violet"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
