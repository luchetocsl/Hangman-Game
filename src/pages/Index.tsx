import React, { useState, useEffect, useCallback } from 'react';
import HangmanDrawing from '../components/HangmanDrawing';
import Keyboard from '../components/Keyboard';
import GameNavigation from '../components/GameNavigation';
import GameInfo from '../components/GameInfo';
import WordDisplay from '../components/WordDisplay';
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
  animals: [
    'ELEPHANT',
    'GIRAFFE',
    'PENGUIN',
    'DOLPHIN',
    'KANGAROO',
    'LION',
    'TIGER',
    'ZEBRA',
    'CHEETAH',
    'PANDA',
    'LEOPARD',
    'HIPPOPOTAMUS',
    'RACCOON',
    'FLAMINGO',
    'OSTRICH'
  ],
  countries: [
    'FRANCE',
    'JAPAN',
    'BRAZIL',
    'CANADA',
    'EGYPT',
    'GERMANY',
    'AUSTRALIA',
    'INDIA',
    'ITALY',
    'SPAIN',
    'MEXICO',
    'NETHERLANDS',
    'SWITZERLAND',
    'SWEDEN',
    'NORWAY'
  ],
  fruits: [
    'APPLE',
    'BANANA',
    'ORANGE',
    'MANGO',
    'GRAPE',
    'PINEAPPLE',
    'STRAWBERRY',
    'CHERRY',
    'PEACH',
    'WATERMELON',
    'KIWI',
    'PAPAYA',
    'BLUEBERRY',
    'RASPBERRY',
    'BLACKBERRY'
  ],
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

  const handleGuess = useCallback((letter: string) => {
    if (guessedLetters.has(letter)) return;
    
    setGuessedLetters(prev => new Set(prev).add(letter));

    if (word.includes(letter)) {
      setCorrectLetters(prev => {
        const newCorrectLetters = new Set(prev).add(letter);
        if (word.split('').every(l => newCorrectLetters.has(l))) {
          setScore(s => s + 1);
          setShowWinDialog(true);
        }
        return newCorrectLetters;
      });
    } else {
      setWrongLetters(prev => {
        const newWrongLetters = new Set(prev).add(letter);
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

  useEffect(() => {
    newGame();
  }, []);

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
    <>
      <GameNavigation onNewGame={newGame} />
      
      <main className="mt-24 flex flex-col items-center gap-6">
        <GameInfo 
          score={score}
          category={category}
          remainingChances={remainingChances}
        />

        <HangmanDrawing wrongGuesses={wrongLetters.size} />

        <WordDisplay word={word} guessedLetters={guessedLetters} />

        <Keyboard
          onGuess={handleGuess}
          guessedLetters={guessedLetters}
          correctLetters={correctLetters}
          wrongLetters={wrongLetters}
        />
      </main>

      <AlertDialog open={showWinDialog} onOpenChange={setShowWinDialog}>
        <AlertDialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 border-4 border-yellow-400 shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-3xl text-white text-center font-bold mb-4">
              🎉 Congratulations! 🎉
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white text-xl text-center">
              <div className="animate-bounce mb-4">🏆</div>
              You won! Your score is now {score}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center">
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
        <AlertDialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-red-500">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl text-white text-center">
              Game Over
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300 text-center">
              The word was {word}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center">
            <AlertDialogAction 
              onClick={newGame}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Try Again
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Index;
