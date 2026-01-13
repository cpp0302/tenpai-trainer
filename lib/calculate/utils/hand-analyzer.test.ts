import { Tile } from "@/lib/types/mahjong";
import { analyzeHand, HandPattern, Meld } from "./hand-analyzer";

describe("hand-analyzer", () => {
  describe("analyzeHand", () => {
    describe("標準形（4面子1雀頭）", () => {
      test.each([
        {
          description: "単一パターン: 123m 456p 67s 789s 東東 + 5s",
          tiles: [
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
          ] as Tile[],
          winTile: { type: "s", value: 5 } as Tile,
          expected: [
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
              waitType: "ryanmen",
            },
          ] as HandPattern[],
        },
        {
          description: "複数パターン: 1112233m 456p 789s + 1m",
          tiles: [
            { type: "m", value: 1 }, // 和了牌
            { type: "m", value: 1 },
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
          ] as Tile[],
          winTile: { type: "m", value: 1 } as Tile,
          expected: [
            {
              // 1m + 123m + 123m + 456p + 789s + 1m 単騎待ち
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
              waitType: "tanki",
            },
            {
              // 11m + 23m + 123m + 456p + 789s + 1m リャンメン待ち
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
              waitType: "ryanmen",
            },
          ] as HandPattern[],
        },
      ])("$description", ({ tiles, winTile, expected }) => {
        const result = analyzeHand(tiles, winTile);
        expect(result).toEqual(expected);
      });
    });

    describe("七対子", () => {
      test.each([
        {
          description: "七対子: 114477m 2255p 3366s + 7m",
          tiles: [
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
          ] as Tile[],
          winTile: { type: "m", value: 7 } as Tile,
          expected: [
            {
              melds: [
                {
                  pattern: "toitsu",
                  tiles: [
                    { type: "m", value: 1 },
                    { type: "m", value: 1 },
                  ],
                },
                {
                  pattern: "toitsu",
                  tiles: [
                    { type: "p", value: 2 },
                    { type: "p", value: 2 },
                  ],
                },
                {
                  pattern: "toitsu",
                  tiles: [
                    { type: "s", value: 3 },
                    { type: "s", value: 3 },
                  ],
                },
                {
                  pattern: "toitsu",
                  tiles: [
                    { type: "m", value: 4 },
                    { type: "m", value: 4 },
                  ],
                },
                {
                  pattern: "toitsu",
                  tiles: [
                    { type: "p", value: 5 },
                    { type: "p", value: 5 },
                  ],
                },
                {
                  pattern: "toitsu",
                  tiles: [
                    { type: "s", value: 6 },
                    { type: "s", value: 6 },
                  ],
                },
                {
                  pattern: "toitsu",
                  tiles: [
                    { type: "m", value: 7 },
                    { type: "m", value: 7 },
                  ],
                },
              ],
              waitType: "tanki",
              isChiitoitsu: true,
            },
          ] as HandPattern[],
        },
      ])("$description", ({ tiles, winTile, expected }) => {
        const result = analyzeHand(tiles, winTile);
        expect(result).toEqual(expected);
      });
    });

    describe("国士無双", () => {
      test.each([
        {
          description: "国士無双: 19m 19p 19s 東南西北白發中 + 1m",
          tiles: [
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
          ] as Tile[],
          winTile: { type: "m", value: 1 } as Tile,
          expected: [
            {
              melds: [],
              waitType: "tanki",
              isKokushi: true,
            },
          ] as HandPattern[],
        },
      ])("$description", ({ tiles, winTile, expected }) => {
        const result = analyzeHand(tiles, winTile);
        expect(result).toEqual(expected);
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
