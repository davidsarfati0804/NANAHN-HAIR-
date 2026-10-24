import type { ProductTheme } from "@/lib/design-tokens";
import { cutoutHeight, cutoutSrcSet } from "@/lib/cutouts";
import { themeClasses } from "@/lib/theme-classes";

// photo.file : nom de la photo dans assets/images/ ; si « responsive », versions générées par
// scripts/preparer-photos.py dans public/images/produits/ (400, 800, 1200 px, WebP + JPG, format 4:5)
type Photo = { file: string; alt: string; available: boolean; responsive?: string; cutout?: ProductTheme };

const WIDTHS = [400, 800, 1200];

// Photo réelle (jamais de faux visuel de flacon) ou emplacement « À COMPLÉTER »
export default function PhotoSlot({
  photo,
  theme,
  className = "",
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
  src = null,
}: {
  photo: Photo;
  theme?: ProductTheme;
  className?: string;
  sizes?: string;
  priority?: boolean;
  // Photo envoyée depuis le back-office (prioritaire)
  src?: string | null;
}) {
  const t = theme ? themeClasses[theme] : null;
  const loading = priority ? "eager" : "lazy";

  if (src) {
    return (
      <div className={`relative overflow-hidden bg-white ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- photo du back-office, servie telle quelle */}
        <img src={src} alt={photo.alt} loading={loading} className="absolute inset-0 h-full w-full object-contain" />
      </div>
    );
  }

  // Flacon détouré (modification 40) : posé sur le panneau blanc arrondi, sans ombre ni bord ajoutés
  if (photo.available && photo.cutout) {
    return (
      <div className={`relative overflow-hidden bg-white ${className}`}>
        <picture>
          <source type="image/webp" srcSet={cutoutSrcSet(photo.cutout, "webp")} sizes={sizes} />
          <img
            src={`/images/produits/${photo.cutout}-detoure-480.png`}
            srcSet={cutoutSrcSet(photo.cutout, "png")}
            sizes={sizes}
            width={240}
            height={cutoutHeight[photo.cutout]}
            alt={photo.alt}
            loading={loading}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
            className="absolute inset-x-0 bottom-[7%] mx-auto h-[84%] w-auto"
          />
        </picture>
      </div>
    );
  }

  if (photo.available && photo.responsive) {
    const set = (ext: string) => WIDTHS.map((w) => `/images/produits/${photo.responsive}-${w}.${ext} ${w}w`).join(", ");
    return (
      // Panneau blanc arrondi : la photo (fond blanc) n'a pas de bord dur dans le cadre coloré
      <div className={`relative overflow-hidden bg-white ${className}`}>
        <picture>
          <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
          <img
            src={`/images/produits/${photo.responsive}-800.jpg`}
            srcSet={set("jpg")}
            sizes={sizes}
            width={1200}
            height={1500}
            alt={photo.alt}
            loading={loading}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
            className="absolute inset-0 h-full w-full object-contain"
          />
        </picture>
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
