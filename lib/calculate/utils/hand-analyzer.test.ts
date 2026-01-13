import { Tile } from "@/lib/types/mahjong";
import { analyzeHand, HandPattern, Meld } from "./hand-analyzer";

describe("hand-analyzer", () => {
  describe("analyzeHand", () => {
    describe("標準形（4面子1雀頭）", () => {
      test("単一パターン: 123m 456p 567s 789s 東東 + 5s", () => {
        // 手牌: 123m 456p 67s 789s 東東 + 5s（和了牌）
        const tiles: Tile[] = [
          { type: "m", value: 1 },
          { type: "m", value: 2 },
          { type: "m", value: 3 },
          { type: "p", value: 4 },
          { type: "p", value: 5 },
          { type: "p", value: 6 },
          { type: "s", value: 5 }, // 和了牌
          { type: "s", value: 6 },
          { type: "s", value: 7 },
          { type: "s", value: 7 },
          { type: "s", value: 8 },
          { type: "s", value: 9 },
          { type: "j", value: 1 }, // 東
          { type: "j", value: 1 }, // 東
        ];

        const winTile: Tile = { type: "s", value: 5 };
        const result = analyzeHand(tiles, winTile);

        // 期待される結果を定義
        const expected: HandPattern[] = [
          {
            melds: [
              {
                pattern: "shuntsu",
                tiles: [
                  { type: "m", value: 1 },
                  { type: "m", value: 2 },
                  { type: "m", value: 3 },
                ],
              },
              {
                pattern: "shuntsu",
                tiles: [
                  { type: "p", value: 4 },
                  { type: "p", value: 5 },
                  { type: "p", value: 6 },
                ],
              },
              {
                pattern: "shuntsu",
                tiles: [
                  { type: "s", value: 5 },
                  { type: "s", value: 6 },
                  { type: "s", value: 7 },
                ],
              },
              {
                pattern: "shuntsu",
                tiles: [
                  { type: "s", value: 7 },
                  { type: "s", value: 8 },
                  { type: "s", value: 9 },
                ],
              },
              {
                pattern: "toitsu",
                tiles: [
                  { type: "j", value: 1 },
                  { type: "j", value: 1 },
                ],
              },
            ],
          },
        ];

        // ディープイコールで検証
        expect(result).toEqual(expected);
      });

      test("複数パターン: 112233m 456p 789s + 1m", () => {
        // 手牌: 112233m 456p 789s + 1m（和了牌）
        // パターン1: 11m(雀頭) + 123m + 123m + 456p + 789s
        // パターン2: 123m + 123m + 33m(雀頭) + 456p + 789s
        const tiles: Tile[] = [
          { type: "m", value: 1 }, // 和了牌
          { type: "m", value: 1 },
          { type: "m", value: 1 },
          { type: "m", value: 2 },
          { type: "m", value: 2 },
          { type: "m", value: 3 },
          { type: "m", value: 3 },
          { type: "p", value: 4 },
          { type: "p", value: 5 },
          { type: "p", value: 6 },
          { type: "s", value: 7 },
          { type: "s", value: 8 },
          { type: "s", value: 9 },
        ];

        const winTile: Tile = { type: "m", value: 1 };
        const result = analyzeHand(tiles, winTile);

        // 期待される結果を定義（2通りのパターン）
        const expected: HandPattern[] = [
          {
            // パターン1: 11m(雀頭) + 123m + 123m + 456p + 789s
            melds: [
              {
                pattern: "toitsu",
                tiles: [
                  { type: "m", value: 1 },
                  { type: "m", value: 1 },
                ],
              },
              {
                pattern: "shuntsu",
                tiles: [
                  { type: "m", value: 1 },
                  { type: "m", value: 2 },
                  { type: "m", value: 3 },
                ],
              },
              {
                pattern: "shuntsu",
                tiles: [
                  { type: "m", value: 2 },
                  { type: "m", value: 3 },
                  { type: "m", value: 3 },
                ],
              },
              {
                pattern: "shuntsu",
                tiles: [
                  { type: "p", value: 4 },
                  { type: "p", value: 5 },
                  { type: "p", value: 6 },
                ],
              },
              {
                pattern: "shuntsu",
                tiles: [
                  { type: "s", value: 7 },
                  { type: "s", value: 8 },
                  { type: "s", value: 9 },
                ],
              },
            ],
          },
          {
            // パターン2: 123m + 123m + 33m(雀頭) + 456p + 789s
            melds: [
              {
                pattern: "shuntsu",
                tiles: [
                  { type: "m", value: 1 },
                  { type: "m", value: 2 },
                  { type: "m", value: 3 },
                ],
              },
              {
                pattern: "shuntsu",
                tiles: [
                  { type: "m", value: 1 },
                  { type: "m", value: 2 },
                  { type: "m", value: 3 },
                ],
              },
              {
                pattern: "toitsu",
                tiles: [
                  { type: "m", value: 3 },
                  { type: "m", value: 3 },
                ],
              },
              {
                pattern: "shuntsu",
                tiles: [
                  { type: "p", value: 4 },
                  { type: "p", value: 5 },
                  { type: "p", value: 6 },
                ],
              },
              {
                pattern: "shuntsu",
                tiles: [
                  { type: "s", value: 7 },
                  { type: "s", value: 8 },
                  { type: "s", value: 9 },
                ],
              },
            ],
          },
        ];

        // ディープイコールで検証
        expect(result).toEqual(expected);
      });
    });

    describe("七対子", () => {
      test("七対子の判定", () => {
        // 手牌: 11m 22p 33s 44m 55p 66s + 77m（和了牌）
        const tiles: Tile[] = [
          { type: "m", value: 1 },
          { type: "m", value: 1 },
          { type: "p", value: 2 },
          { type: "p", value: 2 },
          { type: "s", value: 3 },
          { type: "s", value: 3 },
          { type: "m", value: 4 },
          { type: "m", value: 4 },
          { type: "p", value: 5 },
          { type: "p", value: 5 },
          { type: "s", value: 6 },
          { type: "s", value: 6 },
          { type: "m", value: 7 }, // 和了牌
          { type: "m", value: 7 },
        ];

        const winTile: Tile = { type: "m", value: 7 };
        const result = analyzeHand(tiles, winTile);

        // 少なくとも1つのパターンが存在
        expect(result.length).toBeGreaterThanOrEqual(1);

        // 七対子パターンを探す
        const chiitoitsuPattern = result.find((p) => {
          const toitsu = p.melds.filter((m) => m.pattern === "toitsu");
          return toitsu.length === 7;
        });

        expect(chiitoitsuPattern).toBeDefined();
        expect(chiitoitsuPattern!.melds).toHaveLength(7);

        // 全て対子
        chiitoitsuPattern!.melds.forEach((meld) => {
          expect(meld.pattern).toBe("toitsu");
          expect(meld.tiles).toHaveLength(2);
        });
      });
    });

    describe("国士無双", () => {
      test("国士無双の判定", () => {
        // 手牌: 19m 19p 19s 東南西北白發中 + 1m（和了牌）
        const tiles: Tile[] = [
          { type: "m", value: 1 }, // 和了牌
          { type: "m", value: 1 },
          { type: "m", value: 9 },
          { type: "p", value: 1 },
          { type: "p", value: 9 },
          { type: "s", value: 1 },
          { type: "s", value: 9 },
          { type: "j", value: 1 }, // 東
          { type: "j", value: 2 }, // 南
          { type: "j", value: 3 }, // 西
          { type: "j", value: 4 }, // 北
          { type: "j", value: 5 }, // 白
          { type: "j", value: 6 }, // 發
          { type: "j", value: 7 }, // 中
        ];

        const winTile: Tile = { type: "m", value: 1 };
        const result = analyzeHand(tiles, winTile);

        // 少なくとも1つのパターンが存在
        expect(result.length).toBeGreaterThanOrEqual(1);

        // 国士無双パターンを探す
        const kokushiPattern = result.find((p) => p.isKokushi);

        expect(kokushiPattern).toBeDefined();
        expect(kokushiPattern!.isKokushi).toBe(true);

        // 国士無双は特殊形なので、meldsの構造は自由に定義できる
        // ここでは13種の么九牌+1つの対子として表現されることを期待
        expect(kokushiPattern!.melds.length).toBeGreaterThan(0);
      });
    });

    describe("エラーケース", () => {
      test("不正な手牌: 枚数が14枚でない", () => {
        const tiles: Tile[] = [
          { type: "m", value: 1 },
          { type: "m", value: 2 },
          { type: "m", value: 3 },
        ];

        const winTile: Tile = { type: "m", value: 1 };

        expect(() => analyzeHand(tiles, winTile)).toThrow(
          "手牌は14枚である必要があります"
        );
      });

      test("不正な手牌: 和了形でない", () => {
        // バラバラの手牌（面子が作れない）
        const tiles: Tile[] = [
          { type: "m", value: 1 },
          { type: "m", value: 3 },
          { type: "m", value: 5 },
          { type: "p", value: 2 },
          { type: "p", value: 4 },
          { type: "p", value: 6 },
          { type: "s", value: 1 },
          { type: "s", value: 3 },
          { type: "s", value: 5 },
          { type: "j", value: 1 },
          { type: "j", value: 2 },
          { type: "j", value: 3 },
          { type: "j", value: 4 },
          { type: "j", value: 5 },
        ];

        const winTile: Tile = { type: "m", value: 1 };
        const result = analyzeHand(tiles, winTile);

        // 和了形でない場合は空配列を返す
        expect(result).toEqual([]);
      });

      test("不正な手牌: 同じ牌が5枚以上", () => {
        // 同じ牌が5枚（物理的に不可能）
        const tiles: Tile[] = [
          { type: "m", value: 1 },
          { type: "m", value: 1 },
          { type: "m", value: 1 },
          { type: "m", value: 1 },
          { type: "m", value: 1 },
          { type: "m", value: 2 },
          { type: "m", value: 3 },
          { type: "p", value: 4 },
          { type: "p", value: 5 },
          { type: "p", value: 6 },
          { type: "s", value: 7 },
          { type: "s", value: 8 },
          { type: "s", value: 9 },
          { type: "j", value: 1 },
        ];

        const winTile: Tile = { type: "m", value: 1 };

        expect(() => analyzeHand(tiles, winTile)).toThrow(
          "同じ牌が5枚以上存在します"
        );
      });
    });
  });
});
