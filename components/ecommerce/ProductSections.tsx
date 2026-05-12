import Image from "next/image";
import Link from "next/link";
import { Droplets } from "lucide-react";
import { pack, products } from "@/data/products";
import { packBenefits } from "@/data/site";
import AddToCartButton from "./AddToCartButton";

export function ProductGrid() {
  return (
    <section id="boutique" className="bg-white px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-plum)]">Boutique</p>
            <h2 className="mt-3 text-4xl font-black text-[var(--color-deep-violet)] md:text-6xl">
              Choisis ton mix capillaire
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
          <h2 className="inline-flex rounded-full bg-white px-4 py-2 text-lg font-black uppercase tracking-[0.08em] text-[var(--color-deep-violet)] md:text-xl">
            Pack routine
          </h2>
          <p className="mt-5 text-3xl font-black md:text-4xl">Le pack - Zéro prise de tête</p>
          <p className="mt-4 text-2xl font-black">{pack.price}</p>
          <p className="mt-4 max-w-xl text-lg font-bold leading-8 text-white">
            La routine idéale pour des cheveux nourris, stimulés et lumineux
            <br />
            Parce que tes cheveux méritent qu’on prenne soin d’eux tout simplement ✨
          </p>
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
          <p className="text-sm font-black uppercase tracking-[0.18em] text-white/70">Mode d’emploi du Remix</p>
          <p className="mt-4 text-xl font-bold leading-9">
            Alternes les sérums selon tes besoins ou crées ta propre routine : Miraculous en cure, Fabulous au quotidien, et Luxurious pour briller en sortie. Masses, vibres, rayonne ✨ C’est toi l’artiste !
          </p>
        </div>
      </div>
    </section>
  );
}
