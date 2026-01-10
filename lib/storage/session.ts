import { AnswerResult } from "../types/problem";

const RESULT_KEY = "tenpai-trainer-last-result";

/**
 * 最後の回答結果を保存
 */
export function saveLastResult(result: AnswerResult): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.setItem(RESULT_KEY, JSON.stringify(result));
  } catch (error) {
    console.error("Failed to save last result:", error);
  }
}

/**
 * 最後の回答結果を読み込み
 */
export function loadLastResult(): AnswerResult | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = sessionStorage.getItem(RESULT_KEY);
    if (!stored) return null;

    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to load last result:", error);
    return null;
  }
}

/**
 * 最後の回答結果をクリア
 */
export function clearLastResult(): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.removeItem(RESULT_KEY);
  } catch (error) {
    console.error("Failed to clear last result:", error);
  }
}
