// Typographie française : espace insécable avant ? ! : ; » et après «
// (évite qu'un signe se retrouve seul en début de ligne). Appliquée à tous les textes de content/site.ts.
export function frText(s: string): string {
  return s.replace(/ ([?!:;»])/g, " $1").replace(/« /g, "« ");
}

export function fr<T>(value: T): T {
  if (typeof value === "string") return frText(value) as T;
  if (Array.isArray(value)) return value.map((v) => fr(v)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, fr(v)])) as T;
  }
  return value;
}

// Majuscule en début de phrase quand un texte d'INFOS (qui suit un « : ») est affiché seul
export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
