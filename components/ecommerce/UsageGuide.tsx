import Image from "next/image";

function UsageIcon({
  src,
  alt,
  className = "h-16 w-16",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <span className={`relative block shrink-0 ${className}`}>
      <Image src={src} alt={alt} fill sizes="128px" className="object-contain" />
    </span>
  );
}

export function UsageGuidePanel({ productName = "Na Nah N’hair Serum" }: { productName?: string }) {
  return (
    <div className="rounded-[1rem] border border-[var(--color-lavender-mist)] bg-white p-5 text-black md:p-7">
      <div className="grid gap-7 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="grid gap-6">
          <article className="grid items-start gap-4 sm:grid-cols-[1fr_112px]">
            <div>
              <h3 className="text-2xl font-black uppercase tracking-[0.01em] text-black">Etape 1</h3>
              <p className="mt-2 text-lg font-medium leading-7 text-black md:text-xl md:leading-8">
                Utiliser <strong>{productName}</strong> des racines vers les pointes.
                <br />
                Pour un soin complet : 3 pipettes sont nécessaires à appliquer sur le cuir chevelu, les longueurs et les pointes.
              </p>
            </div>
            <div className="justify-self-center rounded-full bg-white p-2">
              <UsageIcon src="/images/usage/dropper.png" alt="Application du sérum à la pipette" className="h-28 w-28" />
            </div>
          </article>

          <article className="grid items-start gap-4 sm:grid-cols-[105px_1fr]">
            <div className="justify-self-center rounded-full bg-white p-2 sm:pt-1">
              <UsageIcon src="/images/usage/wash.png" alt="Massage et lavage des cheveux" className="h-24 w-24" />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-[0.01em] text-black">Etape 2</h3>
              <p className="mt-2 text-lg font-medium leading-7 text-black md:text-xl md:leading-8">
                Laver les cheveux avec un shampoing classique.
                <br />
                Pour un résultat optimisé, utiliser le soin 3 X par semaine.
              </p>
            </div>
          </article>
        </div>

        <div className="grid content-center gap-4 rounded-[1rem] bg-[var(--color-blush)] p-4 text-base leading-6 text-black md:p-5 md:text-lg">
          <div className="grid items-center gap-4 sm:grid-cols-[70px_1fr]">
            <UsageIcon src="/images/usage/color.png" alt="" className="h-14 w-14" />
            <p>Ne pas utiliser le soin les 2 jours qui précèdent et suivent la coloration.</p>
          </div>

          <div className="grid items-center gap-4 sm:grid-cols-[70px_1fr]">
            <UsageIcon src="/images/usage/eye.png" alt="" className="h-14 w-14" />
            <p>Eviter tout contact avec les yeux.</p>
          </div>

          <div className="grid items-center gap-4 sm:grid-cols-[70px_1fr]">
            <UsageIcon src="/images/usage/warning.png" alt="" className="h-14 w-14" />
            <p>Usage externe uniquement.</p>
          </div>

          <div className="mt-1 flex items-center justify-center gap-4 rounded-full bg-white px-5 py-3">
            <UsageIcon src="/images/usage/day-night.png" alt="" className="h-12 w-24" />
            <p className="text-lg font-black uppercase tracking-[0.02em]">Nuit & Jour</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UsageGuide() {
  return (
    <section className="bg-white px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[var(--color-plum)]">Utilisation</p>
          <h2 className="mt-3 text-4xl font-black text-[var(--color-deep-violet)] md:text-6xl">
            Mode d’emploi du soin
          </h2>
        </div>
        <UsageGuidePanel productName="Na Nah N’hair Serum" />
      </div>
    </section>
  );
}
