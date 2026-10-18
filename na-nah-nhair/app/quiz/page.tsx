import type { Metadata } from "next";
import Quiz from "@/components/quiz/Quiz";
import { quiz } from "@/content/site";

export const metadata: Metadata = { title: quiz.title, description: quiz.intro };

export default function QuizPage() {
  return <Quiz />;
}
