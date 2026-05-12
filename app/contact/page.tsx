import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/ecommerce/InfoPage";

export const metadata: Metadata = {
  title: "Contact | Na Nah N’hair",
};

export default function ContactPage() {
  return (
    <InfoPage
      eyebrow="Contact"
      title="Besoin d’aide ?"
      text="Une question sur un sérum, une routine ou une future commande : la page contact centralise les informations utiles."
      sections={[
        {
          title: "Service client",
          text: "Le canal de contact définitif sera ajouté avant lancement. En attendant, cette page prépare l’espace d’aide client.",
        },
        {
          title: "Société",
          text: "Seare, 24 rue Octave Feuillet, 75016 Paris. Téléphone : 0180182929.",
        },
        {
          title: "Instagram",
          text: "Le lien Instagram officiel pourra être connecté ici lorsque l’URL définitive sera validée.",
        },
      ]}
    />
  );
}
