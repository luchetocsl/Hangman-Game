import React from 'react';
import { Navigation2, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GameNavigationProps {
  onNewGame: () => void;
}

const GameNavigation = ({ onNewGame }: GameNavigationProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-10 bg-white/50 backdrop-blur-sm shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Navigation2 className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Hangman</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onNewGame}
          className="flex items-center gap-2"
        >
          <RotateCw className="h-4 w-4" />
          New Word
        </Button>
      </div>
    </nav>
  );
};

export default GameNavigation;