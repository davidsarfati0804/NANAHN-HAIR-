// Encadré violet Lavender (INFOS §2) : toujours du texte foncé, jamais de blanc
export default function LavenderBox({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "aside";
}) {
  return <Tag className={`rounded-3xl bg-lavender p-6 text-deep-violet sm:p-8 ${className}`}>{children}</Tag>;
}
