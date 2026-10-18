import ButtonLink from "@/components/ButtonLink";
import LavenderBox from "@/components/LavenderBox";
import { upcomingTexts } from "@/content/site";

// Page pas encore construite : elle existe déjà pour que les liens ne cassent pas
export default function UpcomingPage({ title, phase }: { title: string; phase: string }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <h1 className="text-6xl text-deep-violet sm:text-7xl">{title}</h1>
      <LavenderBox className="mt-8">
        <p className="font-bold">{upcomingTexts.soon}</p>
        <p className="mt-2">{phase}</p>
      </LavenderBox>
      <ButtonLink href="/" variant="secondary" className="mt-8">
        {upcomingTexts.back}
      </ButtonLink>
    </div>
  );
}
