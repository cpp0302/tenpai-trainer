import { Tile as TileType } from "@/lib/types/mahjong";
import Tile from "./Tile";

interface DoraIndicatorProps {
  dora: TileType[];
  uraDora?: TileType[];
  showUraDora?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function DoraIndicator({
  dora,
  uraDora,
  showUraDora = false,
  size = "sm",
  className = "",
}: DoraIndicatorProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold">ドラ:</span>
        <div className="flex gap-0.5">
          {dora.map((tile, index) => (
            <Tile key={index} tile={tile} size={size} />
          ))}
        </div>
      </div>

      {showUraDora && uraDora && uraDora.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">裏:</span>
          <div className="flex gap-0.5">
            {uraDora.map((tile, index) => (
              <Tile key={index} tile={tile} size={size} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
