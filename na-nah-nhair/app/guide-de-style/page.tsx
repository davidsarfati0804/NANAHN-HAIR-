import type { Metadata } from "next";
import BrandName from "@/components/BrandName";
import { brandPalette, contrast, layoutRules, productPalette, typeRoles } from "@/lib/palette-proposal";

// Page cachée : guide de style (modification 9). Non référencée, absente du plan du site.
export const metadata: Metadata = { title: "Guide de style", robots: { index: false, follow: false } };

const V = "#342B64";
const ratio = (a: string, b: string) => contrast(a, b).toFixed(1).replace(".", ",");
const verdict = (a: string, b: string, large = false) => {
  const c = contrast(a, b);
  return c >= 4.5 ? "AA" : large && c >= 3 ? "AA grand texte" : "insuffisant";
};

export default function StyleGuidePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6" style={{ color: V }}>
      <p className="text-sm font-bold uppercase tracking-[0.3em]">Proposition à valider</p>
      <h1 className="mt-2 text-[clamp(3.5rem,10vw,6rem)]">Guide de style</h1>
      <p className="mt-3 max-w-2xl">
        Palette unique et styles proposés (modifications 9 et 10). Rien n&apos;est encore appliqué au reste du site.
      </p>

      <h2 className="mt-14 text-[clamp(2.75rem,7vw,4.5rem)]">Palette de la marque</h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {brandPalette.map((s) => (
          <li key={s.token} className="overflow-hidden rounded-[2rem] border-2" style={{ borderColor: "#AAA1C8" }}>
            <div className="h-24" style={{ background: s.hex }} />
            <div className="p-5 text-sm">
              <p className="text-base font-bold">
                {s.token} · {s.hex}
              </p>
              <p className="mt-1">{s.role}</p>
              {s.replaces && <p className="mt-1">Remplace : {s.replaces}</p>}
              <p className="mt-1">
                Texte violet foncé dessus : {ratio(V, s.hex)} · texte blanc : {ratio("#FFFFFF", s.hex)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="mt-14 text-[clamp(2.75rem,7vw,4.5rem)]">Couleurs des flacons</h2>
      <p className="mt-3 max-w-2xl">Valeurs provisoires (estimations), à remplacer par les Pantone exacts.</p>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {productPalette.map((p) => (
          <div key={p.product} className="rounded-[2rem] p-6" style={{ background: p.moyen }}>
            <p className="font-display text-6xl leading-none" style={{ color: p.nom }}>
              {p.product}
            </p>
            <p className="mt-1 text-xs font-bold" style={{ color: p.fonce }}>
              Nom {p.nom} sur cadre {p.moyen} : {ratio(p.nom, p.moyen)} ({verdict(p.nom, p.moyen, true)})
              {p.nomProvisoire ? " · provisoire" : ""}
            </p>
            <p className="mt-3 text-sm" style={{ color: p.fonce }}>
              Texte foncé {p.fonce} sur cadre : {ratio(p.fonce, p.moyen)} ({verdict(p.fonce, p.moyen)})
            </p>
            <div className="mt-4 flex gap-2 text-xs font-bold">
              {(["clair", "moyen", "fonce"] as const).map((k) => (
                <span key={k} className="rounded-full px-3 py-2" style={{ background: p[k], color: k === "fonce" ? "#FFFFFF" : p.fonce }}>
                  {k === "fonce" ? "foncé" : k} {p[k]}
                </span>
              ))}
            </div>
            <span className="mt-4 inline-flex min-h-12 items-center rounded-full px-6 text-sm font-bold uppercase text-white" style={{ background: p.fonce }}>
              Bouton {ratio("#FFFFFF", p.fonce)}
            </span>
          </div>
        ))}
      </div>

      <h3 className="mt-10 text-xl font-bold">Fabulous : lisibilité du nom bleu (à choisir)</h3>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <div className="rounded-[2rem] p-6" style={{ background: "#B2DCCB" }}>
          <p className="text-xs font-bold uppercase" style={{ color: "#1D5A3C" }}>
            Option A : bleu sur menthe (demandé)
          </p>
          <p className="mt-3 font-display text-6xl" style={{ color: "#1B8FE8" }}>
            Fabulous
          </p>
          <p className="text-sm font-bold" style={{ color: "#1D5A3C" }}>
            Contraste {ratio("#1B8FE8", "#B2DCCB")} : insuffisant, même en grand (minimum 3)
          </p>
        </div>
        <div className="rounded-[2rem] p-6" style={{ background: "#B2DCCB" }}>
          <p className="text-xs font-bold uppercase" style={{ color: "#1D5A3C" }}>
            Option B : bande blanche dans le cadre
          </p>
          <p className="mt-3 rounded-2xl bg-white px-4 py-2 font-display text-6xl" style={{ color: "#1B8FE8" }}>
            Fabulous
          </p>
          <p className="mt-1 text-sm font-bold" style={{ color: "#1D5A3C" }}>
            Contraste {ratio("#1B8FE8", "#FFFFFF")} : AA grand texte
          </p>
        </div>
      </div>

      <h2 className="mt-14 text-[clamp(2.75rem,7vw,4.5rem)]">Typographies</h2>
      <ul className="mt-6 divide-y-2 rounded-[2rem] border-2" style={{ borderColor: "#AAA1C8" }}>
        {typeRoles.map((t) => (
          <li key={t.role} className="grid gap-2 p-5 md:grid-cols-[14rem_1fr]" style={{ borderColor: "#AAA1C8" }}>
            <div>
              <p className="font-bold">{t.role}</p>
              <p className="text-xs">{t.spec}</p>
            </div>
            <div>
              {t.sample === "brand" && (
                <p className="text-4xl">
                  <BrandName tone="logo" />
                </p>
              )}
              {t.sample === "h1" && <p className="font-display text-[clamp(3.5rem,10vw,6rem)] leading-[0.95]">Les trois soins</p>}
              {t.sample === "h2" && <p className="font-display text-[clamp(2.75rem,7vw,4.5rem)] leading-[0.95]">Lequel est le tien ?</p>}
              {t.sample === "kicker" && <p className="text-[0.8rem] font-bold uppercase tracking-[0.3em]">Mon histoire</p>}
              {t.sample === "h3" && <p className="text-xl font-bold leading-snug">Contenu du pack</p>}
              {t.sample === "body" && <p className="leading-relaxed">Mes premières préparations sont nées dans ma chambre, sur mon bureau.</p>}
              {t.sample === "lead" && <p className="text-xl font-light leading-normal">« Je ne suis pas qu’une seule femme. »</p>}
              {t.sample === "product" && <p className="font-display text-[2.5rem] leading-none">Miraculous · 39,90 €</p>}
              {t.sample === "button" && <p className="text-sm font-bold uppercase tracking-wide">Ajouter au panier</p>}
            </div>
          </li>
        ))}
      </ul>

      <h2 className="mt-14 text-[clamp(2.75rem,7vw,4.5rem)]">Boutons et cartes</h2>
      <div className="mt-6 flex flex-wrap gap-3">
        <span className="inline-flex min-h-12 items-center rounded-full px-6 text-sm font-bold uppercase tracking-wide text-white" style={{ background: V }}>
          Bouton principal
        </span>
        <span className="inline-flex min-h-12 items-center rounded-full border-2 bg-white px-6 text-sm font-bold uppercase tracking-wide" style={{ borderColor: V }}>
          Bouton secondaire
        </span>
      </div>
      <ul className="mt-6 list-disc space-y-1 pl-6 text-sm">
        {layoutRules.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
    </div>
  );
}
