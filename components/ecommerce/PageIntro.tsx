type PageIntroProps = {
  eyebrow: string;
  title: string;
  text?: string;
};

export default function PageIntro({ eyebrow, title, text }: PageIntroProps) {
  return (
    <section className="bg-white px-5 py-12 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-plum)]">{eyebrow}</p>
        <h1 className="mt-3 max-w-4xl text-5xl font-black leading-none text-[var(--color-deep-violet)] md:text-7xl">
          {title}
        </h1>
        {text ? <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--color-ink)]">{text}</p> : null}
      </div>
    </section>
  );
}
