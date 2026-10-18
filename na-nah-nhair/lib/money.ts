// Prix en centimes d'euro (entiers), affichés à la française : « 19,90 € »
export function formatPrice(cents: number): string {
  const euros = String(Math.floor(cents / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00a0");
  const rest = String(cents % 100).padStart(2, "0");
  return `${euros},${rest} €`;
}

// « 19,90 € » → 1990 (sert à initialiser le catalogue depuis content/site.ts)
export function parsePrice(label: string): number {
  const m = label.match(/^(\d+),(\d{2})\s?€$/);
  if (!m) throw new Error(`Prix illisible : ${label}`);
  return Number(m[1]) * 100 + Number(m[2]);
}

// Saisie du back-office : « 19,90 », « 19.9 », « 19 » → 1990. null si invalide.
export function parseEuroInput(input: string): number | null {
  const s = input.trim().replace(/\s|€/g, "").replace(",", ".");
  if (!/^\d{1,5}(\.\d{1,2})?$/.test(s)) return null;
  return Math.round(Number(s) * 100);
}
