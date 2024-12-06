import React, { useState, useEffect } from 'react';
import HangmanDrawing from '../components/HangmanDrawing';
import Keyboard from '../components/Keyboard';
import { useToast } from '../hooks/use-toast';
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

  useEffect(() => {
    newGame();
  }, []);

  const newGame = () => {
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
  };

  const handleGuess = (letter: string) => {
    const newGuessedLetters = new Set(guessedLetters).add(letter);
    setGuessedLetters(newGuessedLetters);

    if (word.includes(letter)) {
      const newCorrectLetters = new Set(correctLetters).add(letter);
      setCorrectLetters(newCorrectLetters);

      // Check win
      if (word.split('').every(l => newCorrectLetters.has(l))) {
        setScore(score + 1);
        setShowWinDialog(true);
      }
    } else {
      const newWrongLetters = new Set(wrongLetters).add(letter);
      setWrongLetters(newWrongLetters);

      // Check lose
      if (newWrongLetters.size >= 5) {
        setShowLoseDialog(true);
      }
    }
  };

  return (
    <div className="container">
      <h1 className="game-title">Hangman</h1>
      
      <div className="game-info">
        <div className="score">Score: {score}</div>
        <div className="category">Category: {category}</div>
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