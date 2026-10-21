// Logique du quiz « Quel Na Nah N'Hair es-tu ? » (INFOS §10)
import { quiz } from "@/content/site";
import type { SerumId } from "@/lib/catalog";

export type QuizResult = SerumId;
export type Scores = Record<SerumId, number>;

// answers[i] = produit choisi à la question i
export function scoreAnswers(answers: SerumId[]): Scores {
  if (answers.length !== quiz.questions.length) throw new Error("Il faut une réponse par question");
  const scores: Scores = { fabulous: 0, miraculous: 0, luxurious: 0 };
  answers.forEach((product, i) => {
    const answer = quiz.questions[i].answers.find((a) => a.product === product);
    if (!answer) throw new Error(`Réponse inconnue à la question ${i + 1}`);
    scores[product] += answer.points;
  });
  return scores;
}

// Égalité : Miraculous l'emporte s'il est à égalité ; égalité Fabulous / Luxurious seule = Luxurious
export function resultFromScores(scores: Scores): QuizResult {
  const max = Math.max(scores.fabulous, scores.miraculous, scores.luxurious);
  const leaders = (Object.keys(scores) as SerumId[]).filter((k) => scores[k] === max);
  if (leaders.length === 1) return leaders[0];
  if (leaders.includes("miraculous")) return "miraculous";
  return "luxurious";
}

export function quizResult(answers: SerumId[]): QuizResult {
  return resultFromScores(scoreAnswers(answers));
}

export const QUIZ_RESULTS: QuizResult[] = ["fabulous", "miraculous", "luxurious"];
export function isQuizResult(v: string): v is QuizResult {
  return (QUIZ_RESULTS as string[]).includes(v);
}
