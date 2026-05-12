import Image from "next/image";
import Link from "next/link";
import { Droplets, Sparkles } from "lucide-react";
import { pack, products } from "@/data/products";
import AddToCartButton from "./AddToCartButton";

export function ProductGrid() {
  return (
    <section id="boutique" className="bg-white px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-plum)]">Boutique</p>
            <h2 className="mt-3 text-4xl font-black text-[var(--color-deep-violet)] md:text-6xl">
              choisis ton sérum capillaire ✨
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
              <div className="relative mb-5 aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-[var(--color-lavender-soft)]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  style={{ objectPosition: product.imagePosition }}
                />
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
              <p className="text-base font-black text-[var(--color-plum)]">{product.headline}</p>
              <p className="mt-3 flex-1 text-base leading-7 text-[var(--color-ink)]">{product.description}</p>
              <ul className="mt-4 space-y-2 text-sm font-bold text-[var(--color-ink)]">
                <li>Odeur : {product.scent}</li>
                <li>{product.price}</li>
              </ul>
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
          <p className="mt-5 max-w-2xl whitespace-pre-line text-lg leading-8 text-white/92">{pack.description}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <AddToCartButton item={pack} label="Commander le pack" variant="white" />
            <Link href="/routines" className="rounded-full border border-white/50 px-7 py-4 text-center font-black text-white transition hover:-translate-y-0.5 hover:bg-white/10">
              Pourquoi c’est le mix gagnant ?
            </Link>
          </div>
        </div>
        <div className="relative min-h-[430px] overflow-hidden rounded-[2rem] border border-white/25 bg-[var(--color-deep-violet)]">
          <Image
            src={pack.image}
            alt={pack.photoLabel}
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
            style={{ objectPosition: "50% 88%" }}
          />
        </div>
      </div>
    </section>
  );
}

export function WinningMixSection() {
  return (
    <section id="mix-gagnant" className="bg-[var(--color-blush)] px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-4xl font-black text-[var(--color-deep-violet)] md:text-6xl">
          Une routine simple, jamais figée ✨
        </h2>
        <p className="mt-5 max-w-3xl text-2xl font-black text-[var(--color-plum)]">Tes cheveux, ton rythme 💛</p>
        <p className="mt-5 max-w-3xl text-xl leading-9 text-[var(--color-ink)]">
          Tu choisis, tu alternes, tu ajustes tes sérums selon leurs besoins du moment.
          Sans routine compliquée — juste ce qu’il faut pour les nourrir et les sublimer.
        </p>
        <div className="mt-8 rounded-[2rem] bg-[var(--color-deep-violet)] p-7 text-white md:p-10">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-white/70">Mode d’emploi du mix ✨</p>
          <p className="mt-4 whitespace-pre-line text-xl font-bold leading-9">
            Écoute tes cheveux, ils savent ce dont ils ont besoin.

            Fabulous pour le quotidien, Miraculous pour transformer, Luxurious pour illuminer.

            Masse, ressens, rayonne ✨
            Ici, c’est toi qui crées ta magie.
          </p>
        </div>
      </div>
    </section>
  );
}
