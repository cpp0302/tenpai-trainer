import { Tile } from "../types/mahjong";

/**
 * 牌をSVGファイル名に変換
 */
export function tileToFileName(tile: Tile): string {
  const { type, value, isRed } = tile;

  // 赤ドラの場合
  if (isRed && value === 5) {
    if (type === "m") return "Man5-Dora.svg";
    if (type === "p") return "Pin5-Dora.svg";
    if (type === "s") return "Sou5-Dora.svg";
  }

  // 萬子
  if (type === "m") return `Man${value}.svg`;

  // 筒子
  if (type === "p") return `Pin${value}.svg`;

  // 索子
  if (type === "s") return `Sou${value}.svg`;

  // 字牌
  if (type === "j") {
    const zihai = ["Ton", "Nan", "Shaa", "Pei", "Haku", "Hatsu", "Chun"];
    return `${zihai[value - 1]}.svg`;
  }

  return "Blank.svg";
}

/**
 * 牌を文字列表記に変換（デバッグ用）
 */
export function tileToString(tile: Tile): string {
  const { type, value, isRed } = tile;
  const redMark = isRed ? "赤" : "";

  if (type === "m") return `${redMark}${value}萬`;
  if (type === "p") return `${redMark}${value}筒`;
  if (type === "s") return `${redMark}${value}索`;

  if (type === "j") {
    const zihai = ["東", "南", "西", "北", "白", "發", "中"];
    return zihai[value - 1];
  }

  return "?";
}

/**
 * 文字列から牌オブジェクトを作成
 * 例: "1m" -> { type: "m", value: 1 }
 */
export function stringToTile(str: string): Tile {
  const isRed = str.startsWith("r") || str.startsWith("赤");
  const cleanStr = str.replace(/^(r|赤)/, "");

  const value = parseInt(cleanStr[0]);
  const type = cleanStr[1] as "m" | "p" | "s" | "j";

  return { type, value, isRed };
}
