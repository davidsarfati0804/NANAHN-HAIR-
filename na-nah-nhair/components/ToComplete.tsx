// Emplacement visible pour une information manquante (listée dans TODO-A-COMPLETER.md)
export default function ToComplete({ label, className = "" }: { label: string; className?: string }) {
  return (
    <span
      className={`inline-block rounded-md border-2 border-dashed border-deep-violet bg-logo-yellow px-2 py-1 text-sm font-bold text-deep-violet ${className}`}
    >
      À COMPLÉTER : {label}
    </span>
  );
}
