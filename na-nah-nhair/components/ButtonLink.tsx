import Link from "next/link";

const variants = {
  primary: "bg-deep-violet text-white hover:bg-plum",
  secondary: "border-2 border-deep-violet bg-white text-deep-violet hover:bg-lavender-soft",
  light: "bg-white text-deep-violet hover:bg-lavender-soft",
} as const;

export default function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof variants | "custom";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3 text-center text-sm font-bold uppercase tracking-wide transition-colors ${
        variant === "custom" ? "" : variants[variant]
      } ${className}`}
    >
      {/* Un seul bloc de texte : les espaces autour du nom de marque sont conservés */}
      <span>{children}</span>
    </Link>
  );
}
