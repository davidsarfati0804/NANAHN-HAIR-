import Image from "next/image";
import type { ProductTheme } from "@/lib/design-tokens";
import { themeClasses } from "@/lib/theme-classes";

type Photo = { file: string; alt: string; available: boolean };

// Emplacement pour une vraie photo de assets/images/. Aucun faux visuel de flacon.
export default function PhotoSlot({
  photo,
  theme,
  className = "",
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
}: {
  photo: Photo;
  theme?: ProductTheme;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const t = theme ? themeClasses[theme] : null;

  if (photo.available) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={`/images/${photo.file}`}
          alt={photo.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={`${photo.alt} (photo à venir)`}
      className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed p-6 text-center ${
        t ? `${t.soft} ${t.border} ${t.text}` : "border-deep-violet bg-lavender-soft text-deep-violet"
      } ${className}`}
    >
      <span className="text-sm font-bold uppercase tracking-wide">À COMPLÉTER : photo</span>
      <span className="text-xs">assets/images/{photo.file}</span>
    </div>
  );
}
