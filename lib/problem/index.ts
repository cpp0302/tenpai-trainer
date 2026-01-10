import { Problem, UserAnswer } from "../types/problem";
import problemsData from "@/data/problems/problems.json";

/**
 * 全ての問題を取得
 */
export function getAllProblems(): Problem[] {
  return problemsData as Problem[];
}

/**
 * 問題IDで取得
 */
export function getProblemById(id: string): Problem | null {
  const problems = getAllProblems();
  return problems.find((p) => p.id === id) || null;
}

/**
 * ランダムに問題を1つ取得
 */
export function getRandomProblem(difficulty?: string): Problem | null {
  const problems = getAllProblems();

  // 難易度でフィルタ
  const filtered = difficulty
    ? problems.filter((p) => p.difficulty === difficulty)
    : problems;

  if (filtered.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}

/**
 * ユーザー回答が正解かチェック
 */
export function checkAnswer(problem: Problem, userAnswer: UserAnswer): boolean {
  const correct = problem.correctAnswer;

  if (userAnswer.winType === "ron") {
    // ロンの場合
    return userAnswer.score === correct.ronScore;
  } else {
    // ツモの場合
    return (
      userAnswer.dealerPays === correct.tsumoScoreDealer &&
      userAnswer.nonDealerPays === correct.tsumoScoreNonDealer
    );
  }
}
