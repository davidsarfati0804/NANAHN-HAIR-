// Textes des pages juridiques. Uniquement des faits fournis dans INFOS.md ;
// le reste est « À COMPLÉTER ». Pages à faire relire avant la mise en ligne (INFOS §11).

import { legal } from "@/content/site";
import { fr } from "@/lib/typography";

export type LegalSection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
  todo?: string[];
};

export type LegalPage = {
  slug: string;
  title: string;
  description: string;
  sections: LegalSection[];
};

const identity = [
  `Marque : ${legal.brand}`,
  `SIRET : ${legal.siret}`,
  `Adresse : ${legal.address}`,
  `Téléphone : ${legal.phone}`,
  `Email : ${legal.email}`,
];

export const legalPages: LegalPage[] = fr([
  {
    slug: "mentions-legales",
    title: "Mentions légales",
    description: "Éditeur, hébergeur et contact du site NA NAH N'HAIR.",
    sections: [
      {
        title: "Éditeur du site",
        items: identity,
        todo: ["statut de l'entreprise", "numéro de TVA intracommunautaire", "responsable de la publication"],
      },
      {
        title: "Hébergement",
        items: ["Netlify"],
        todo: ["raison sociale, adresse et téléphone de l'hébergeur"],
      },
      {
        title: "Contact",
        paragraphs: [`Pour toute question : ${legal.email} ou ${legal.phone}.`],
      },
    ],
  },
  {
    slug: "cgv",
    title: "Conditions générales de vente",
    description: "Conditions de vente des soins NA NAH N'HAIR.",
    sections: [
      {
        title: "Vendeur",
        items: identity,
        todo: ["statut de l'entreprise", "numéro de TVA intracommunautaire"],
      },
      {
        title: "Produits",
        paragraphs: [
          "Sérums capillaires en flacons de 30 ml (Fabulous, Miraculous, Luxurious) et pack des 3 soins.",
          "La composition (INCI) de chaque soin est indiquée sur sa fiche produit.",
        ],
        todo: ["précautions d'emploi de chaque soin"],
      },
      {
        title: "Prix",
        paragraphs: ["Les prix sont indiqués en euros, toutes taxes comprises (TTC)."],
        todo: ["mention TVA selon le statut fiscal"],
      },
      {
        title: "Commande et paiement",
        paragraphs: [
          "Le paiement est sécurisé par Stripe (carte bancaire, Apple Pay, Google Pay).",
          "La commande est validée après confirmation du paiement.",
        ],
      },
      {
        title: "Livraison",
        items: [
          "Livraison en France uniquement.",
          "Transporteurs : Colissimo ou Mondial Relay (point relais), au choix à la commande.",
          "Délai : 3 jours ouvrés, préparation incluse.",
          "Livraison offerte sur toutes les commandes en France, pour l'instant.",
        ],
        todo: ["tarifs de livraison si elle redevient payante"],
      },
      {
        title: "Droit de rétractation",
        items: [
          "Droit de rétractation de 14 jours pour les produits non ouverts, comme l'impose la loi pour la vente à distance.",
          "Les produits ouverts ne sont pas repris (raison d'hygiène).",
        ],
        todo: ["qui paie le retour", "procédure et adresse de retour", "modèle de formulaire de rétractation"],
      },
      {
        title: "Garanties",
        items: ["Garantie légale en cas de produit défectueux ou erroné."],
        todo: ["détail des garanties légales"],
      },
      {
        title: "Médiation et litiges",
        todo: ["médiateur de la consommation", "droit applicable et juridiction"],
      },
      {
        title: "Données personnelles",
        paragraphs: ["Voir la politique de confidentialité."],
      },
    ],
  },
  {
    slug: "confidentialite",
    title: "Politique de confidentialité",
    description: "Données personnelles collectées par NA NAH N'HAIR et vos droits.",
    sections: [
      {
        title: "Responsable du traitement",
        items: [legal.brand, legal.address, legal.email],
      },
      {
        title: "Données collectées",
        items: [
          "Formulaire de contact : nom, email et message, pour te répondre.",
          "Commande : nom, adresse de livraison, email et téléphone, pour préparer et livrer ta commande.",
          "Panier : enregistré uniquement dans ton navigateur.",
        ],
      },
      {
        title: "Paiement",
        paragraphs: ["Le paiement est traité par Stripe. NA NAH N'HAIR n'a pas accès à tes numéros de carte."],
      },
      {
        title: "Destinataires",
        items: ["Hébergeur du site (Netlify)", "Prestataire de paiement (Stripe)", "Transporteurs (Colissimo, Mondial Relay)"],
      },
      {
        title: "Durée de conservation",
        todo: ["durée de conservation des messages et des commandes"],
      },
      {
        title: "Tes droits",
        paragraphs: [
          `Tu peux demander l'accès, la rectification, la suppression ou la portabilité de tes données, ou t'opposer à leur traitement, en écrivant à ${legal.email}.`,
          "Tu peux aussi adresser une réclamation à la CNIL (www.cnil.fr).",
        ],
      },
      {
        title: "Cookies",
        paragraphs: ["Voir la politique cookies."],
      },
    ],
  },
  {
    slug: "cookies",
    title: "Politique cookies",
    description: "Cookies et stockage utilisés par le site NA NAH N'HAIR.",
    sections: [
      {
        title: "Aucun suivi publicitaire",
        paragraphs: ["Le site n'utilise aucun cookie publicitaire ni de mesure d'audience."],
      },
      {
        title: "Stockage nécessaire au fonctionnement",
        items: [
          "« nnh-panier-v1 » (stockage du navigateur) : contenu de ton panier.",
          "« nnh-consentement » (stockage du navigateur) : ton choix sur ce bandeau.",
          "« nnh_admin » (cookie) : session du back-office, uniquement pour l'administratrice, 8 heures.",
        ],
      },
      {
        title: "Paiement",
        todo: ["cookies déposés par Stripe lors du paiement"],
      },
    ],
  },
  {
    slug: "retours",
    title: "Retours et droit de rétractation",
    description: "Conditions de retour des soins NA NAH N'HAIR.",
    sections: [
      {
        title: "Droit de rétractation",
        items: [
          "Droit de rétractation de 14 jours pour les produits non ouverts, comme l'impose la loi pour la vente à distance.",
          "Les produits ouverts ne sont pas repris (raison d'hygiène).",
        ],
        todo: ["qui paie le retour", "procédure et adresse de retour"],
      },
      {
        title: "Produit défectueux ou erroné",
        items: ["Garantie légale en cas de produit défectueux ou erroné."],
        todo: ["procédure à suivre"],
      },
      {
        title: "Contact",
        paragraphs: [`${legal.email} · ${legal.phone}`],
      },
    ],
  },
]);

export const legalBySlug = (slug: string) => legalPages.find((p) => p.slug === slug);
