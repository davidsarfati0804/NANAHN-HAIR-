type ImagePlaceholderProps = {
  label: string;
  tone?: "light" | "dark";
  className?: string;
};

export default function ImagePlaceholder({
  label,
  tone = "light",
  className = "",
}: ImagePlaceholderProps) {
  const isDark = tone === "dark";

  return (
    <div
      className={`relative flex min-h-64 overflow-hidden rounded-[2rem] border ${
        isDark
          ? "border-white/25 bg-[var(--color-deep-violet)] text-white"
          : "border-[var(--color-lavender-mist)] bg-[var(--color-lavender-soft)] text-[var(--color-deep-violet)]"
      } ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.7),transparent_28%),radial-gradient(circle_at_82%_12%,rgba(216,162,74,0.25),transparent_22%),linear-gradient(135deg,rgba(170,161,200,0.26),rgba(255,255,255,0))]" />
      <div className="absolute left-8 top-8 h-16 w-16 rounded-full border border-current/20" />
      <div className="absolute bottom-8 right-8 h-24 w-24 rounded-full border border-current/20" />
      <div className="relative z-10 m-auto flex max-w-xs flex-col items-center gap-5 p-8 text-center">
        <div className="flex items-end gap-3">
          <span className="h-28 w-10 rounded-t-full rounded-b-xl bg-current/20" />
          <span className="h-36 w-12 rounded-t-full rounded-b-xl bg-current/30" />
          <span className="h-24 w-10 rounded-t-full rounded-b-xl bg-current/20" />
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em]">{label}</p>
      </div>
    </div>
  );
}
