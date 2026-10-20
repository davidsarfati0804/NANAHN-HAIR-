// Palette unique (modifications 9 et 10), validée le 20/10/2026 et appliquée dans
// lib/design-tokens.ts et app/globals.css. Ce fichier alimente la page /guide-de-style.

export type Swatch = { token: string; hex: string; role: string; replaces?: string };

export const brandPalette: Swatch[] = [
  { token: "violet-logo", hex: "#8076B3", role: "Logo, nom de marque, grands titres sur fond blanc ou crème", replaces: "logo-violet" },
  { token: "violet-fonce", hex: "#342B64", role: "Textes, petits titres, boutons, sections sombres", replaces: "deep-violet, ink (#211A2E), plum (#504587)" },
  { token: "violet-fonce-survol", hex: "#504587", role: "Survol des boutons foncés uniquement", replaces: "plum" },
  { token: "creme-logo", hex: "#F1E1B0", role: "Bandeau, sticker, cartes « Le défi », étiquettes À COMPLÉTER", replaces: "logo-yellow, yellow (#F1E6B2), gold (#D8A24A)" },
  { token: "blanc", hex: "#FFFFFF", role: "Fond du site, texte sur fond foncé" },
  { token: "lavande-fond", hex: "#F3F0FA", role: "Fonds de sections (une seule lavande très claire)", replaces: "lavender-soft, lavender-mist (#E8E2F2), blush (#FFF5F7)" },
  { token: "lavande-carte", hex: "#AAA1C8", role: "Encadrés et cartes lavande (Pantone 15-3817 TCX), contours", replaces: "lavender" },
];

// Couleurs produits = couleurs des flacons (modification 10). VALEURS PROVISOIRES : estimations à l'œil,
// à remplacer par les Pantone exacts (ou par la pipette sur assets/images/*.jpg quand les photos seront là).
export const productPalette = [
  {
    product: "Fabulous",
    clair: "#E4F3ED",
    moyen: "#B2DCCB", // fond du cadre = flacon
    fonce: "#1D5A3C", // textes, boutons
    nom: "#1B8FE8", // couleur du texte imprimé sur le flacon
    nomProvisoire: true,
  },
  { product: "Miraculous", clair: "#E6E0F5", moyen: "#B9A5E2", fonce: "#342B64", nom: "#342B64", nomProvisoire: false },
  { product: "Luxurious", clair: "#F8EAF3", moyen: "#EBC4DE", fonce: "#8A2453", nom: "#8A2453", nomProvisoire: false },
] as const;

// Rôles typographiques (un style par rôle)
export const typeRoles = [
  { role: "Nom de marque", spec: "Lettres du logo (composant BrandName), violet du logo ou couleur du texte selon le fond", sample: "brand" },
  { role: "Titre H1", spec: "Bebas · 400 · clamp(3.5rem, 10vw, 6rem) · interligne 0,95 · violet foncé", sample: "h1" },
  { role: "Titre H2", spec: "Bebas · 400 · clamp(2.75rem, 7vw, 4.5rem) · interligne 0,95 · violet foncé", sample: "h2" },
  { role: "Petit titre (sur-titre)", spec: "Montserrat · 700 · 0,8 rem · majuscules · espacement 0,3 em · violet foncé", sample: "kicker" },
  { role: "Sous-titre / titre de carte (H3)", spec: "Montserrat · 700 · 1,25 rem · interligne 1,3 · violet foncé", sample: "h3" },
  { role: "Texte courant", spec: "Montserrat · 400 · 1 rem · interligne 1,6 · violet foncé", sample: "body" },
  { role: "Accroche / citation", spec: "Montserrat · 300 · 1,25 rem · interligne 1,5 · violet foncé", sample: "lead" },
  { role: "Nom de produit et prix", spec: "Bebas · 400 · 2,5 rem (cartes) / 4 rem (fiches) · couleur du nom du produit", sample: "product" },
  { role: "Bouton", spec: "Montserrat · 700 · 0,875 rem · majuscules · espacement 0,05 em", sample: "button" },
] as const;

export const layoutRules = [
  "Boutons : hauteur 48 px, marges intérieures 24 px, arrondi complet ; principal = fond violet foncé + texte blanc ; secondaire = contour violet foncé + fond blanc",
  "Cartes : arrondi 32 px, marges intérieures 24 px (mobile) / 32 px (ordinateur), espacement entre cartes 24 px",
  "Sections : marges haute et basse 64 px (mobile) / 96 px (ordinateur) ; marges latérales 16 px (mobile) / 24 px ; largeur maximale 1 152 px",
];

// Contraste WCAG (texte, fond)
export function contrast(a: string, b: string) {
  const lum = (hex: string) => {
    const [r, g, bl] = [1, 3, 5].map((i) => {
      const c = parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
