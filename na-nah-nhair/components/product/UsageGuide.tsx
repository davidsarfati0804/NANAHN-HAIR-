import Image from "next/image";
import type { UsageGuide as Guide } from "@/content/site";
import type { ProductTheme } from "@/lib/design-tokens";

// Mode d'emploi d'une fiche produit (structure et styles fournis : mode-emploi.html / mode-emploi.css).
// Illustrations décoratives (alt vide) : le texte suffit à comprendre chaque étape.
export default function UsageGuide({ guide, theme }: { guide: Guide; theme: ProductTheme }) {
  return (
    <div className={`mode-emploi mode-emploi--${theme}`}>
      <ol className="mode-emploi__etapes">
        {guide.steps.map((step) => (
          <li key={step.title} className="mode-emploi__etape">
            <Image className="mode-emploi__illu" src={step.image.src} alt="" width={step.image.width} height={step.image.height} />
            <div>
              <h3 className="mode-emploi__num">{step.title}</h3>
              <p className="mode-emploi__texte">
                {step.text.before}
                {step.text.strong && <strong>{step.text.strong}</strong>}
                {step.text.after}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mode-emploi__infos">
        <ul className="mode-emploi__precautions">
          {guide.precautions.map((p) => (
            <li key={p.text}>
              <Image src={p.icon} alt="" width={34} height={34} />
              {p.text}
            </li>
          ))}
        </ul>
        <div className="mode-emploi__badge">
          <Image src={guide.badge.icon} alt="" width={76} height={36} />
          <span>{guide.badge.label}</span>
        </div>
      </div>
    </div>
  );
}
