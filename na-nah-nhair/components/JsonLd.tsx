// Données structurées (schema.org) pour les moteurs de recherche
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Échappement de « < » : le contenu ne peut pas fermer la balise script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
