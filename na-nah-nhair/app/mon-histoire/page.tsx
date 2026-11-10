import type { Metadata } from "next";
import { Fragment } from "react";
import ButtonLink from "@/components/ButtonLink";
import { BrandText } from "@/components/BrandName";
import { story } from "@/content/site";

export const metadata: Metadata = {
  alternates: { canonical: "/mon-histoire" },
  title: story.title,
  description: story.paragraphs[0].replace(/\*\*/g, ""),
};

// Paragraphe : passages **en gras**, nom de marque dans la typographie et la lavande du logo
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
        part.startsWith("**") ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          <Fragment key={i}>
            <BrandText text={part} tone="logo" />
          </Fragment>
        ),
      )}
    </>
  );
}

// Page Mon histoire (consigne du 03/11/2026, modification 81) : le texte « Et si tu arrêtais de choisir ? » et le
// bouton vers le quiz, puis directement le pied de page.
export default function StoryPage() {
  return (
    <article>
      <div className="mx-auto max-w-2xl space-y-6 px-4 py-10 text-lg leading-relaxed sm:space-y-8 sm:px-6 sm:py-16 sm:text-xl">
        <h1 className="titre-h1 text-balance">{story.heading}</h1>
        {story.paragraphs.map((para) => (
          <p key={para}>
            <Rich text={para} />
          </p>
        ))}
        <ButtonLink href={story.cta.href} className="w-full sm:w-auto">
          <BrandText text={story.cta.label} />
        </ButtonLink>
      </div>
    </article>
  );
}
