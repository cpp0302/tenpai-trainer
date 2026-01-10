import { Hand as HandType } from "@/lib/types/mahjong";
import Tile from "./Tile";

interface HandProps {
  hand: HandType;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Hand({ hand, size = "md", className = "" }: HandProps) {
  return (
    <div className={`flex gap-0.5 ${className}`}>
      {hand.tiles.map((tile, index) => (
        <Tile key={index} tile={tile} size={size} />
      ))}
    </div>
  );
}
