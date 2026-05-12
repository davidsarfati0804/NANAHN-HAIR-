import type { Metadata } from "next";
import InfoPage from "@/components/ecommerce/InfoPage";

export const metadata: Metadata = {
  title: "Politique de confidentialité | Na Nah N’hair",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <InfoPage
      eyebrow="Confidentialité"
      title="Politique de confidentialité"
      text="Cette page prépare les informations de confidentialité nécessaires avant lancement."
      sections={[
        { title: "Données collectées", text: "Les données réellement collectées dépendront du checkout, du formulaire contact et des outils connectés." },
        { title: "Finalités", text: "Les données pourront servir au traitement des commandes, au service client et aux communications liées à la marque." },
        { title: "Mise à jour", text: "Le texte final devra être ajusté lorsque les outils de paiement, analytics et contact seront choisis." },
      ]}
    />
  );
}
