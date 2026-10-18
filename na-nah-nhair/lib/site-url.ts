// Adresse publique du site : SITE_URL (domaine définitif, À COMPLÉTER), sinon l'adresse fournie par Netlify
export function siteUrl(): string {
  return (
    process.env.SITE_URL ||
    (process.env.CONTEXT === "production" ? process.env.URL : process.env.DEPLOY_PRIME_URL) ||
    process.env.URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

// Tant que le site n'est pas la production officielle, il n'est pas indexé par Google
export function isIndexable(): boolean {
  return process.env.NNH_INDEXABLE === "1";
}
