import { AppSettings, DEFAULT_SETTINGS } from "../types/settings";
import { AttemptLog } from "../types/stats";

const SETTINGS_KEY = "tenpai-trainer-settings";
const ATTEMPTS_KEY = "tenpai-trainer-attempts";
const MAX_ATTEMPTS = 2000; // 最大保存件数

/**
 * 設定の読み込み
 */
export function loadSettings(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;

  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) return DEFAULT_SETTINGS;

    const parsed = JSON.parse(stored);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (error) {
    console.error("Failed to load settings:", error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * 設定の保存
 */
export function saveSettings(settings: AppSettings): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Failed to save settings:", error);
  }
}

/**
 * 回答ログの読み込み
 */
export function loadAttempts(): AttemptLog[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(ATTEMPTS_KEY);
    if (!stored) return [];

    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to load attempts:", error);
    return [];
  }
}

/**
 * 回答ログの保存（ローテーション付き）
 */
export function saveAttempt(attempt: AttemptLog): void {
  if (typeof window === "undefined") return;

  try {
    const attempts = loadAttempts();
    attempts.push(attempt);

    // 最大件数を超えた場合は古いものから削除
    if (attempts.length > MAX_ATTEMPTS) {
      attempts.splice(0, attempts.length - MAX_ATTEMPTS);
    }

    localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(attempts));
  } catch (error) {
    console.error("Failed to save attempt:", error);
  }
}

/**
 * 全ての回答ログをクリア
 */
export function clearAttempts(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(ATTEMPTS_KEY);
  } catch (error) {
    console.error("Failed to clear attempts:", error);
  }
}
