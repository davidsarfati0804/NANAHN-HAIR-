import { Fragment } from "react";

// Texte avec passages en gras écrits **ainsi** ; les adresses email deviennent des liens mailto
export default function RichText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*|[\w.+-]+@[\w-]+\.[\w.]+[a-z])/i).map((part, i) => {
        if (part.startsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
        if (/^[\w.+-]+@[\w-]+\.[\w.]+$/.test(part))
          return (
            <a key={i} href={`mailto:${part}`} className="font-bold underline underline-offset-4">
              {part}
            </a>
          );
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
