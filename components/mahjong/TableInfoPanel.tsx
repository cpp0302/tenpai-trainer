import { PlayerInfo } from "@/lib/types/problem";

interface TableInfoPanelProps {
  players: {
    self: PlayerInfo;
    right: PlayerInfo;
    opposite: PlayerInfo;
    left: PlayerInfo;
  };
  roundWind: "east" | "south";
  roundNumber: number;
  honba: number;
  riichibou: number;
  isRiichi?: boolean;
}

type Position = "self" | "right" | "opposite" | "left";

// 風牌の文字（1=東, 2=南, 3=西, 4=北）
const windChars = ["", "東", "南", "西", "北"];

export default function TableInfoPanel({
  players,
  roundWind,
  roundNumber,
  honba,
  riichibou,
  isRiichi = false,
}: TableInfoPanelProps) {
  // 親の位置を特定
  const dealerPosition: Position = players.self.isDealer
    ? "self"
    : players.right.isDealer
    ? "right"
    : players.opposite.isDealer
    ? "opposite"
    : "left";

  // 各位置の場風を計算（1=東, 2=南, 3=西, 4=北）
  const winds: Record<Position, number> = {
    self: 1,
    right: 1,
    opposite: 1,
    left: 1,
  };

  // 親の位置から各プレイヤーの場風を割り当て
  if (dealerPosition === "self") {
    winds.self = 1; // 東
    winds.right = 2; // 南
    winds.opposite = 3; // 西
    winds.left = 4; // 北
  } else if (dealerPosition === "right") {
    winds.right = 1; // 東
    winds.opposite = 2; // 南
    winds.left = 3; // 西
    winds.self = 4; // 北
  } else if (dealerPosition === "opposite") {
    winds.opposite = 1; // 東
    winds.left = 2; // 南
    winds.self = 3; // 西
    winds.right = 4; // 北
  } else {
    // left
    winds.left = 1; // 東
    winds.self = 2; // 南
    winds.right = 3; // 西
    winds.opposite = 4; // 北
  }

  // プレイヤー情報を表示するコンポーネント
  const PlayerDisplay = ({
    position,
    player,
    wind,
  }: {
    position: Position;
    player: PlayerInfo;
    wind: number;
  }) => {
    const isDealer = player.isDealer;
    const showRiichi = isRiichi && position === "self";

    return (
      <div className="flex flex-col items-center gap-0.5">
        <div
          className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded text-white font-bold text-lg md:text-xl ${
            isDealer ? "bg-red-600" : "bg-gray-700"
          }`}
        >
          {windChars[wind]}
        </div>
        <div className="text-white text-xs md:text-sm font-semibold bg-gray-900/80 px-1.5 py-0.5 rounded">
          {player.score.toLocaleString()}
        </div>
        {showRiichi && (
          <span className="inline-block bg-red-600 text-white px-1.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">
            リーチ
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-[40vh] h-[40vh] max-w-80 max-h-80 min-w-[200px] min-h-[200px]">
      {/* 上（対面） */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2">
        <PlayerDisplay position="opposite" player={players.opposite} wind={winds.opposite} />
      </div>

      {/* 右（右家） */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2">
        <PlayerDisplay position="right" player={players.right} wind={winds.right} />
      </div>

      {/* 下（自分） */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <PlayerDisplay position="self" player={players.self} wind={winds.self} />
      </div>

      {/* 左（左家） */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2">
        <PlayerDisplay position="left" player={players.left} wind={winds.left} />
      </div>

      {/* 中央：局情報 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900/90 rounded-lg px-3 py-2 md:px-4 md:py-3">
        <div className="text-center">
          {/* 供託 */}
          {riichibou > 0 && (
            <div className="text-white text-xs md:text-sm mb-1">
              供託: {riichibou}本
            </div>
          )}

          {/* 局情報 */}
          <div className="text-white text-xl md:text-2xl font-bold">
            {windChars[roundWind === "east" ? 1 : 2]}
            {roundNumber}局
          </div>

          {/* 本場 */}
          <div className="text-white text-xs md:text-sm mt-1">
            {honba}本場
          </div>
        </div>
      </div>
    </div>
  );
}
