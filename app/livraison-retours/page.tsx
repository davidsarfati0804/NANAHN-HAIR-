import type { Metadata } from "next";
import InfoPage from "@/components/ecommerce/InfoPage";

export const metadata: Metadata = {
  title: "Livraison & retours | Na Nah N’hair",
};

export default function LivraisonRetoursPage() {
  return (
    <InfoPage
      eyebrow="Aide"
      title="Livraison & retours"
      text="Les informations finales seront confirmées avant l’ouverture officielle des commandes."
      sections={[
        {
          title: "Livraison",
          text: "Les délais, transporteurs et zones de livraison seront précisés lors de la mise en ligne du checkout final.",
        },
        {
          title: "Retours",
          text: "La politique de retour complète sera publiée avant lancement, avec les conditions applicables aux produits cosmétiques.",
        },
        {
          title: "Suivi",
          text: "Une fois le tunnel de paiement connecté, chaque commande devra permettre de retrouver les informations essentielles de suivi.",
        },
      ]}
    />
  );
}
