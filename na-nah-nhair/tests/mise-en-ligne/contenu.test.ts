import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { launchBlockers } from "@/lib/launch-check";

// Lancé par npm run verifier:mise-en-ligne (pas par npm test) : échoue tant qu'une page publique
// afficherait « À COMPLÉTER ». Le message liste chaque endroit.
it("aucune information À COMPLÉTER sur les pages publiques", () => {
  const story = JSON.parse(readFileSync(new URL("../../public/story/source.json", import.meta.url), "utf8")) as { siteAddress: string | null };
  const list = launchBlockers({ storyAddress: story.siteAddress });
  expect(list, `\n${list.map((l) => `- ${l}`).join("\n")}\n`).toEqual([]);
});
