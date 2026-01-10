import { UserAnswer } from "./problem";

/**
 * 回答ログ（1問分）
 */
export interface AttemptLog {
  problemId: string;
  userAnswer: UserAnswer;
  isCorrect: boolean;
  elapsedMs: number; // 回答時間（ミリ秒）
  createdAt: number; // 回答日時（Unixタイムスタンプ）
}

/**
 * 統計情報
 */
export interface Statistics {
  totalAttempts: number; // 総回答数
  correctAttempts: number; // 正解数
  incorrectAttempts: number; // 不正解数
  averageElapsedMs: number; // 平均回答時間
  accuracyRate: number; // 正答率
}
