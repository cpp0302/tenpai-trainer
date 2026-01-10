"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import OrientationGuard from "@/components/ui/OrientationGuard";
import Button from "@/components/ui/Button";
import Hand from "@/components/mahjong/Hand";
import DoraIndicator from "@/components/mahjong/DoraIndicator";
import { AnswerResult } from "@/lib/types/problem";
import { Problem } from "@/lib/types/problem";
import { loadLastResult, clearLastResult } from "@/lib/storage/session";
import { saveAttempt } from "@/lib/storage";
import { getProblemById } from "@/lib/problem";

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [problem, setProblem] = useState<Problem | null>(null);

  useEffect(() => {
    const lastResult = loadLastResult();
    if (!lastResult) {
      alert("結果が見つかりません。もう一度問題を開始してください。");
      router.push("/");
      return;
    }

    setResult(lastResult);

    // 問題データを取得
    const prob = getProblemById(lastResult.problemId);
    if (prob) {
      setProblem(prob);
    }

    // localStorageに保存
    saveAttempt({
      problemId: lastResult.problemId,
      userAnswer: lastResult.userAnswer,
      isCorrect: lastResult.isCorrect,
      elapsedMs: lastResult.elapsedMs,
      createdAt: lastResult.createdAt,
    });

    // sessionStorageからクリア
    clearLastResult();
  }, [router]);

  const handleNextProblem = () => {
    router.push("/practice");
  };

  const handleRetry = () => {
    // 同じ問題をもう一度
    router.push(`/practice?problemId=${result?.problemId}`);
  };

  const handleBackHome = () => {
    router.push("/");
  };

  if (!result || !problem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">結果を読み込んでいます...</p>
        </div>
      </div>
    );
  }

  const { userAnswer, isCorrect, elapsedMs } = result;
  const { correctAnswer, winSituation, hand } = problem;
  const winType = winSituation.winType;

  return (
    <OrientationGuard>
      <main className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-6">
            {/* 左側: 結果サマリエリア（45%） */}
            <div className="w-[45%] bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-6">
                <div
                  className={`text-6xl mb-4 ${
                    isCorrect ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isCorrect ? "✅" : "❌"}
                </div>
                <h2
                  className={`text-3xl font-bold mb-2 ${
                    isCorrect ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {isCorrect ? "正解" : "不正解"}
                </h2>
                <div className="text-sm text-gray-500">
                  {winType === "ron" ? "ロン" : "ツモ"}
                </div>
              </div>

              <div className="space-y-6">
                {/* あなたの回答 */}
                <div className="border-t pt-4">
                  <div className="text-sm font-semibold text-gray-600 mb-2">
                    あなたの回答
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    {userAnswer.winType === "ron" ? (
                      <>{userAnswer.score}点</>
                    ) : (
                      <>
                        親 {userAnswer.dealerPays} / 子 {userAnswer.nonDealerPays}
                      </>
                    )}
                  </div>
                </div>

                {/* 正解 */}
                <div className="border-t pt-4">
                  <div className="text-sm font-semibold text-gray-600 mb-2">
                    正解
                  </div>
                  <div className="text-2xl font-bold text-green-700">
                    {winType === "ron" ? (
                      <>{correctAnswer.ronScore}点</>
                    ) : (
                      <>
                        親 {correctAnswer.tsumoScoreDealer} / 子{" "}
                        {correctAnswer.tsumoScoreNonDealer}
                      </>
                    )}
                  </div>
                </div>

                {/* 回答時間 */}
                <div className="border-t pt-4">
                  <div className="text-sm font-semibold text-gray-600 mb-2">
                    回答時間
                  </div>
                  <div className="text-xl font-bold text-gray-800">
                    {(elapsedMs / 1000).toFixed(2)}秒
                  </div>
                </div>
              </div>
            </div>

            {/* 右側: 解説エリア（55%） */}
            <div className="w-[55%] space-y-6">
              {/* 翻・符 */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  点数計算
                </h3>
                <div className="flex gap-6 mb-4">
                  <div>
                    <div className="text-sm text-gray-600">翻数</div>
                    <div className="text-3xl font-bold text-gray-800">
                      {correctAnswer.han}翻
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">符</div>
                    <div className="text-3xl font-bold text-gray-800">
                      {correctAnswer.fu}符
                    </div>
                  </div>
                </div>
              </div>

              {/* 役一覧 */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">役</h3>
                <div className="space-y-2">
                  {correctAnswer.yaku.map((yaku, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center py-2 border-b last:border-b-0"
                    >
                      <span className="font-medium text-gray-800">
                        {yaku.name}
                      </span>
                      <span className="text-gray-600">{yaku.han}翻</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 状況の再提示 */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  問題の状況
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">親子</span>
                    <span className="font-semibold text-gray-800">
                      {problem.table.players.self.isDealer ? "親" : "子"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">場風</span>
                    <span className="font-semibold text-gray-800">
                      {problem.table.round.roundWind === "east" ? "東" : "南"}
                      {problem.table.round.roundNumber}局
                    </span>
                  </div>
                  <div className="border-t pt-3">
                    <DoraIndicator
                      dora={winSituation.dora}
                      uraDora={winSituation.uraDora}
                      showUraDora={winSituation.isRiichi}
                      size="sm"
                    />
                  </div>
                </div>
              </div>

              {/* 手牌の再掲 */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">手牌</h3>
                <div className="flex justify-center">
                  <Hand hand={hand} size="md" />
                </div>
              </div>
            </div>
          </div>

          {/* 行動導線 */}
          <div className="mt-6 flex gap-4 justify-center">
            <Button onClick={handleNextProblem} size="lg" className="px-12">
              次の問題へ
            </Button>
            <Button
              onClick={handleRetry}
              variant="secondary"
              size="lg"
              className="px-8"
            >
              同じ問題をもう一度
            </Button>
            <Button
              onClick={handleBackHome}
              variant="tertiary"
              size="lg"
              className="px-8"
            >
              ホームへ戻る
            </Button>
          </div>
        </div>
      </main>
    </OrientationGuard>
  );
}
