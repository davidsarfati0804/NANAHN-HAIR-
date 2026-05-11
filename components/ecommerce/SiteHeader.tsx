import Image from "next/image";
import Link from "next/link";
import { navigation } from "@/data/site";
import CartLink from "./CartLink";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-lavender-mist)] bg-white/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 lg:px-8">
        <Link
          href="/#accueil"
          className="relative block h-16 w-[86px] shrink-0 overflow-hidden rounded-xl bg-[var(--color-deep-violet)] shadow-sm ring-1 ring-[var(--color-lavender-mist)] transition hover:opacity-85 sm:h-[76px] sm:w-[102px]"
          aria-label="Na Nah N'hair accueil"
        >
          <Image
            src="/images/logo-na-nah-nhair-yellow.png"
            alt=""
            fill
            priority
            sizes="(min-width: 640px) 102px, 86px"
            className="object-contain p-1.5"
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
          <div className="lg:hidden">
            <CartLink compact />
          </div>
          <div className="hidden lg:block">
            <CartLink />
          </div>
          <Link
            href="/#boutique"
            className="rounded-full bg-[var(--color-lavender)] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(170,161,200,0.45)] transition hover:-translate-y-0.5 hover:bg-[var(--color-plum)]"
          >
            Commander maintenant
          </Link>
        </div>
      </div>
      <nav className="flex gap-4 overflow-x-auto px-5 pb-3 text-sm font-semibold text-[var(--color-deep-violet)] lg:hidden">
        {navigation.slice(0, -1).map((item) => (
          <Link key={item.href} href={item.href} className="shrink-0">
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
