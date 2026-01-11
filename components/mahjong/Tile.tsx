import { Tile as TileType } from "@/lib/types/mahjong";
import { tileToFileName } from "@/lib/utils/tile-helper";
import Image from "next/image";

interface TileProps {
  tile: TileType;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// レスポンシブなサイズ指定（vw単位 + max/min-width）
const sizeClassMap = {
  sm: "w-[3.5vw] max-w-[26px] min-w-[18px]",
  md: "w-[4.5vw] max-w-[36px] min-w-[22px]",
  lg: "w-[5.5vw] max-w-[46px] min-w-[28px]",
};

export default function Tile({ tile, size = "md", className = "" }: TileProps) {
  const fileName = tileToFileName(tile);
  const sizeClass = sizeClassMap[size];

  return (
    <div className={`inline-block relative ${sizeClass} aspect-[7/10] ${className}`}>
      {/* 背景（牌の枠） */}
      <Image
        src="/tiles/Front.svg"
        alt="tile-front"
        fill
        className="absolute inset-0 select-none object-contain"
        draggable={false}
      />
      {/* 牌の模様 */}
      <Image
        src={`/tiles/${fileName}`}
        alt={fileName}
        fill
        className="absolute inset-0 select-none object-contain"
        draggable={false}
      />
    </div>
  );
}
