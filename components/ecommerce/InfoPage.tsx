import { SiteFooter } from "./AboutFaqFooter";
import MarqueeBar from "./MarqueeBar";
import PageIntro from "./PageIntro";
import SiteHeader from "./SiteHeader";

type InfoPageProps = {
  eyebrow: string;
  title: string;
  text: string;
  sections: Array<{
    title: string;
    text: string;
  }>;
};

export default function InfoPage({ eyebrow, title, text, sections }: InfoPageProps) {
  return (
    <div className="min-h-screen bg-white text-[var(--color-ink)]">
      <MarqueeBar />
      <SiteHeader />
      <main>
        <PageIntro eyebrow={eyebrow} title={title} text={text} />
        <section className="bg-white px-5 pb-16 lg:px-8 lg:pb-20">
          <div className="mx-auto grid max-w-4xl gap-4">
            {sections.map((section) => (
              <article key={section.title} className="rounded-[1.2rem] border border-[var(--color-lavender-mist)] bg-[var(--color-blush)] p-6">
                <h2 className="text-2xl font-black text-[var(--color-deep-violet)]">{section.title}</h2>
                <p className="mt-3 leading-7 text-[var(--color-ink)]">{section.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
