/**
 * 牌の種類
 */
export type TileType = "m" | "p" | "s" | "j"; // 萬子、筒子、索子、字牌

/**
 * 牌（1枚）
 */
export interface Tile {
  type: TileType;
  value: number; // 萬子・筒子・索子: 1-9, 字牌: 1-7 (東南西北白發中)
  isRed?: boolean; // 赤ドラ
}

/**
 * 手牌
 */
export interface Hand {
  tiles: Tile[];
  openMelds?: OpenMeld[]; // 副露
}

/**
 * 副露の種類
 */
export type OpenMeldType = "chi" | "pon" | "kan" | "ankan";

/**
 * 副露
 */
export interface OpenMeld {
  type: OpenMeldType;
  tiles: Tile[];
}

/**
 * 役
 */
export interface Yaku {
  name: string;
  han: number; // 翻数
}

/**
 * 待ち形の種類
 */
export type WaitType =
  | "tanki"    // 単騎待ち
  | "ryanmen"  // 両面待ち
  | "kanchan"  // 嵌張待ち
  | "penchan"  // 辺張待ち
  | "shanpon"; // 双碰待ち

/**
 * 面子パターンの種類
 */
export type MeldPattern =
  | "shuntsu" // 順子（123など）
  | "koutsu"  // 刻子（111など）
  | "kantsu"  // 槓子（1111など）
  | "toitsu"; // 対子（11など）

/**
 * 面子（順子・刻子・対子など）
 */
export interface Meld {
  pattern: MeldPattern;
  tiles: Tile[];
}

/**
 * 手牌の面子構成パターン
 */
export interface HandPattern {
  melds: Meld[]; // 面子のリスト（通常は4面子1雀頭、七対子は7対子、国士無双は特殊形）
  waitType?: WaitType; // 待ち形（あれば）
  isChiitoitsu?: boolean; // 七対子かどうか
  isKokushi?: boolean; // 国士無双かどうか
}

/**
 * 風
 */
export type Wind = "east" | "south" | "west" | "north";

/**
 * 場風
 */
export type RoundWind = Wind;

/**
 * 自風
 */
export type SeatWind = Wind;

/**
 * 和了の種類
 */
export type WinType = "ron" | "tsumo";

/**
 * プレイヤーの位置
 */
export type PlayerPosition = "self" | "right" | "opposite" | "left";

/**
 * 親子
 */
export type PlayerRole = "dealer" | "non-dealer"; // 親、子

/**
 * 和了情報
 */
export interface WinInfo {
  winType: WinType;
  winTile: Tile;
  isDealer: boolean; // 自分が親か
  roundWind: RoundWind;
  seatWind: SeatWind;
  dora: Tile[]; // ドラ表示牌
  uraDora?: Tile[]; // 裏ドラ表示牌
  isRiichi?: boolean; // リーチ
  isIppatsu?: boolean; // 一発
  isRinshan?: boolean; // 嶺上開花
  isChankan?: boolean; // 槍槓
  isHaitei?: boolean; // 海底摸月
  isHoutei?: boolean; // 河底撈魚
}

/**
 * 点数計算結果
 */
export interface ScoreResult {
  han: number; // 翻数
  fu: number; // 符数
  yakuman?: number; // 役満倍数（通常の役の場合はundefined）
  yaku: Yaku[]; // 役一覧
  basePoints: number; // 基本点
  ronScore?: number; // ロンの場合の点数
  tsumoScoreDealer?: number; // ツモの場合の親の支払い
  tsumoScoreNonDealer?: number; // ツモの場合の子の支払い
}
