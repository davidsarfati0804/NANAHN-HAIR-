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

// Page Mon histoire (consigne du 03/11/2026) : le texte « Et si tu arrêtais de choisir ? » et le bouton vers le
// quiz, puis l'encadré violet foncé final. Rien d'autre.
export default function StoryPage() {
  return (
    <article className="pb-10 sm:pb-16">
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

      <section className="mx-auto max-w-4xl px-4 sm:px-6">
        <blockquote className="rounded-[2rem] bg-deep-violet px-6 py-10 text-center text-white sm:px-12 sm:py-14">
          {/* Nom de marque dans la police et le violet du logo : contraste 3,1 sur violet foncé, AA en grand texte */}
          <p className="font-display text-[2rem] leading-none sm:text-6xl">
            <BrandText text={story.closing} tone="logo" />
          </p>
        </blockquote>
      </section>
    </article>
  );
}
