import { Tile } from "@/lib/types/mahjong";

/**
 * 牌の種類の優先順位を取得
 * @param type 牌の種類
 * @returns 優先順位（小さいほど先）
 */
function getTypeOrder(type: string): number {
  const order: Record<string, number> = {
    m: 0, // 萬子
    p: 1, // 筒子
    s: 2, // 索子
    j: 3, // 字牌
  };
  return order[type] ?? 999;
}

/**
 * 2つの牌を比較する
 * ソート順: type順 → value順 → 赤ドラ順
 * @param tile1 牌1
 * @param tile2 牌2
 * @returns 負の数: tile1 < tile2, 0: tile1 === tile2, 正の数: tile1 > tile2
 */
export function compareTiles(tile1: Tile, tile2: Tile): number {
  // type順で比較
  const typeOrder1 = getTypeOrder(tile1.type);
  const typeOrder2 = getTypeOrder(tile2.type);
  if (typeOrder1 !== typeOrder2) {
    return typeOrder1 - typeOrder2;
  }

  // 同type内ではvalue順で比較
  if (tile1.value !== tile2.value) {
    return tile1.value - tile2.value;
  }

  // 同type・同valueの場合、赤ドラを後に配置
  const isRed1 = tile1.isRed ?? false;
  const isRed2 = tile2.isRed ?? false;
  if (isRed1 !== isRed2) {
    return isRed1 ? 1 : -1;
  }

  return 0;
}

/**
 * 2つの牌が同一かどうかを判定する
 * @param tile1 牌1
 * @param tile2 牌2
 * @param ignoreRed 赤ドラを無視するかどうか（デフォルト: false）
 * @returns 同一ならtrue、異なればfalse
 */
export function isSameTile(
  tile1: Tile,
  tile2: Tile,
  ignoreRed: boolean = false
): boolean {
  // type と value が一致しているかチェック
  if (tile1.type !== tile2.type || tile1.value !== tile2.value) {
    return false;
  }

  // ignoreRedがtrueの場合は赤ドラの差を無視
  if (ignoreRed) {
    return true;
  }

  // 赤ドラの有無も一致しているかチェック
  const isRed1 = tile1.isRed ?? false;
  const isRed2 = tile2.isRed ?? false;
  return isRed1 === isRed2;
}

/**
 * 牌の配列をソートする（破壊的）
 * @param tiles 牌の配列
 * @returns ソート済みの配列（元の配列を変更）
 */
export function sortTiles(tiles: Tile[]): Tile[] {
  return tiles.sort(compareTiles);
}

/**
 * 牌の配列をソートして新しい配列を返す（非破壊的）
 * @param tiles 牌の配列
 * @returns ソート済みの新しい配列
 */
export function sortTilesCopy(tiles: Tile[]): Tile[] {
  return [...tiles].sort(compareTiles);
}
