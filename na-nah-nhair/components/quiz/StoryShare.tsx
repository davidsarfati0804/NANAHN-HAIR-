"use client";

import { useState, useSyncExternalStore } from "react";
import { quiz } from "@/content/site";

const noop = () => () => {};

// Partage de l'image story (Web Share API avec fichier) ; sinon « Télécharger l'image ».
// Rien n'est enregistré, aucun suivi.
export default function StoryShare({ slug, name, className = "" }: { slug: string; name: string; className?: string }) {
  const t = quiz.story;
  const src = `/story/${slug}.png`;
  const fileName = `na-nah-nhair-${slug}.png`;
  // Le partage de fichier n'est connu qu'au navigateur : bouton « Partager » par défaut (rendu serveur)
  const supported = useSyncExternalStore(
    noop,
    () => typeof navigator.canShare === "function" && navigator.canShare({ files: [new File([""], "story.png", { type: "image/png" })] }),
    () => true,
  );
  const [fallback, setFallback] = useState(false);
  const [error, setError] = useState(false);
  const canShareFiles = supported && !fallback;

  const share = async () => {
    setError(false);
    try {
      const blob = await (await fetch(src)).blob();
      const file = new File([blob], fileName, { type: "image/png" });
      if (!navigator.canShare?.({ files: [file] })) {
        setFallback(true);
        return;
      }
      await navigator.share({ files: [file], title: t.shareTitle(name) });
    } catch (e) {
      // Partage annulé par l'utilisatrice : rien à signaler
      if (!(e instanceof DOMException && e.name === "AbortError")) setError(true);
    }
  };

  const classes = `bouton border-2 border-current bg-white ${className}`;
  if (!canShareFiles || error) {
    return (
      <a href={src} download={fileName} className={classes}>
        {t.download}
      </a>
    );
  }
  return (
    <button type="button" onClick={share} className={classes}>
      {t.share}
    </button>
  );
}
