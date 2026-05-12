import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/ecommerce/AboutFaqFooter";
import MarqueeBar from "@/components/ecommerce/MarqueeBar";
import PageIntro from "@/components/ecommerce/PageIntro";
import { WinningMixSection } from "@/components/ecommerce/ProductSections";
import SiteHeader from "@/components/ecommerce/SiteHeader";
import { mixUsageCopy, routineSteps } from "@/data/site";

export const metadata: Metadata = {
  title: "Routines | Na Nah N’hair",
  description: "Comprends comment alterner les sérums Na Nah N’hair selon tes besoins.",
};

export default function RoutinesPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--color-ink)]">
      <MarqueeBar />
      <SiteHeader />
      <main>
        <PageIntro
          eyebrow="Routines"
          title="Un mix simple pour chaque moment"
          text="Pas besoin d’une routine compliquée. Alterne les sérums selon ce que tes cheveux réclament : nutrition, vitalité ou brillance."
        />
        <section className="bg-white px-5 pb-16 lg:px-8 lg:pb-20">
          <div className="mx-auto grid max-w-7xl gap-5">
            {routineSteps.map((step) => (
              <article key={step.title} className="rounded-[1.5rem] border border-[var(--color-lavender-mist)] bg-[var(--color-blush)] p-6">
                <h2 className="text-2xl font-black text-[var(--color-deep-violet)]">{step.title}</h2>
                <p className="mt-3 whitespace-pre-line leading-7 text-[var(--color-ink)]">{step.text}</p>
              </article>
            ))}
            {[mixUsageCopy].map((step) => (
              <article key={step.title} className="rounded-[1.5rem] border border-[var(--color-lavender-mist)] bg-white p-6 shadow-[0_14px_34px_rgba(53,32,95,0.07)]">
                <h2 className="text-2xl font-black text-[var(--color-deep-violet)]">{step.title}</h2>
                <p className="mt-3 whitespace-pre-line leading-7 text-[var(--color-ink)]">{step.text}</p>
              </article>
            ))}
          </div>
        </section>
        <WinningMixSection />
        <section className="bg-white px-5 py-12 text-center lg:px-8">
          <Link href="/boutique" className="inline-flex rounded-full bg-[var(--color-lavender)] px-7 py-4 font-black text-white">
            Composer mon mix
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
