import type { Metadata } from "next";
import InfoPage from "@/components/ecommerce/InfoPage";

export const metadata: Metadata = {
  title: "CGV | Na Nah N’hair",
};

export default function CgvPage() {
  return (
    <InfoPage
      eyebrow="Conditions"
      title="Conditions générales de vente"
      text="Cette page structure l’espace CGV. Le texte juridique final devra être validé avant encaissement."
      sections={[
        { title: "Commande", text: "Les modalités de commande seront finalisées avec le tunnel de paiement." },
        { title: "Prix", text: "Les prix produits affichés sur la boutique sont conservés : 19,90 €, 29,90 €, 39,90 € et pack à 69,00 €." },
        { title: "Paiement", text: "Le paiement sécurisé reste à connecter avant ouverture officielle de la vente." },
      ]}
    />
  );
}
