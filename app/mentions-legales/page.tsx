import type { Metadata } from "next";
import InfoPage from "@/components/ecommerce/InfoPage";

export const metadata: Metadata = {
  title: "Mentions légales | Na Nah N’hair",
};

export default function MentionsLegalesPage() {
  return (
    <InfoPage
      eyebrow="Informations légales"
      title="Mentions légales"
      text="Informations société disponibles pour préparer la mise en vente officielle."
      sections={[
        { title: "Éditeur", text: "Seare, 24 rue Octave Feuillet, 75016 Paris." },
        { title: "Contact", text: "Téléphone : 0180182929. L’adresse email officielle sera ajoutée avant lancement." },
        { title: "Produits", text: "Contenance du flacon : 30 mL - 1.01 fl.oz. Made in France." },
      ]}
    />
  );
}
