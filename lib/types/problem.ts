import { Hand, Tile, WinType, RoundWind, SeatWind, ScoreResult } from "./mahjong";

/**
 * 局情報
 */
export interface RoundInfo {
  roundWind: RoundWind; // 場風
  roundNumber: number; // 局数（1-4）
  honba: number; // 本場
  riichibou: number; // 供託
}

/**
 * プレイヤー情報
 */
export interface PlayerInfo {
  score: number; // 点数
  isDealer: boolean; // 親か
}

/**
 * 卓情報
 */
export interface TableInfo {
  round: RoundInfo;
  players: {
    self: PlayerInfo;
    right: PlayerInfo;
    opposite: PlayerInfo;
    left: PlayerInfo;
  };
}

/**
 * 和了シチュエーション
 */
export interface WinSituation {
  winType: WinType;
  winTile: Tile; // 和了牌
  isRiichi: boolean; // リーチか
  isIppatsu?: boolean; // 一発か
  isTsumo?: boolean; // ツモか（winType="tsumo"と同じ）
  dora: Tile[]; // ドラ表示牌
  uraDora?: Tile[]; // 裏ドラ表示牌
}

/**
 * 問題データ
 */
export interface Problem {
  id: string; // 問題ID（例: "p0001"）
  difficulty: "practical" | "real" | "comprehensive"; // 難易度
  table: TableInfo; // 卓情報
  hand: Hand; // 自分の手牌（テンパイ時点）
  winSituation: WinSituation; // 和了シチュエーション
  correctAnswer: ScoreResult; // 正解（点数計算結果）
  choices?: number[]; // 選択肢式の場合の選択肢（点数のリスト）
  choicesTsumo?: Array<{ dealer: number; nonDealer: number }>; // ツモの場合の選択肢
}

/**
 * ユーザー回答（ロン）
 */
export interface UserAnswerRon {
  winType: "ron";
  score: number;
}

/**
 * ユーザー回答（ツモ）
 */
export interface UserAnswerTsumo {
  winType: "tsumo";
  dealerPays: number; // 親の支払い
  nonDealerPays: number; // 子の支払い
}

/**
 * ユーザー回答
 */
export type UserAnswer = UserAnswerRon | UserAnswerTsumo;

/**
 * 回答結果
 */
export interface AnswerResult {
  problemId: string;
  userAnswer: UserAnswer;
  isCorrect: boolean;
  elapsedMs: number; // 回答時間（ミリ秒）
  createdAt: number; // 回答日時（タイムスタンプ）
}
