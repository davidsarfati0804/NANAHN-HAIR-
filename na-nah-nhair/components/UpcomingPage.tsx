import ButtonLink from "@/components/ButtonLink";
import LavenderBox from "@/components/LavenderBox";

// Page pas encore construite : elle existe déjà pour que les liens ne cassent pas
export default function UpcomingPage({ title, phase }: { title: string; phase: string }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <h1 className="text-6xl text-deep-violet sm:text-7xl">{title}</h1>
      <LavenderBox className="mt-8">
        <p className="font-bold">Cette page arrive bientôt.</p>
        <p className="mt-2">{phase}</p>
      </LavenderBox>
      <ButtonLink href="/" variant="secondary" className="mt-8">
        Retour à l&apos;accueil
      </ButtonLink>
    </div>
  );
}
