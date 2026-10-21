import type { Metadata } from "next";
import BrandName from "@/components/BrandName";
import { brandPalette, contrast, layoutRules, productPalette, styleChoices, typeRoles } from "@/lib/palette";

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
      <p className="surtitre">Appliqué le 20/10/2026 · 4 choix en attente de ta réponse</p>
      <h1 className="mt-2 text-[clamp(3.5rem,10vw,6rem)]">Guide de style</h1>
      <p className="mt-3 max-w-2xl">
        Palette unique et styles du site (modifications 9 et 10), appliqués à toutes les pages. Couleurs des flacons provisoires.
      </p>

      <section id="choix" aria-labelledby="choix-titre" className="mt-10 rounded-[2rem] border-2 border-dashed p-5 sm:p-8" style={{ borderColor: V }}>
        <h2 id="choix-titre" className="text-[clamp(2.75rem,7vw,4.5rem)]">
          Les 4 choix à valider
        </h2>
        <p className="mt-3 max-w-2xl">
          Option A = appliquée aujourd&apos;hui sur le site. Réponds A ou B pour chaque choix : rien d&apos;autre ne change.
        </p>
        <div className="mt-6 grid gap-8">
          {styleChoices.map((c) => (
            <div key={c.title}>
              <h3 className="titre-h3">{c.title}</h3>
              <p className="mt-1 text-sm">{c.question}</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                {c.options.map((o) => (
                  <div key={o.label} className="rounded-[1.5rem] border-2 p-5" style={{ borderColor: "#AAA1C8" }}>
                    <p className="text-sm font-bold">
                      {o.label}
                      {o.applied && <span className="ml-2 rounded-md bg-logo-yellow px-1.5 text-xs">appliqué</span>}
                    </p>
                    <div className="mt-3 flex gap-2">
                      {o.swatches.map((hex) => (
                        <span key={hex} className="flex h-12 w-12 items-end justify-center rounded-xl border text-[0.55rem] font-bold" style={{ background: hex, borderColor: "#AAA1C8" }} title={hex}>
                          <span className="rounded bg-white/80 px-0.5">{hex}</span>
                        </span>
                      ))}
                    </div>
                    <div className="mt-4">
                      {o.sample === "titre" && (
                        <p className="font-display text-5xl leading-none" style={{ color: o.color }}>
                          Quel soin est le tien ?
                        </p>
                      )}
                      {o.sample === "surtitre" && (
                        <p className="text-[0.8rem] font-bold uppercase tracking-[0.3em]" style={{ color: o.color }}>
                          Trois soins, trois personnalités
                        </p>
                      )}
                      {o.sample === "bouton" && (
                        <div className="flex flex-wrap gap-2 text-xs font-bold uppercase text-white">
                          <span className="inline-flex min-h-12 items-center rounded-full px-5" style={{ background: o.color }}>
                            Normal
                          </span>
                          <span className="inline-flex min-h-12 items-center rounded-full px-5" style={{ background: o.hover }}>
                            Survol
                          </span>
                        </div>
                      )}
                      {o.sample === "fonds" && (
                        <div className="flex flex-wrap gap-2">
                          {o.swatches.map((hex) => (
                            <span key={hex} className="rounded-2xl px-3 py-2 text-xs font-bold" style={{ background: hex, color: o.color }}>
                              Texte {ratio(o.color, hex)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {o.sample !== "fonds" && o.sample !== "bouton" && (
                      <p className="mt-2 text-xs">Contraste sur blanc : {ratio(o.color, "#FFFFFF")} ({verdict(o.color, "#FFFFFF", o.sample === "titre")})</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

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

      <h3 className="mt-10 titre-h3">Fabulous : nom ton sur ton (validé le 21/10/2026)</h3>
      <div className="mt-4 max-w-md rounded-[2rem] p-6" style={{ background: "#B2DCCB" }}>
        <p className="font-display text-6xl" style={{ color: "#1D5A3C" }}>
          Fabulous
        </p>
        <p className="text-sm font-bold" style={{ color: "#1D5A3C" }}>
          Vert foncé #1D5A3C sur menthe #B2DCCB : {ratio("#1D5A3C", "#B2DCCB")} ({verdict("#1D5A3C", "#B2DCCB")}), sans bande blanche
        </p>
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
              {t.sample === "h2" && <p className="font-display text-[clamp(2.75rem,7vw,4.5rem)] leading-[0.95]">Quel soin est le tien ?</p>}
              {t.sample === "kicker" && <p className="text-[0.8rem] font-bold uppercase tracking-[0.3em]">Mon histoire</p>}
              {t.sample === "h3" && <p className="text-xl font-bold leading-snug">Contenu du pack</p>}
              {t.sample === "body" && <p className="leading-relaxed">Mes premières préparations sont nées dans ma chambre, sur mon bureau.</p>}
              {t.sample === "lead" && <p className="text-xl font-light leading-normal">À chaque personnalité, son soin.</p>}
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
