import type { FaqItem } from "@/content/site";
import ToComplete from "@/components/ToComplete";

export default function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-lavender rounded-3xl border-2 border-lavender">
      {items.map((item) => (
        <details key={item.question} className="group px-5 py-4">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-bold text-deep-violet">
            <span>
              {item.question}
              {item.todo && (
                <span className="ml-2 inline-block rounded-md border border-dashed border-deep-violet bg-logo-yellow px-1.5 text-xs text-deep-violet">
                  À COMPLÉTER
                </span>
              )}
            </span>
            <span aria-hidden className="text-2xl transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <div className="mt-3 space-y-2">
            {item.answer?.map((line) => <p key={line}>{line}</p>)}
            {item.todo && <ToComplete label={item.todo} />}
          </div>
        </details>
      ))}
    </div>
  );
}
