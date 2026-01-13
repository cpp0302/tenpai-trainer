import { Tile } from "@/lib/types/mahjong";
import {
  detectShuntsu,
  detectKoutsu,
  detectToitsu,
  findAllToitsuCandidates,
  removeTile,
  removeTiles,
} from "./meld-detector";

describe("meld-detector", () => {
  describe("removeTile", () => {
    test("基本的な削除", () => {
      const tiles: Tile[] = [
        { type: "m", value: 1 },
        { type: "m", value: 2 },
        { type: "m", value: 3 },
      ];
      const result = removeTile(tiles, { type: "m", value: 2 });
      expect(result).toEqual([
        { type: "m", value: 1 },
        { type: "m", value: 3 },
      ]);
    });

    test("同一牌が複数ある場合は最初の1枚のみ削除", () => {
      const tiles: Tile[] = [
        { type: "p", value: 5 },
        { type: "p", value: 5 },
        { type: "p", value: 5 },
      ];
      const result = removeTile(tiles, { type: "p", value: 5 });
      expect(result).toEqual([
        { type: "p", value: 5 },
        { type: "p", value: 5 },
      ]);
    });

    test("存在しない牌を削除（元の配列をそのまま返す）", () => {
      const tiles: Tile[] = [
        { type: "m", value: 1 },
        { type: "m", value: 2 },
      ];
      const result = removeTile(tiles, { type: "m", value: 3 });
      expect(result).toEqual(tiles);
    });

    test("空配列から削除", () => {
      const tiles: Tile[] = [];
      const result = removeTile(tiles, { type: "m", value: 1 });
      expect(result).toEqual([]);
    });

    test("元の配列を変更しない", () => {
      const tiles: Tile[] = [
        { type: "m", value: 1 },
        { type: "m", value: 2 },
      ];
      const original = [...tiles];
      removeTile(tiles, { type: "m", value: 1 });
      expect(tiles).toEqual(original);
    });

    test("赤ドラを削除", () => {
      const tiles: Tile[] = [
        { type: "m", value: 5 },
        { type: "m", value: 5, isRed: true },
        { type: "m", value: 6 },
      ];
      const result = removeTile(tiles, { type: "m", value: 5, isRed: true });
      expect(result).toEqual([
        { type: "m", value: 5 },
        { type: "m", value: 6 },
      ]);
    });
  });

  describe("removeTiles", () => {
    test("複数牌の削除", () => {
      const tiles: Tile[] = [
        { type: "m", value: 1 },
        { type: "m", value: 2 },
        { type: "m", value: 3 },
        { type: "m", value: 4 },
      ];
      const toRemove: Tile[] = [
        { type: "m", value: 1 },
        { type: "m", value: 3 },
      ];
      const result = removeTiles(tiles, toRemove);
      expect(result).toEqual([
        { type: "m", value: 2 },
        { type: "m", value: 4 },
      ]);
    });

    test("順子を削除", () => {
      const tiles: Tile[] = [
        { type: "m", value: 1 },
        { type: "m", value: 2 },
        { type: "m", value: 3 },
        { type: "m", value: 5 },
      ];
      const toRemove: Tile[] = [
        { type: "m", value: 1 },
        { type: "m", value: 2 },
        { type: "m", value: 3 },
      ];
      const result = removeTiles(tiles, toRemove);
      expect(result).toEqual([{ type: "m", value: 5 }]);
    });

    test("空配列を削除（元の配列をそのまま返す）", () => {
      const tiles: Tile[] = [
        { type: "m", value: 1 },
        { type: "m", value: 2 },
      ];
      const result = removeTiles(tiles, []);
      expect(result).toEqual(tiles);
    });

    test("重複する牌を削除", () => {
      const tiles: Tile[] = [
        { type: "p", value: 5 },
        { type: "p", value: 5 },
        { type: "p", value: 5 },
      ];
      const toRemove: Tile[] = [
        { type: "p", value: 5 },
        { type: "p", value: 5 },
      ];
      const result = removeTiles(tiles, toRemove);
      expect(result).toEqual([{ type: "p", value: 5 }]);
    });

    test("元の配列を変更しない", () => {
      const tiles: Tile[] = [
        { type: "m", value: 1 },
        { type: "m", value: 2 },
      ];
      const original = [...tiles];
      removeTiles(tiles, [{ type: "m", value: 1 }]);
      expect(tiles).toEqual(original);
    });
  });

  describe("detectToitsu", () => {
    describe("正常系", () => {
      test("基本的な対子検出", () => {
        const tiles: Tile[] = [
          { type: "s", value: 7 },
          { type: "s", value: 7 },
        ];
        const result = detectToitsu(tiles, { type: "s", value: 7 });
        expect(result).toHaveLength(2);
        expect(result).toEqual([
          { type: "s", value: 7 },
          { type: "s", value: 7 },
        ]);
      });

      test("他の牌が混在", () => {
        const tiles: Tile[] = [
          { type: "m", value: 1 },
          { type: "s", value: 7 },
          { type: "s", value: 7 },
          { type: "m", value: 9 },
        ];
        const result = detectToitsu(tiles, { type: "s", value: 7 });
        expect(result).toHaveLength(2);
      });

      test("字牌の対子", () => {
        const tiles: Tile[] = [
          { type: "j", value: 6 },
          { type: "j", value: 6 },
        ];
        const result = detectToitsu(tiles, { type: "j", value: 6 });
        expect(result).toHaveLength(2);
      });
    });

    describe("エッジケース", () => {
      test("3枚ある場合（2枚を返す）", () => {
        const tiles: Tile[] = [
          { type: "p", value: 5 },
          { type: "p", value: 5 },
          { type: "p", value: 5 },
        ];
        const result = detectToitsu(tiles, { type: "p", value: 5 });
        expect(result).toHaveLength(2);
      });

      test("4枚ある場合（2枚を返す）", () => {
        const tiles: Tile[] = [
          { type: "p", value: 5 },
          { type: "p", value: 5 },
          { type: "p", value: 5 },
          { type: "p", value: 5 },
        ];
        const result = detectToitsu(tiles, { type: "p", value: 5 });
        expect(result).toHaveLength(2);
      });

      test("赤ドラと通常5（ignoreRedで2枚として扱う）", () => {
        const tiles: Tile[] = [
          { type: "m", value: 5 },
          { type: "m", value: 5, isRed: true },
        ];
        const result = detectToitsu(tiles, { type: "m", value: 5 });
        expect(result).toHaveLength(2);
      });
    });

    describe("異常系", () => {
      test("1枚しかない（nullを返す）", () => {
        const tiles: Tile[] = [{ type: "m", value: 1 }];
        const result = detectToitsu(tiles, { type: "m", value: 1 });
        expect(result).toBeNull();
      });

      test("0枚（nullを返す）", () => {
        const tiles: Tile[] = [{ type: "m", value: 1 }];
        const result = detectToitsu(tiles, { type: "m", value: 2 });
        expect(result).toBeNull();
      });

      test("空配列（nullを返す）", () => {
        const tiles: Tile[] = [];
        const result = detectToitsu(tiles, { type: "m", value: 1 });
        expect(result).toBeNull();
      });
    });
  });

  describe("detectKoutsu", () => {
    describe("正常系", () => {
      test("基本的な刻子検出", () => {
        const tiles: Tile[] = [
          { type: "p", value: 5 },
          { type: "p", value: 5 },
          { type: "p", value: 5 },
        ];
        const result = detectKoutsu(tiles, { type: "p", value: 5 });
        expect(result).toHaveLength(3);
      });

      test("他の牌が混在", () => {
        const tiles: Tile[] = [
          { type: "m", value: 1 },
          { type: "p", value: 5 },
          { type: "p", value: 5 },
          { type: "p", value: 5 },
          { type: "s", value: 9 },
        ];
        const result = detectKoutsu(tiles, { type: "p", value: 5 });
        expect(result).toHaveLength(3);
      });

      test("字牌の刻子", () => {
        const tiles: Tile[] = [
          { type: "j", value: 1 },
          { type: "j", value: 1 },
          { type: "j", value: 1 },
        ];
        const result = detectKoutsu(tiles, { type: "j", value: 1 });
        expect(result).toHaveLength(3);
      });
    });

    describe("エッジケース", () => {
      test("4枚ある場合（3枚を返す）", () => {
        const tiles: Tile[] = [
          { type: "m", value: 3 },
          { type: "m", value: 3 },
          { type: "m", value: 3 },
          { type: "m", value: 3 },
        ];
        const result = detectKoutsu(tiles, { type: "m", value: 3 });
        expect(result).toHaveLength(3);
      });

      test("ちょうど3枚", () => {
        const tiles: Tile[] = [
          { type: "s", value: 8 },
          { type: "s", value: 8 },
          { type: "s", value: 8 },
        ];
        const result = detectKoutsu(tiles, { type: "s", value: 8 });
        expect(result).toHaveLength(3);
      });

      test("赤ドラと通常5の混在（ignoreRedで3枚として扱う）", () => {
        const tiles: Tile[] = [
          { type: "m", value: 5 },
          { type: "m", value: 5 },
          { type: "m", value: 5, isRed: true },
        ];
        const result = detectKoutsu(tiles, { type: "m", value: 5 });
        expect(result).toHaveLength(3);
      });
    });

    describe("異常系", () => {
      test("2枚しかない（nullを返す）", () => {
        const tiles: Tile[] = [
          { type: "m", value: 1 },
          { type: "m", value: 1 },
        ];
        const result = detectKoutsu(tiles, { type: "m", value: 1 });
        expect(result).toBeNull();
      });

      test("1枚しかない（nullを返す）", () => {
        const tiles: Tile[] = [{ type: "m", value: 1 }];
        const result = detectKoutsu(tiles, { type: "m", value: 1 });
        expect(result).toBeNull();
      });

      test("0枚（nullを返す）", () => {
        const tiles: Tile[] = [{ type: "m", value: 1 }];
        const result = detectKoutsu(tiles, { type: "m", value: 2 });
        expect(result).toBeNull();
      });

      test("空配列（nullを返す）", () => {
        const tiles: Tile[] = [];
        const result = detectKoutsu(tiles, { type: "m", value: 1 });
        expect(result).toBeNull();
      });
    });
  });

  describe("detectShuntsu", () => {
    describe("正常系", () => {
      test("基本的な順子検出（1-2-3萬）", () => {
        const tiles: Tile[] = [
          { type: "m", value: 1 },
          { type: "m", value: 2 },
          { type: "m", value: 3 },
        ];
        const result = detectShuntsu(tiles, { type: "m", value: 1 });
        expect(result).toHaveLength(3);
        expect(result).toEqual([
          { type: "m", value: 1 },
          { type: "m", value: 2 },
          { type: "m", value: 3 },
        ]);
      });

      test("他の牌が混在する中での検出", () => {
        const tiles: Tile[] = [
          { type: "m", value: 1 },
          { type: "m", value: 2 },
          { type: "m", value: 3 },
          { type: "m", value: 5 },
          { type: "m", value: 6 },
        ];
        const result = detectShuntsu(tiles, { type: "m", value: 1 });
        expect(result).toHaveLength(3);
      });

      test("筒子での検出", () => {
        const tiles: Tile[] = [
          { type: "p", value: 4 },
          { type: "p", value: 5 },
          { type: "p", value: 6 },
        ];
        const result = detectShuntsu(tiles, { type: "p", value: 4 });
        expect(result).toHaveLength(3);
      });

      test("索子での検出", () => {
        const tiles: Tile[] = [
          { type: "s", value: 2 },
          { type: "s", value: 3 },
          { type: "s", value: 4 },
        ];
        const result = detectShuntsu(tiles, { type: "s", value: 2 });
        expect(result).toHaveLength(3);
      });

      test("中間の順子（3-4-5）", () => {
        const tiles: Tile[] = [
          { type: "m", value: 3 },
          { type: "m", value: 4 },
          { type: "m", value: 5 },
        ];
        const result = detectShuntsu(tiles, { type: "m", value: 3 });
        expect(result).toHaveLength(3);
      });
    });

    describe("エッジケース", () => {
      test("7-8-9の順子", () => {
        const tiles: Tile[] = [
          { type: "m", value: 7 },
          { type: "m", value: 8 },
          { type: "m", value: 9 },
        ];
        const result = detectShuntsu(tiles, { type: "m", value: 7 });
        expect(result).toHaveLength(3);
      });

      test("8から始まる場合（nullを返す）", () => {
        const tiles: Tile[] = [
          { type: "m", value: 8 },
          { type: "m", value: 9 },
        ];
        const result = detectShuntsu(tiles, { type: "m", value: 8 });
        expect(result).toBeNull();
      });

      test("9から始まる場合（nullを返す）", () => {
        const tiles: Tile[] = [{ type: "m", value: 9 }];
        const result = detectShuntsu(tiles, { type: "m", value: 9 });
        expect(result).toBeNull();
      });

      test("赤ドラを含む順子", () => {
        const tiles: Tile[] = [
          { type: "m", value: 4 },
          { type: "m", value: 5, isRed: true },
          { type: "m", value: 6 },
        ];
        const result = detectShuntsu(tiles, { type: "m", value: 4 });
        expect(result).toHaveLength(3);
      });
    });

    describe("異常系", () => {
      test("字牌から始まる場合（nullを返す）", () => {
        const tiles: Tile[] = [
          { type: "j", value: 1 },
          { type: "j", value: 2 },
          { type: "j", value: 3 },
        ];
        const result = detectShuntsu(tiles, { type: "j", value: 1 });
        expect(result).toBeNull();
      });

      test("必要な牌が不足（1-3のみ）", () => {
        const tiles: Tile[] = [
          { type: "m", value: 1 },
          { type: "m", value: 3 },
        ];
        const result = detectShuntsu(tiles, { type: "m", value: 1 });
        expect(result).toBeNull();
      });

      test("空配列", () => {
        const tiles: Tile[] = [];
        const result = detectShuntsu(tiles, { type: "m", value: 1 });
        expect(result).toBeNull();
      });

      test("順子の途中が欠けている（1-2-4）", () => {
        const tiles: Tile[] = [
          { type: "m", value: 1 },
          { type: "m", value: 2 },
          { type: "m", value: 4 },
        ];
        const result = detectShuntsu(tiles, { type: "m", value: 1 });
        expect(result).toBeNull();
      });
    });
  });

  describe("findAllToitsuCandidates", () => {
    describe("正常系", () => {
      test("複数の対子候補", () => {
        const tiles: Tile[] = [
          { type: "m", value: 1 },
          { type: "m", value: 1 },
          { type: "p", value: 5 },
          { type: "p", value: 5 },
          { type: "s", value: 9 },
        ];
        const result = findAllToitsuCandidates(tiles);
        expect(result).toHaveLength(2);
        // 結果は1mと5pを含む（順序は問わない）
        expect(result).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ type: "m", value: 1 }),
            expect.objectContaining({ type: "p", value: 5 }),
          ])
        );
      });

      test("対子候補が1つ", () => {
        const tiles: Tile[] = [
          { type: "m", value: 3 },
          { type: "m", value: 3 },
          { type: "m", value: 4 },
          { type: "m", value: 5 },
          { type: "m", value: 6 },
        ];
        const result = findAllToitsuCandidates(tiles);
        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({ type: "m", value: 3 });
      });

      test("3枚以上ある牌も対子候補", () => {
        const tiles: Tile[] = [
          { type: "s", value: 7 },
          { type: "s", value: 7 },
          { type: "s", value: 7 },
        ];
        const result = findAllToitsuCandidates(tiles);
        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({ type: "s", value: 7 });
      });

      test("字牌を含む", () => {
        const tiles: Tile[] = [
          { type: "j", value: 1 },
          { type: "j", value: 1 },
          { type: "j", value: 2 },
          { type: "j", value: 2 },
        ];
        const result = findAllToitsuCandidates(tiles);
        expect(result).toHaveLength(2);
      });
    });

    describe("エッジケース", () => {
      test("対子候補が無い", () => {
        const tiles: Tile[] = [
          { type: "m", value: 1 },
          { type: "m", value: 2 },
          { type: "m", value: 3 },
          { type: "m", value: 4 },
          { type: "m", value: 5 },
        ];
        const result = findAllToitsuCandidates(tiles);
        expect(result).toEqual([]);
      });

      test("全て同一牌", () => {
        const tiles: Tile[] = [
          { type: "p", value: 5 },
          { type: "p", value: 5 },
          { type: "p", value: 5 },
          { type: "p", value: 5 },
        ];
        const result = findAllToitsuCandidates(tiles);
        expect(result).toHaveLength(1);
        expect(result[0]).toMatchObject({ type: "p", value: 5 });
      });

      test("赤ドラと通常5は同じ対子候補として扱う", () => {
        const tiles: Tile[] = [
          { type: "m", value: 5 },
          { type: "m", value: 5, isRed: true },
        ];
        const result = findAllToitsuCandidates(tiles);
        expect(result).toHaveLength(1);
        // 5mの対子候補が1つだけ
      });
    });

    describe("異常系", () => {
      test("空配列", () => {
        const tiles: Tile[] = [];
        const result = findAllToitsuCandidates(tiles);
        expect(result).toEqual([]);
      });

      test("1枚のみ", () => {
        const tiles: Tile[] = [{ type: "m", value: 1 }];
        const result = findAllToitsuCandidates(tiles);
        expect(result).toEqual([]);
      });
    });
  });
});
