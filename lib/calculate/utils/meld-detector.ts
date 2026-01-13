import { Tile } from "@/lib/types/mahjong";
import { isSameTile } from "./tile-comparator";

/**
 * 指定した牌を配列から削除する（最初に見つかった1枚のみ）
 * @param tiles 牌配列
 * @param tileToRemove 削除する牌
 * @returns 削除後の新しい配列（元の配列は変更しない）
 */
export function removeTile(tiles: Tile[], tileToRemove: Tile): Tile[] {
  const index = tiles.findIndex((tile) => isSameTile(tile, tileToRemove));
  if (index === -1) {
    // 見つからない場合は元の配列をそのまま返す
    return tiles;
  }
  // 見つかった要素を除いた新しい配列を返す
  return [...tiles.slice(0, index), ...tiles.slice(index + 1)];
}

/**
 * 指定した複数の牌を配列から削除する
 * @param tiles 牌配列
 * @param tilesToRemove 削除する牌のリスト
 * @returns 削除後の新しい配列（元の配列は変更しない）
 */
export function removeTiles(tiles: Tile[], tilesToRemove: Tile[]): Tile[] {
  let result = tiles;
  for (const tile of tilesToRemove) {
    result = removeTile(result, tile);
  }
  return result;
}

/**
 * 指定した牌の対子が存在するかチェックする
 * @param tiles 牌配列
 * @param targetTile 対子の牌
 * @returns 対子が存在する場合、その2枚の牌を返す。存在しない場合はnull
 */
export function detectToitsu(tiles: Tile[], targetTile: Tile): Tile[] | null {
  const matchingTiles: Tile[] = [];

  for (const tile of tiles) {
    if (isSameTile(tile, targetTile, true)) {
      // ignoreRed=trueで赤ドラも同じとして扱う
      matchingTiles.push(tile);
      if (matchingTiles.length === 2) {
        return matchingTiles;
      }
    }
  }

  // 2枚未満の場合はnull
  return null;
}

/**
 * 指定した牌の刻子が存在するかチェックする
 * @param tiles 牌配列
 * @param targetTile 刻子の牌
 * @returns 刻子が存在する場合、その3枚の牌を返す。存在しない場合はnull
 */
export function detectKoutsu(tiles: Tile[], targetTile: Tile): Tile[] | null {
  const matchingTiles: Tile[] = [];

  for (const tile of tiles) {
    if (isSameTile(tile, targetTile, true)) {
      // ignoreRed=trueで赤ドラも同じとして扱う
      matchingTiles.push(tile);
      if (matchingTiles.length === 3) {
        return matchingTiles;
      }
    }
  }

  // 3枚未満の場合はnull
  return null;
}

/**
 * 指定した牌から始まる順子が存在するかチェックする
 * @param tiles ソート済みの牌配列（ソートされていなくても動作するが、効率が良い）
 * @param startTile 順子の開始牌
 * @returns 順子が存在する場合、その3枚の牌を返す。存在しない場合はnull
 */
export function detectShuntsu(tiles: Tile[], startTile: Tile): Tile[] | null {
  // 字牌は順子を作れない
  if (startTile.type === "j") {
    return null;
  }

  // 8, 9から始まる順子は作れない
  if (startTile.value >= 8) {
    return null;
  }

  // startTile, value+1, value+2 の3枚を探す
  const tile1 = tiles.find((tile) => isSameTile(tile, startTile, true));
  if (!tile1) {
    return null;
  }

  const tile2 = tiles.find((tile) =>
    isSameTile(tile, { type: startTile.type, value: startTile.value + 1 }, true)
  );
  if (!tile2) {
    return null;
  }

  const tile3 = tiles.find((tile) =>
    isSameTile(tile, { type: startTile.type, value: startTile.value + 2 }, true)
  );
  if (!tile3) {
    return null;
  }

  return [tile1, tile2, tile3];
}

/**
 * 牌配列から全ての対子候補を抽出する
 * @param tiles 牌配列
 * @returns 対子となりうる牌のリスト（重複なし）
 */
export function findAllToitsuCandidates(tiles: Tile[]): Tile[] {
  // 牌をグループ化してカウント
  const tileGroups: Map<string, { tile: Tile; count: number }> = new Map();

  for (const tile of tiles) {
    // 赤ドラを無視したキーを作成（type+valueで識別）
    const key = `${tile.type}-${tile.value}`;
    const group = tileGroups.get(key);

    if (group) {
      group.count++;
    } else {
      tileGroups.set(key, { tile, count: 1 });
    }
  }

  // 2枚以上ある牌を抽出
  const candidates: Tile[] = [];
  for (const group of tileGroups.values()) {
    if (group.count >= 2) {
      candidates.push(group.tile);
    }
  }

  return candidates;
}
