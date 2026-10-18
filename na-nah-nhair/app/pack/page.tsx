import type { Metadata } from "next";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import LavenderBox from "@/components/LavenderBox";
import PhotoSlot from "@/components/PhotoSlot";
import { emotionalConcept, pack, products } from "@/content/site";
import { themeClasses } from "@/lib/theme-classes";

export const metadata: Metadata = {
  title: `${pack.name} · ${pack.price}`,
  description: `${pack.contentTitle} : Fabulous, Miraculous et Luxurious.`,
};

export default function PackPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <div className="grid gap-10 md:grid-cols-2">
        <PhotoSlot photo={pack.photo} priority className="aspect-square rounded-[2rem]" />
        <div>
          <h1 className="text-6xl text-deep-violet sm:text-7xl">{pack.name}</h1>
          <p className="mt-2 font-display text-5xl text-plum">{pack.price}</p>
          <p className="mt-6 text-xl font-bold text-deep-violet">{emotionalConcept.lines.join(" ")}</p>

          <h2 className="mt-8 font-body text-lg font-bold text-deep-violet">{pack.contentTitle}</h2>
          <ol className="mt-3 grid gap-3">
            {pack.content.map((c, i) => {
              const p = products.find((x) => x.shortName === c.product)!;
              const t = themeClasses[p.slug];
              return (
                <li key={c.product} className={`${t.base} ${t.text} rounded-2xl px-4 py-3`}>
                  <span className="font-bold">
                    {i + 1}. <Link href={`/soins/${p.slug}`} className="underline underline-offset-4">{c.product}</Link>
                  </span>{" "}
                  : {c.text}
                </li>
              );
            })}
          </ol>

          <LavenderBox className="mt-6">
            <h2 className="font-body text-lg font-bold">{pack.usageTitle}</h2>
            <p className="mt-2">{pack.usage.charAt(0).toUpperCase() + pack.usage.slice(1)}</p>
          </LavenderBox>

          <AddToCartButton className="mt-8" />
        </div>
      </div>
    </div>
  );
}
