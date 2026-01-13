import { PlayerInfo } from "@/lib/types/problem";
import Tile from "./Tile";
import { Tile as TileType } from "@/lib/types/mahjong";

interface SeatWindIndicatorProps {
  players: {
    self: PlayerInfo;
    right: PlayerInfo;
    opposite: PlayerInfo;
    left: PlayerInfo;
  };
  isRiichi?: boolean;
}

type Position = "self" | "right" | "opposite" | "left";

export default function SeatWindIndicator({ players, isRiichi = false }: SeatWindIndicatorProps) {
  // 親の位置を特定
  const dealerPosition: Position = players.self.isDealer
    ? "self"
    : players.right.isDealer
    ? "right"
    : players.opposite.isDealer
    ? "opposite"
    : "left";

  // 各位置の場風を計算
  const winds: Record<Position, TileType> = {
    self: { type: "j", value: 1 }, // デフォルト値
    right: { type: "j", value: 1 },
    opposite: { type: "j", value: 1 },
    left: { type: "j", value: 1 },
  };

  // 親の位置から各プレイヤーの場風を割り当て
  // 東(1) → 南(2) → 西(3) → 北(4)
  // 順番: self → right → opposite → left
  if (dealerPosition === "self") {
    winds.self = { type: "j", value: 1 }; // 東
    winds.right = { type: "j", value: 2 }; // 南
    winds.opposite = { type: "j", value: 3 }; // 西
    winds.left = { type: "j", value: 4 }; // 北
  } else if (dealerPosition === "right") {
    winds.right = { type: "j", value: 1 }; // 東
    winds.opposite = { type: "j", value: 2 }; // 南
    winds.left = { type: "j", value: 3 }; // 西
    winds.self = { type: "j", value: 4 }; // 北
  } else if (dealerPosition === "opposite") {
    winds.opposite = { type: "j", value: 1 }; // 東
    winds.left = { type: "j", value: 2 }; // 南
    winds.self = { type: "j", value: 3 }; // 西
    winds.right = { type: "j", value: 4 }; // 北
  } else {
    // left
    winds.left = { type: "j", value: 1 }; // 東
    winds.self = { type: "j", value: 2 }; // 南
    winds.right = { type: "j", value: 3 }; // 西
    winds.opposite = { type: "j", value: 4 }; // 北
  }

  return (
    <div className="relative w-[40vh] h-[40vh] max-w-64 max-h-64 min-w-[150px] min-h-[150px]">
      {/* 上（対面） */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2">
        <div
          className={`p-1 md:p-2 rounded ${
            players.opposite.isDealer ? "bg-red-600" : "bg-gray-700"
          }`}
        >
          <Tile tile={winds.opposite} size="sm" />
        </div>
      </div>

      {/* 右（右家） */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2">
        <div
          className={`p-1 md:p-2 rounded ${
            players.right.isDealer ? "bg-red-600" : "bg-gray-700"
          }`}
        >
          <Tile tile={winds.right} size="sm" />
        </div>
      </div>

      {/* 下（自分） */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-1">
          <div
            className={`p-1 md:p-2 rounded ${
              players.self.isDealer ? "bg-red-600" : "bg-gray-700"
            }`}
          >
            <Tile tile={winds.self} size="sm" />
          </div>
          {isRiichi && (
            <span className="inline-block bg-red-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">
              リーチ
            </span>
          )}
        </div>
      </div>

      {/* 左（左家） */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2">
        <div
          className={`p-1 md:p-2 rounded ${
            players.left.isDealer ? "bg-red-600" : "bg-gray-700"
          }`}
        >
          <Tile tile={winds.left} size="sm" />
        </div>
      </div>
    </div>
  );
}
