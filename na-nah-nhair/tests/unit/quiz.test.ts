import { describe, expect, it } from "vitest";
import { quiz } from "@/content/site";
import type { SerumId } from "@/lib/catalog";
import { quizResult, resultFromScores, scoreAnswers } from "@/lib/quiz";

const SERUMS: SerumId[] = ["fabulous", "miraculous", "luxurious"];
// Les 3^5 = 243 façons de répondre au quiz
const ALL: SerumId[][] = [];
(function gen(prefix: SerumId[]) {
  if (prefix.length === 5) return ALL.push(prefix);
  for (const s of SERUMS) gen([...prefix, s]);
})([]);

describe("contenu du quiz (INFOS §10)", () => {
  it("5 questions, 3 réponses chacune, une par soin", () => {
    expect(quiz.questions).toHaveLength(5);
    for (const q of quiz.questions) expect(q.answers.map((a) => a.product).sort()).toEqual([...SERUMS].sort());
  });

  it("points : 1 partout, sauf Miraculous 2 points aux questions 4 et 5", () => {
    quiz.questions.forEach((q, i) => {
      for (const a of q.answers) expect(a.points, `Q${i + 1} ${a.product}`).toBe(a.product === "miraculous" && i >= 3 ? 2 : 1);
    });
  });

  it("l'ordre des réponses change : le premier soin proposé n'est pas toujours le même", () => {
    const firsts = quiz.questions.map((q) => q.answers[0].product);
    expect(new Set(firsts).size).toBe(3);
    for (let i = 1; i < firsts.length; i++) expect(firsts[i]).not.toBe(firsts[i - 1]);
  });
});

describe("calcul du résultat", () => {
  it("les 3 soins sont atteignables, jamais le pack", () => {
    const results = new Set(ALL.map(quizResult));
    expect([...results].sort()).toEqual(["fabulous", "luxurious", "miraculous"]);
  });

  it("scores extrêmes : 5 réponses identiques", () => {
    expect(quizResult(Array(5).fill("fabulous"))).toBe("fabulous");
    expect(quizResult(Array(5).fill("luxurious"))).toBe("luxurious");
    expect(quizResult(Array(5).fill("miraculous"))).toBe("miraculous");
    expect(scoreAnswers(Array(5).fill("miraculous"))).toEqual({ fabulous: 0, miraculous: 7, luxurious: 0 });
    expect(scoreAnswers(Array(5).fill("fabulous"))).toEqual({ fabulous: 5, miraculous: 0, luxurious: 0 });
  });

  it("égalités : Miraculous l'emporte dès qu'il est à égalité, Fabulous = Luxurious seuls → Luxurious", () => {
    expect(resultFromScores({ fabulous: 2, miraculous: 2, luxurious: 1 })).toBe("miraculous");
    expect(resultFromScores({ fabulous: 1, miraculous: 2, luxurious: 2 })).toBe("miraculous");
    expect(resultFromScores({ fabulous: 2, miraculous: 2, luxurious: 2 })).toBe("miraculous");
    expect(resultFromScores({ fabulous: 2, miraculous: 1, luxurious: 2 })).toBe("luxurious");
    expect(resultFromScores({ fabulous: 3, miraculous: 0, luxurious: 3 })).toBe("luxurious");
    expect(resultFromScores({ fabulous: 3, miraculous: 3, luxurious: 0 })).toBe("miraculous");
  });

  it("chaque combinaison respecte la règle (vérification exhaustive des 243 cas)", () => {
    let ties = 0;
    for (const answers of ALL) {
      const s = scoreAnswers(answers);
      expect(s.fabulous + s.miraculous + s.luxurious).toBe(5 + answers.slice(3).filter((a) => a === "miraculous").length);
      const max = Math.max(s.fabulous, s.miraculous, s.luxurious);
      const leaders = SERUMS.filter((k) => s[k] === max);
      const expected = leaders.length === 1 ? leaders[0] : leaders.includes("miraculous") ? "miraculous" : "luxurious";
      if (leaders.length > 1) ties++;
      expect(quizResult(answers), answers.join(",")).toBe(expected);
    }
    expect(ties).toBeGreaterThan(0);
  });

  it("les égalités réellement possibles sont toutes couvertes", () => {
    const tieKinds = new Set<string>();
    for (const answers of ALL) {
      const s = scoreAnswers(answers);
      const max = Math.max(s.fabulous, s.miraculous, s.luxurious);
      const leaders = SERUMS.filter((k) => s[k] === max);
      if (leaders.length > 1) tieKinds.add(leaders.join("+"));
    }
    // Égalités à deux et égalité parfaite à trois (ex. 2-2-2) : toutes possibles
    expect([...tieKinds].sort()).toEqual(
      ["fabulous+luxurious", "fabulous+miraculous", "miraculous+luxurious", "fabulous+miraculous+luxurious"].sort(),
    );
    // Égalité parfaite : Miraculous
    expect(quizResult(["fabulous", "fabulous", "luxurious", "luxurious", "miraculous"])).toBe("miraculous");
  });

  it("refuse un nombre de réponses incorrect", () => {
    expect(() => scoreAnswers(["fabulous"])).toThrow();
  });
});

describe("quiz : réponses identiques à INFOS.md §10", () => {
  it("chaque réponse et son soin figurent dans INFOS", async () => {
    const { readFileSync } = await import("node:fs");
    const infos = readFileSync(new URL("../../INFOS.md", import.meta.url), "utf8");
    const label = { fabulous: "Fabulous", miraculous: "Miraculous", luxurious: "Luxurious" } as const;
    for (const q of quiz.questions)
      for (const a of q.answers) {
        const text = a.text.replaceAll(" ", " ");
        expect(infos, text).toContain(`- ${text} → ${label[a.product]} (${a.points} point${a.points > 1 ? "s" : ""})`);
      }
  });
});
