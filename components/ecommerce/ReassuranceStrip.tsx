import { Headphones, LockKeyhole, PackageCheck, Sparkles } from "lucide-react";
import { reassuranceItems } from "@/data/site";

const icons = [PackageCheck, Sparkles, LockKeyhole, Headphones];

export default function ReassuranceStrip() {
  return (
    <section className="bg-white px-5 py-10 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {reassuranceItems.map((item, index) => {
          const Icon = icons[index];

          return (
            <article key={item.title} className="rounded-[1.2rem] border border-[var(--color-lavender-mist)] bg-[var(--color-lavender-soft)] p-5">
              <Icon size={22} className="text-[var(--color-deep-violet)]" />
              <h3 className="mt-4 text-lg font-black text-[var(--color-deep-violet)]">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--color-ink)]">{item.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
