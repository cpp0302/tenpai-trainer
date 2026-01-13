import { Tile } from "@/lib/types/mahjong";
import { stringToTile } from "@/lib/utils/tile-helper";
import { compareTiles, isSameTile, sortTiles, sortTilesCopy } from "./tile-comparator";

describe("tile-comparator", () => {
  describe("compareTiles", () => {
    describe("異なるtype間の比較", () => {
      test("萬子 < 筒子", () => {
        const tile1: Tile = { type: "m", value: 5 };
        const tile2: Tile = { type: "p", value: 5 };
        expect(compareTiles(tile1, tile2)).toBeLessThan(0);
      });

      test("筒子 < 索子", () => {
        const tile1: Tile = { type: "p", value: 5 };
        const tile2: Tile = { type: "s", value: 5 };
        expect(compareTiles(tile1, tile2)).toBeLessThan(0);
      });

      test("索子 < 字牌", () => {
        const tile1: Tile = { type: "s", value: 5 };
        const tile2: Tile = { type: "z", value: 1 };
        expect(compareTiles(tile1, tile2)).toBeLessThan(0);
      });
    });

    describe("同type内の異なるvalue", () => {
      test("1萬 < 2萬", () => {
        const tile1: Tile = { type: "m", value: 1 };
        const tile2: Tile = { type: "m", value: 2 };
        expect(compareTiles(tile1, tile2)).toBeLessThan(0);
      });

      test("8筒 < 9筒", () => {
        const tile1: Tile = { type: "p", value: 8 };
        const tile2: Tile = { type: "p", value: 9 };
        expect(compareTiles(tile1, tile2)).toBeLessThan(0);
      });

      test("東 < 南", () => {
        const tile1: Tile = { type: "z", value: 1 };
        const tile2: Tile = { type: "z", value: 2 };
        expect(compareTiles(tile1, tile2)).toBeLessThan(0);
      });
    });

    describe("赤ドラの扱い", () => {
      test("通常5萬 < 赤5萬", () => {
        const tile1: Tile = { type: "m", value: 5 };
        const tile2: Tile = { type: "m", value: 5, isRed: true };
        expect(compareTiles(tile1, tile2)).toBeLessThan(0);
      });

      test("通常5筒 < 赤5筒", () => {
        const tile1: Tile = { type: "p", value: 5 };
        const tile2: Tile = { type: "p", value: 5, isRed: true };
        expect(compareTiles(tile1, tile2)).toBeLessThan(0);
      });
    });

    describe("完全に同一の牌", () => {
      test("1萬 === 1萬", () => {
        const tile1: Tile = { type: "m", value: 1 };
        const tile2: Tile = { type: "m", value: 1 };
        expect(compareTiles(tile1, tile2)).toBe(0);
      });

      test("赤5萬 === 赤5萬", () => {
        const tile1: Tile = { type: "m", value: 5, isRed: true };
        const tile2: Tile = { type: "m", value: 5, isRed: true };
        expect(compareTiles(tile1, tile2)).toBe(0);
      });

      test("中 === 中", () => {
        const tile1: Tile = { type: "z", value: 7 };
        const tile2: Tile = { type: "z", value: 7 };
        expect(compareTiles(tile1, tile2)).toBe(0);
      });
    });

    describe("境界値", () => {
      test("1萬 < 9萬", () => {
        const tile1: Tile = { type: "m", value: 1 };
        const tile2: Tile = { type: "m", value: 9 };
        expect(compareTiles(tile1, tile2)).toBeLessThan(0);
      });

      test("東 < 中", () => {
        const tile1: Tile = { type: "z", value: 1 };
        const tile2: Tile = { type: "z", value: 7 };
        expect(compareTiles(tile1, tile2)).toBeLessThan(0);
      });
    });
  });

  describe("isSameTile", () => {
    describe("完全に同一の牌", () => {
      test("1萬 === 1萬", () => {
        const tile1: Tile = { type: "m", value: 1 };
        const tile2: Tile = { type: "m", value: 1 };
        expect(isSameTile(tile1, tile2)).toBe(true);
      });

      test("赤5萬 === 赤5萬", () => {
        const tile1: Tile = { type: "m", value: 5, isRed: true };
        const tile2: Tile = { type: "m", value: 5, isRed: true };
        expect(isSameTile(tile1, tile2)).toBe(true);
      });
    });

    describe("type異なる", () => {
      test("1萬 !== 1筒", () => {
        const tile1: Tile = { type: "m", value: 1 };
        const tile2: Tile = { type: "p", value: 1 };
        expect(isSameTile(tile1, tile2)).toBe(false);
      });
    });

    describe("value異なる", () => {
      test("1萬 !== 2萬", () => {
        const tile1: Tile = { type: "m", value: 1 };
        const tile2: Tile = { type: "m", value: 2 };
        expect(isSameTile(tile1, tile2)).toBe(false);
      });
    });

    describe("赤ドラの有無が異なる", () => {
      test("5萬 !== 赤5萬 (ignoreRed=false)", () => {
        const tile1: Tile = { type: "m", value: 5 };
        const tile2: Tile = { type: "m", value: 5, isRed: true };
        expect(isSameTile(tile1, tile2)).toBe(false);
      });

      test("5筒 !== 赤5筒 (ignoreRed=false)", () => {
        const tile1: Tile = { type: "p", value: 5 };
        const tile2: Tile = { type: "p", value: 5, isRed: true };
        expect(isSameTile(tile1, tile2)).toBe(false);
      });
    });

    describe("ignoreRed=trueで赤ドラの差を無視", () => {
      test("5萬 === 赤5萬 (ignoreRed=true)", () => {
        const tile1: Tile = { type: "m", value: 5 };
        const tile2: Tile = { type: "m", value: 5, isRed: true };
        expect(isSameTile(tile1, tile2, true)).toBe(true);
      });

      test("赤5筒 === 5筒 (ignoreRed=true)", () => {
        const tile1: Tile = { type: "p", value: 5, isRed: true };
        const tile2: Tile = { type: "p", value: 5 };
        expect(isSameTile(tile1, tile2, true)).toBe(true);
      });
    });

    describe("字牌での判定", () => {
      test("東 === 東", () => {
        const tile1: Tile = { type: "z", value: 1 };
        const tile2: Tile = { type: "z", value: 1 };
        expect(isSameTile(tile1, tile2)).toBe(true);
      });

      test("白 !== 發", () => {
        const tile1: Tile = { type: "z", value: 5 };
        const tile2: Tile = { type: "z", value: 6 };
        expect(isSameTile(tile1, tile2)).toBe(false);
      });
    });
  });

  describe("sortTiles", () => {
    describe("正常系", () => {
      test("バラバラの牌をソート", () => {
        const tiles: Tile[] = [
          { type: "z", value: 1 },
          { type: "m", value: 3 },
          { type: "p", value: 5 },
          { type: "s", value: 2 },
          { type: "m", value: 1 },
        ];
        sortTiles(tiles);
        expect(tiles).toEqual([
          { type: "m", value: 1 },
          { type: "m", value: 3 },
          { type: "p", value: 5 },
          { type: "s", value: 2 },
          { type: "z", value: 1 },
        ]);
      });

      test("既にソート済みの配列（変更なし）", () => {
        const tiles: Tile[] = [
          { type: "m", value: 1 },
          { type: "m", value: 2 },
          { type: "p", value: 3 },
        ];
        const expected = [...tiles];
        sortTiles(tiles);
        expect(tiles).toEqual(expected);
      });

      test("逆順の配列", () => {
        const tiles: Tile[] = [
          { type: "z", value: 7 },
          { type: "s", value: 9 },
          { type: "p", value: 5 },
          { type: "m", value: 1 },
        ];
        sortTiles(tiles);
        expect(tiles).toEqual([
          { type: "m", value: 1 },
          { type: "p", value: 5 },
          { type: "s", value: 9 },
          { type: "z", value: 7 },
        ]);
      });

      test("同一牌が複数ある配列", () => {
        const tiles: Tile[] = [
          { type: "m", value: 5 },
          { type: "m", value: 5 },
          { type: "m", value: 5 },
          { type: "p", value: 3 },
        ];
        sortTiles(tiles);
        expect(tiles).toEqual([
          { type: "m", value: 5 },
          { type: "m", value: 5 },
          { type: "m", value: 5 },
          { type: "p", value: 3 },
        ]);
      });

      test("赤ドラを含む配列（通常5mの後に赤5m）", () => {
        const tiles: Tile[] = [
          { type: "m", value: 5, isRed: true },
          { type: "m", value: 5 },
          { type: "m", value: 4 },
        ];
        sortTiles(tiles);
        expect(tiles).toEqual([
          { type: "m", value: 4 },
          { type: "m", value: 5 },
          { type: "m", value: 5, isRed: true },
        ]);
      });

      test("13枚の実戦的な手牌", () => {
        const tiles: Tile[] = [
          { type: "m", value: 3 },
          { type: "m", value: 4 },
          { type: "m", value: 5, isRed: true },
          { type: "p", value: 2 },
          { type: "p", value: 3 },
          { type: "p", value: 4 },
          { type: "s", value: 7 },
          { type: "s", value: 7 },
          { type: "z", value: 1 },
          { type: "z", value: 1 },
          { type: "z", value: 1 },
          { type: "z", value: 6 },
          { type: "z", value: 6 },
        ];
        const unsorted = [
          tiles[8], tiles[10], tiles[0], tiles[6], tiles[1],
          tiles[11], tiles[9], tiles[3], tiles[7], tiles[2],
          tiles[12], tiles[4], tiles[5],
        ];
        sortTiles(unsorted);
        expect(unsorted).toEqual(tiles);
      });
    });

    describe("エッジケース", () => {
      test("空配列", () => {
        const tiles: Tile[] = [];
        sortTiles(tiles);
        expect(tiles).toEqual([]);
      });

      test("1枚の牌", () => {
        const tiles: Tile[] = [{ type: "m", value: 5 }];
        sortTiles(tiles);
        expect(tiles).toEqual([{ type: "m", value: 5 }]);
      });

      test("全て同一の牌", () => {
        const tiles: Tile[] = [
          { type: "p", value: 7 },
          { type: "p", value: 7 },
          { type: "p", value: 7 },
          { type: "p", value: 7 },
        ];
        sortTiles(tiles);
        expect(tiles).toEqual([
          { type: "p", value: 7 },
          { type: "p", value: 7 },
          { type: "p", value: 7 },
          { type: "p", value: 7 },
        ]);
      });
    });
  });

  describe("sortTilesCopy", () => {
    test("元の配列を変更しない", () => {
      const tiles: Tile[] = [
        { type: "z", value: 1 },
        { type: "m", value: 1 },
        { type: "p", value: 1 },
      ];
      const original = [...tiles];
      const sorted = sortTilesCopy(tiles);

      // 元の配列は変更されていない
      expect(tiles).toEqual(original);

      // 新しい配列はソートされている
      expect(sorted).toEqual([
        { type: "m", value: 1 },
        { type: "p", value: 1 },
        { type: "z", value: 1 },
      ]);
    });

    test("空配列", () => {
      const tiles: Tile[] = [];
      const sorted = sortTilesCopy(tiles);
      expect(sorted).toEqual([]);
      expect(sorted).not.toBe(tiles); // 別のインスタンス
    });
  });
});
