import React, { useState, useEffect, useCallback } from 'react';
import HangmanDrawing from '../components/HangmanDrawing';
import Keyboard from '../components/Keyboard';
import { useToast } from '../hooks/use-toast';
import { Navigation2, RotateCw, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const WORDS = {
  animals: ['ELEPHANT', 'GIRAFFE', 'PENGUIN', 'DOLPHIN', 'KANGAROO'],
  countries: ['FRANCE', 'JAPAN', 'BRAZIL', 'CANADA', 'EGYPT'],
  fruits: ['APPLE', 'BANANA', 'ORANGE', 'MANGO', 'GRAPE'],
};

const Index = () => {
  const [category, setCategory] = useState<keyof typeof WORDS>('animals');
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [correctLetters, setCorrectLetters] = useState<Set<string>>(new Set());
  const [wrongLetters, setWrongLetters] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [showWinDialog, setShowWinDialog] = useState(false);
  const [showLoseDialog, setShowLoseDialog] = useState(false);
  const { toast } = useToast();

  const handleGuess = useCallback((letter: string) => {
    if (guessedLetters.has(letter)) return;
    
    setGuessedLetters(prev => new Set(prev).add(letter));

    if (word.includes(letter)) {
      setCorrectLetters(prev => {
        const newCorrectLetters = new Set(prev).add(letter);
        // Check win condition
        if (word.split('').every(l => newCorrectLetters.has(l))) {
          setScore(s => s + 1);
          setShowWinDialog(true);
        }
        return newCorrectLetters;
      });
    } else {
      setWrongLetters(prev => {
        const newWrongLetters = new Set(prev).add(letter);
        // Check lose condition after 5 mistakes instead of 10
        if (newWrongLetters.size >= 5) {
          setShowLoseDialog(true);
        }
        return newWrongLetters;
      });
    }
  }, [word, guessedLetters]);

  const newGame = useCallback(() => {
    const categories = Object.keys(WORDS) as Array<keyof typeof WORDS>;
    const newCategory = categories[Math.floor(Math.random() * categories.length)];
    const words = WORDS[newCategory];
    const newWord = words[Math.floor(Math.random() * words.length)];
    
    setCategory(newCategory);
    setWord(newWord);
    setGuessedLetters(new Set());
    setCorrectLetters(new Set());
    setWrongLetters(new Set());
    setShowWinDialog(false);
    setShowLoseDialog(false);
  }, []);

  // Initialize game
  useEffect(() => {
    newGame();
  }, []);

  // Keyboard event listener
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) {
        handleGuess(key);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleGuess]);

  const remainingChances = 5 - wrongLetters.size;

  return (
    <div className="container">
      <nav className="flex items-center justify-between mb-8 bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Navigation2 className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Hangman</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={newGame}
          className="flex items-center gap-2"
        >
          <RotateCw className="h-4 w-4" />
          New Word
        </Button>
      </nav>
      
      <div className="game-info mb-4">
        <div className="score">Score: {score}</div>
        <div className="category">Category: {category}</div>
        <div className="chances flex items-center gap-2 mt-2">
          <Heart className="h-5 w-5 text-red-500" />
          <span className="text-lg font-semibold">
            {remainingChances} {remainingChances === 1 ? 'chance' : 'chances'} left
          </span>
        </div>
      </div>

      <HangmanDrawing wrongGuesses={wrongLetters.size} />

      <div className="word-display">
        {word.split('').map((letter, index) => (
          <div key={index} className="letter-box">
            {guessedLetters.has(letter) ? letter : ''}
          </div>
        ))}
      </div>

      <Keyboard
        onGuess={handleGuess}
        guessedLetters={guessedLetters}
        correctLetters={correctLetters}
        wrongLetters={wrongLetters}
      />

      <AlertDialog open={showWinDialog} onOpenChange={setShowWinDialog}>
        <AlertDialogContent className="bg-gradient-to-r from-purple-500 to-pink-500 border-4 border-yellow-400 shadow-xl transform transition-all">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-3xl text-white text-center font-bold mb-4">
              🎉 Congratulations! 🎉
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white text-xl text-center">
              <div className="animate-bounce mb-4">🏆</div>
              You won! Your score is now {score}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={newGame}
              className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold py-2 px-6 rounded-full transform transition-transform hover:scale-105 active:scale-95"
            >
              Play Again! 🎮
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showLoseDialog} onOpenChange={setShowLoseDialog}>
        <AlertDialogContent className="bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-red-500">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-white text-center">
              Game Over
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300 text-center">
              The word was {word}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={newGame}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Try Again
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
