import { Star } from "lucide-react";
import { reviews } from "@/data/site";

export default function ReviewsSection() {
  return (
    <section id="avis" className="bg-[var(--color-lavender-soft)] px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-4xl font-black text-[var(--color-deep-violet)] md:text-6xl">
          Elles ont rejoint le remix
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <article key={`${review.name}-${review.product}`} className="rounded-[2rem] bg-white p-6 shadow-[0_16px_36px_rgba(53,32,95,0.08)]">
              <div className="flex gap-1 text-[var(--color-gold)]" aria-label="5 étoiles">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={18} fill="currentColor" />
                ))}
              </div>
              <p className="mt-5 text-lg font-bold leading-8 text-[var(--color-ink)]">“{review.quote}”</p>
              <div className="mt-6 border-t border-[var(--color-lavender-mist)] pt-5">
                <p className="font-black text-[var(--color-deep-violet)]">{review.name}</p>
                <p className="mt-1 text-sm font-bold text-[var(--color-plum)]">{review.product}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
