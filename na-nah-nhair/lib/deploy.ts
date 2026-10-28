// Contexte du déploiement : « production », « branch-deploy » (site-2), « deploy-preview » ou « local »
export function deployContext(): string {
  return process.env.CONTEXT || process.env.NNH_BUILD_CONTEXT || "local";
}

export function deployBranch(): string {
  return process.env.BRANCH || process.env.NNH_BUILD_BRANCH || "";
}

// Magasin de données Netlify Blobs propre à chaque contexte : la production ne partage jamais ses
// données (commandes, catalogue, messages) avec site-2 ni avec les aperçus. NNH_STORE_NAME force un nom.
export function storeName(): string {
  if (process.env.NNH_STORE_NAME) return process.env.NNH_STORE_NAME;
  const context = deployContext();
  if (context === "production") return "na-nah-nhair-production";
  if (context === "deploy-preview") return "na-nah-nhair-apercus";
  const branch = deployBranch().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "");
  return branch ? `na-nah-nhair-${branch}` : "na-nah-nhair-test";
}
