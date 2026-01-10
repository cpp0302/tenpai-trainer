/**
 * ルール
 */
export type RuleSet = "mleague" | "mahjong-soul";

/**
 * 難易度
 */
export type Difficulty = "practical" | "real" | "comprehensive";

/**
 * 回答方式
 */
export type AnswerMode = "input" | "choice";

/**
 * アプリ設定
 */
export interface AppSettings {
  ruleSet: RuleSet; // ルール
  difficulty: Difficulty; // 難易度
  answerMode: AnswerMode; // 回答方式
}

/**
 * デフォルト設定
 */
export const DEFAULT_SETTINGS: AppSettings = {
  ruleSet: "mleague",
  difficulty: "practical",
  answerMode: "input",
};
