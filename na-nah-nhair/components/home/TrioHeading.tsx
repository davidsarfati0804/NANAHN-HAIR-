import { home } from "@/content/site";

// En-tête de la section des trois soins (accueil et page Les trois soins)
export default function TrioHeading({ id = "trio" }: { id?: string }) {
  return (
    <div className="mb-10">
      <p className="surtitre">{home.trio.kicker}</p>
      <p className="mt-2 accroche">{home.trio.accroche}</p>
      <h2 id={id} className="mt-2 titre-h2">
        {home.trio.title}
      </h2>
    </div>
  );
}
