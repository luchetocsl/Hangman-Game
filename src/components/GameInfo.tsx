import React from 'react';
import { Heart } from "lucide-react";

interface GameInfoProps {
  score: number;
  category: string;
  remainingChances: number;
}

const GameInfo = ({ score, category, remainingChances }: GameInfoProps) => {
  return (
    <div className="game-info w-full max-w-md mx-auto text-center">
      <div className="score text-lg font-semibold mb-2">Score: {score}</div>
      <div className="category text-md text-primary mb-2">Category: {category}</div>
      <div className="chances inline-flex items-center justify-center gap-2">
        <Heart className="h-5 w-5 text-red-500" fill="currentColor" />
        <span className="text-lg font-semibold">
          {remainingChances} {remainingChances === 1 ? 'chance' : 'chances'} left
        </span>
      </div>
    </div>
  );
};

export default GameInfo;