"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import OrientationGuard from "@/components/ui/OrientationGuard";
import { AppSettings, DEFAULT_SETTINGS, RuleSet, Difficulty, AnswerMode } from "@/lib/types/settings";
import { loadSettings, saveSettings } from "@/lib/storage";

export default function Home() {
  const router = useRouter();
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const loaded = loadSettings();
    setSettings(loaded);
  }, []);

  const handleStart = () => {
    saveSettings(settings);
    router.push("/practice");
  };

  return (
    <OrientationGuard>
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100 p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              麻雀点数計算トレーニング
            </h1>
            <p className="text-gray-600">
              実戦に近い形で点数計算を練習できるトレーニングアプリ
            </p>
          </div>

          <div className="space-y-6">
            {/* ルール選択 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ルール
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSettings({ ...settings, ruleSet: "mleague" })}
                  className={`px-4 py-3 rounded-lg border-2 font-medium transition ${
                    settings.ruleSet === "mleague"
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  Mリーグルール
                </button>
                <button
                  onClick={() => setSettings({ ...settings, ruleSet: "mahjong-soul" })}
                  className={`px-4 py-3 rounded-lg border-2 font-medium transition ${
                    settings.ruleSet === "mahjong-soul"
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  雀魂ルール
                </button>
              </div>
            </div>

            {/* 難易度選択 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                難易度
              </label>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => setSettings({ ...settings, difficulty: "practical" })}
                  className={`px-4 py-3 rounded-lg border-2 font-medium transition text-left ${
                    settings.difficulty === "practical"
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  <div className="font-semibold">実用重視モード</div>
                  <div className="text-sm opacity-75">
                    頻出役・20〜50符中心（デフォルト）
                  </div>
                </button>
              </div>
            </div>

            {/* 回答方式選択 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                回答方式
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSettings({ ...settings, answerMode: "input" })}
                  className={`px-4 py-3 rounded-lg border-2 font-medium transition ${
                    settings.answerMode === "input"
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  テキスト入力
                </button>
                <button
                  onClick={() => setSettings({ ...settings, answerMode: "choice" })}
                  className={`px-4 py-3 rounded-lg border-2 font-medium transition ${
                    settings.answerMode === "choice"
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  選択肢式（6択）
                </button>
              </div>
            </div>

            {/* 開始ボタン */}
            <div className="pt-4">
              <Button
                onClick={handleStart}
                size="lg"
                className="w-full"
              >
                開始
              </Button>
            </div>
          </div>
        </div>
      </main>
    </OrientationGuard>
  );
}
