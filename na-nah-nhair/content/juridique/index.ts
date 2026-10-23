import { juridique } from "@/content/juridique/textes.generated";
import { headings } from "@/components/legal/LegalMarkdown";

// Pages juridiques (modification 39) : textes fournis dans content/juridique/*.md, projets à faire relire.
// CGV : version en cours ; une nouvelle version = nouveau fichier cgv-v2.md (l'ancien reste archivé).
export const CGV_VERSION = "v1";

export type LegalDoc = { slug: string; file: string; title: string; description: string; pdf?: { href: string; label: string } };

export const legalDocs: LegalDoc[] = [
  { slug: "mentions-legales", file: "mentions-legales", title: "Mentions légales", description: "Éditeur du site, hébergeur, médiation de la consommation." },
  {
    slug: "cgv",
    file: `cgv-${CGV_VERSION}`,
    title: "Conditions générales de vente",
    description: "Conditions générales de vente de NA NAH N'HAIR.",
    pdf: { href: `/documents/cgv-${CGV_VERSION}.pdf`, label: "Télécharger les CGV" },
  },
  {
    slug: "retractation",
    file: "retractation",
    title: "Droit de rétractation",
    description: "Tes 14 jours pour te rétracter et le modèle de formulaire.",
    pdf: { href: "/documents/formulaire-de-retractation.pdf", label: "Télécharger le formulaire" },
  },
  { slug: "confidentialite", file: "confidentialite", title: "Politique de confidentialité", description: "Données personnelles : lesquelles, pourquoi, tes droits." },
  { slug: "cookies", file: "cookies", title: "Politique de cookies", description: "Les cookies et le stockage utilisés par le site." },
];

export const legalDocBySlug = (slug: string) => legalDocs.find((d) => d.slug === slug);
export const legalText = (d: LegalDoc) => juridique[d.file];
export const legalHeadings = (d: LegalDoc) => headings(legalText(d));
