import type { FaqItem } from "@/content/site";
import ToComplete from "@/components/ToComplete";

export default function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-lavender rounded-3xl border-2 border-lavender">
      {items.map((item) => (
        <details key={item.question} className="group px-5 py-2 sm:py-4">
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
          <div className="mt-2 space-y-2 pb-2 sm:mt-3 sm:pb-0">
            {item.answer?.map((line) => <p key={line}>{line}</p>)}
            {item.list && (
              <ul className="list-disc space-y-1 pl-5">
                {item.list.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            )}
            {item.blocks?.map((block) => (
              <div key={block.title} className="pt-2">
                <h3 className="text-sm font-bold uppercase tracking-wide">{block.title}</h3>
                <ol className="mt-1 space-y-1">
                  {block.steps.map((step) => (
                    <li key={step.label}>
                      <span className="font-bold">{step.label}</span> : {step.text}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
            {item.mailto && (
              <p>
                {item.mailto.before}{" "}
                <a href={`mailto:${item.mailto.email}`} className="font-bold underline underline-offset-4">
                  {item.mailto.email}
                </a>
                .
              </p>
            )}
            {item.todo && <ToComplete label={item.todo} />}
          </div>
        </details>
      ))}
    </div>
  );
}
