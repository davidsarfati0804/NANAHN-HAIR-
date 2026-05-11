import Link from "next/link";
import { Droplets, Sparkles } from "lucide-react";
import { pack, products } from "@/data/products";
import { packBenefits } from "@/data/site";
import AddToCartButton from "./AddToCartButton";
import ImagePlaceholder from "./ImagePlaceholder";

export function ProductGrid() {
  return (
    <section id="boutique" className="bg-white px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-plum)]">Boutique</p>
            <h2 className="mt-3 text-4xl font-black text-[var(--color-deep-violet)] md:text-6xl">
              Choisis ton remix capillaire
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-[var(--color-ink)]">
            Des routines simples, des textures plaisir, et une approche cosmétique prudente pour sublimer tes cheveux.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.id}
              id={product.id}
              className="group flex min-h-[500px] flex-col rounded-[2rem] border border-[var(--color-lavender-mist)] bg-white p-5 shadow-[0_18px_45px_rgba(53,32,95,0.08)] transition hover:-translate-y-1"
            >
              {/* TODO: remplacer ce placeholder par la photo produit détourée. */}
              <div className="mb-5 grid min-h-48 place-items-center rounded-[1.5rem] bg-[var(--color-lavender-soft)] text-[var(--color-deep-violet)]">
                <div className="flex items-end gap-2">
                  <span className="h-24 w-10 rounded-t-full rounded-b-xl bg-[var(--color-lavender)]" />
                  <span className="h-32 w-12 rounded-t-full rounded-b-xl bg-[var(--color-plum)]" />
                </div>
              </div>
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="inline-flex items-center gap-2 rounded-full bg-[var(--color-lavender)] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-white">
                    <Droplets size={13} />
                    {product.scent}
                  </p>
                  <h3 className="mt-4 text-2xl font-black text-[var(--color-deep-violet)]">{product.name}</h3>
                </div>
                <p className="whitespace-nowrap rounded-2xl bg-[var(--color-lavender-soft)] px-3 py-2 text-lg font-black text-[var(--color-deep-violet)]">
                  {product.price}
                </p>
              </div>
              <p className="text-sm font-bold text-[var(--color-plum)]">{product.accent}</p>
              <p className="mt-3 flex-1 text-base leading-7 text-[var(--color-ink)]">{product.description}</p>
              <div className="mt-6 grid gap-3">
                <AddToCartButton item={product} />
                <Link href={`/produits/${product.id}`} className="rounded-full border border-[var(--color-lavender)] px-5 py-3 text-center font-bold text-[var(--color-deep-violet)] transition hover:bg-[var(--color-lavender-soft)]">
                  Voir le produit
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PackSection() {
  return (
    <section id="pack" className="bg-[var(--color-lavender)] px-5 py-16 text-white lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/16 px-4 py-2 text-sm font-black uppercase tracking-[0.14em]">
            <Sparkles size={16} />
            {pack.subtitle}
          </p>
          <h2 className="text-4xl font-black md:text-6xl">{pack.name}</h2>
          <p className="mt-5 text-5xl font-black">{pack.price}</p>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/92">{pack.description}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <AddToCartButton item={pack} label="Commander le pack" variant="white" />
            <Link href="#mix-gagnant" className="rounded-full border border-white/50 px-7 py-4 text-center font-black text-white transition hover:-translate-y-0.5 hover:bg-white/10">
              Pourquoi c’est le mix gagnant ?
            </Link>
          </div>
        </div>
        {/* TODO: remplacer par une photo des 3 produits ensemble au spa à Maurice. */}
        <ImagePlaceholder label="Photo pack spa à Maurice" tone="dark" className="min-h-[430px] border-white/25" />
      </div>
    </section>
  );
}

export function WinningMixSection() {
  return (
    <section id="mix-gagnant" className="bg-[var(--color-blush)] px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-4xl font-black text-[var(--color-deep-violet)] md:text-6xl">
          Ce qu’il y a dans ton pack
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {packBenefits.map((benefit, index) => (
            <article key={benefit.title} className="rounded-[2rem] bg-white p-6 shadow-[0_18px_45px_rgba(53,32,95,0.08)]">
              <div className="mb-6 grid h-12 w-12 place-items-center rounded-full bg-[var(--color-lavender)] text-xl font-black text-white">
                {index + 1}
              </div>
              <h3 className="text-xl font-black text-[var(--color-deep-violet)]">{benefit.title}</h3>
              <p className="mt-3 leading-7 text-[var(--color-ink)]">{benefit.text}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 rounded-[2rem] bg-[var(--color-deep-violet)] p-7 text-white md:p-10">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-white/70">Mode d’emploi</p>
          <p className="mt-4 text-xl font-bold leading-9">
            Alterne les sérums selon tes besoins ou crée ta propre routine : Miraculous en cure, Fabulous au quotidien, et Luxurious pour briller en sortie. Masse, chante, rayonne ✨ C’est toi l’artiste.
          </p>
        </div>
      </div>
    </section>
  );
}
