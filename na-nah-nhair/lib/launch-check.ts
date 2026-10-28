import { faq, home, pack, products, quiz } from "@/content/site";

// Contrôle de mise en ligne (suite de scripts/verifier-mise-en-ligne.mjs) : tout ce qui afficherait encore
// « À COMPLÉTER » sur une page publique, d'après les données du site. Liste vide = rien à compléter.
export function launchBlockers(stamps: { storyAddress: string | null }): string[] {
  const out: string[] = [];
  for (const p of products) {
    if (!p.photo.available) out.push(`fiche ${p.shortName} : photo`);
    if (!p.cutout.available) out.push(`fiche ${p.shortName} : photo détourée`);
    if (!p.usage) out.push(`fiche ${p.shortName} : mode d'emploi`);
    if (!p.usage && !p.precautions) out.push(`fiche ${p.shortName} : précautions d'emploi`);
    if (!p.faq) out.push(`fiche ${p.shortName} : FAQ (questions et réponses) — content/site.ts, champ faq`);
  }
  if (!pack.photo.available) out.push("pack : photo");
  for (const r of home.reasons.items as Array<{ title: string; todo?: string }>) if (r.todo) out.push(`accueil, « ${r.title} » : ${r.todo}`);
  for (const g of faq.groups) for (const q of g.items) if (q.todo || (!q.answer && !q.blocks && !q.list && !q.mailto)) out.push(`FAQ, « ${q.question} »`);
  if (!quiz.story.siteAddress) out.push("images story du quiz : adresse du site — content/site.ts, quiz.story.siteAddress");
  else if (stamps.storyAddress !== quiz.story.siteAddress) out.push("images story du quiz : à régénérer (node scripts/generer-stories.mjs)");
  return out;
}
