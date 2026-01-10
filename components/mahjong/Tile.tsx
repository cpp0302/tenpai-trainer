import { Tile as TileType } from "@/lib/types/mahjong";
import { tileToFileName } from "@/lib/utils/tile-helper";
import Image from "next/image";

interface TileProps {
  tile: TileType;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { width: 30, height: 42 },
  md: { width: 40, height: 56 },
  lg: { width: 50, height: 70 },
};

export default function Tile({ tile, size = "md", className = "" }: TileProps) {
  const fileName = tileToFileName(tile);
  const { width, height } = sizeMap[size];

  return (
    <div className={`inline-block relative ${className}`} style={{ width, height }}>
      {/* 背景（牌の枠） */}
      <Image
        src="/tiles/Front.svg"
        alt="tile-front"
        width={width}
        height={height}
        className="absolute inset-0 select-none"
        draggable={false}
      />
      {/* 牌の模様 */}
      <Image
        src={`/tiles/${fileName}`}
        alt={fileName}
        width={width}
        height={height}
        className="absolute inset-0 select-none"
        draggable={false}
      />
    </div>
  );
}
