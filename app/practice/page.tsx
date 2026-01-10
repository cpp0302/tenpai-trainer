"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import OrientationGuard from "@/components/ui/OrientationGuard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Hand from "@/components/mahjong/Hand";
import DoraIndicator from "@/components/mahjong/DoraIndicator";
import { Problem, UserAnswer } from "@/lib/types/problem";
import { loadSettings } from "@/lib/storage";
import { saveLastResult } from "@/lib/storage/session";
import { getRandomProblem, checkAnswer } from "@/lib/problem";

type Phase = "ready" | "演出" | "回答";

export default function PracticePage() {
  const router = useRouter();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [phase, setPhase] = useState<Phase>("ready");
  const [startTime, setStartTime] = useState<number>(0);

  // 回答入力（ロン）
  const [ronScore, setRonScore] = useState("");

  // 回答入力（ツモ）
  const [dealerPays, setDealerPays] = useState("");
  const [nonDealerPays, setNonDealerPays] = useState("");

  useEffect(() => {
    // 問題を読み込む
    const settings = loadSettings();
    const prob = getRandomProblem(settings.difficulty);
    if (prob) {
      setProblem(prob);
      setPhase("ready");
    } else {
      alert("問題が見つかりませんでした");
      router.push("/");
    }
  }, [router]);

  const handleStartAnimation = () => {
    setPhase("演出");
    // 演出をスキップして即座に回答フェーズへ（MVP）
    setTimeout(() => {
      setPhase("回答");
      setStartTime(Date.now());
    }, 500);
  };

  const handleSkip = () => {
    setPhase("回答");
    setStartTime(Date.now());
  };

  const handleSubmit = () => {
    if (!problem) return;

    let userAnswer: UserAnswer;

    if (problem.winSituation.winType === "ron") {
      const score = parseInt(ronScore);
      if (isNaN(score)) {
        alert("点数を入力してください");
        return;
      }
      userAnswer = { winType: "ron", score };
    } else {
      const dealer = parseInt(dealerPays);
      const nonDealer = parseInt(nonDealerPays);
      if (isNaN(dealer) || isNaN(nonDealer)) {
        alert("親と子の支払いを入力してください");
        return;
      }
      userAnswer = { winType: "tsumo", dealerPays: dealer, nonDealerPays: nonDealer };
    }

    const isCorrect = checkAnswer(problem, userAnswer);
    const elapsedMs = Date.now() - startTime;

    // 結果をsessionStorageに保存
    saveLastResult({
      problemId: problem.id,
      userAnswer,
      isCorrect,
      elapsedMs,
      createdAt: Date.now(),
    });

    // 結果画面へ遷移
    router.push("/result");
  };

  const handleSkipAnswer = () => {
    if (!problem) return;

    // わからないボタン（不正解扱い）
    const userAnswer: UserAnswer =
      problem.winSituation.winType === "ron"
        ? { winType: "ron", score: 0 }
        : { winType: "tsumo", dealerPays: 0, nonDealerPays: 0 };

    saveLastResult({
      problemId: problem.id,
      userAnswer,
      isCorrect: false,
      elapsedMs: Date.now() - startTime,
      createdAt: Date.now(),
    });

    router.push("/result");
  };

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">問題を読み込んでいます...</p>
        </div>
      </div>
    );
  }

  const settings = loadSettings();
  const { winType } = problem.winSituation;

  return (
    <OrientationGuard>
      <main className="min-h-screen bg-green-800 flex flex-col">
        {/* ヘッダー */}
        <div className="bg-gray-900 text-white px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="font-semibold">
              {problem.table.round.roundWind === "east" ? "東" : "南"}
              {problem.table.round.roundNumber}局
            </span>
            <DoraIndicator
              dora={problem.winSituation.dora}
              uraDora={problem.winSituation.uraDora}
              showUraDora={phase === "回答" && problem.winSituation.isRiichi}
              size="sm"
            />
          </div>
          <Button variant="tertiary" size="sm" onClick={() => router.push("/")}>
            ホームへ戻る
          </Button>
        </div>

        <div className="flex-1 flex">
          {/* 左側: 卓情報エリア（60%） */}
          <div className="w-3/5 p-6 flex items-center justify-center">
            <div className="bg-green-700 rounded-2xl p-8 w-full max-w-3xl">
              <div className="text-center mb-6">
                <div className="text-white text-sm mb-4">自分の手牌</div>
                <div className="flex justify-center">
                  <Hand hand={problem.hand} size="lg" />
                </div>
                {problem.winSituation.isRiichi && (
                  <div className="mt-4">
                    <span className="inline-block bg-red-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      リーチ
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右側: 回答エリア（40%） */}
          <div className="w-2/5 bg-white p-6 flex flex-col justify-center">
            {phase === "ready" && (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">準備完了</h2>
                <p className="text-gray-600 mb-6">開始ボタンを押して出題を開始してください</p>
                <Button onClick={handleStartAnimation} size="lg">
                  開始
                </Button>
              </div>
            )}

            {phase === "演出" && (
              <div className="text-center">
                <p className="text-gray-600 mb-4">数巡進行中...</p>
                <Button onClick={handleSkip} variant="secondary">
                  スキップ
                </Button>
              </div>
            )}

            {phase === "回答" && (
              <div>
                <div className="mb-6">
                  <div className="text-center mb-4">
                    <span className="inline-block bg-yellow-500 text-white px-6 py-3 rounded-lg text-2xl font-bold">
                      {winType === "ron" ? "ロン！" : "ツモ！"}
                    </span>
                  </div>
                  <div className="text-center text-gray-600">
                    {problem.table.players.self.isDealer ? "親" : "子"}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">点数を入力してください</h3>

                  {winType === "ron" ? (
                    settings.answerMode === "input" ? (
                      <Input
                        type="number"
                        value={ronScore}
                        onChange={(e) => setRonScore(e.target.value)}
                        placeholder="例: 3900"
                        label="点数"
                      />
                    ) : (
                      <div className="space-y-2">
                        {problem.choices?.map((score) => (
                          <button
                            key={score}
                            onClick={() => setRonScore(score.toString())}
                            className={`w-full px-4 py-3 rounded-lg border-2 font-medium transition ${
                              ronScore === score.toString()
                                ? "border-green-600 bg-green-50 text-green-700"
                                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                            }`}
                          >
                            {score}点
                          </button>
                        ))}
                      </div>
                    )
                  ) : settings.answerMode === "input" ? (
                    <>
                      <Input
                        type="number"
                        value={dealerPays}
                        onChange={(e) => setDealerPays(e.target.value)}
                        placeholder="例: 2000"
                        label="親の支払い"
                      />
                      <Input
                        type="number"
                        value={nonDealerPays}
                        onChange={(e) => setNonDealerPays(e.target.value)}
                        placeholder="例: 1000"
                        label="子の支払い"
                      />
                    </>
                  ) : (
                    <div className="space-y-2">
                      {problem.choicesTsumo?.map((choice, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setDealerPays(choice.dealer.toString());
                            setNonDealerPays(choice.nonDealer.toString());
                          }}
                          className={`w-full px-4 py-3 rounded-lg border-2 font-medium transition ${
                            dealerPays === choice.dealer.toString() &&
                            nonDealerPays === choice.nonDealer.toString()
                              ? "border-green-600 bg-green-50 text-green-700"
                              : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                          }`}
                        >
                          親{choice.dealer} / 子{choice.nonDealer}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSubmit} className="flex-1">
                      回答する
                    </Button>
                    <Button onClick={handleSkipAnswer} variant="secondary" className="flex-1">
                      わからない
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </OrientationGuard>
  );
}
