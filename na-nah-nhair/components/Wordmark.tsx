import { brand } from "@/content/site";

// Titre de marque sur trois lignes, en attendant le logo de assets/logo/
export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display leading-[0.85] ${className}`}>
      {brand.logoLines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </span>
  );
}
