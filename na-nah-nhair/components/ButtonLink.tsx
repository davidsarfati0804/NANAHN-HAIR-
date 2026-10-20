import Link from "next/link";

// Styles de bouton du guide de style (app/globals.css : .bouton, .bouton--principal, .bouton--secondaire)
const variants = {
  primary: "bouton--principal",
  secondary: "bouton--secondaire",
  light: "bouton--clair",
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
      className={`bouton ${variant === "custom" ? "" : variants[variant]} ${className}`}
    >
      {/* Un seul bloc de texte : les espaces autour du nom de marque sont conservés */}
      <span>{children}</span>
    </Link>
  );
}
