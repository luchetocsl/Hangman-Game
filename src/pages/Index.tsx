import React, { useState, useEffect } from 'react';
import HangmanDrawing from '../components/HangmanDrawing';
import Keyboard from '../components/Keyboard';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Sparkles } from 'lucide-react';

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
  const [showModal, setShowModal] = useState(false);
  const [gameResult, setGameResult] = useState<{ title: string; description: string; isWin: boolean }>({
    title: '',
    description: '',
    isWin: false
  });

  useEffect(() => {
    newGame();
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key.toUpperCase();
      if (/^[A-Z]$/.test(key) && !guessedLetters.has(key)) {
        handleGuess(key);
      }
    };

    window.addEventListener('keyup', handleKeyPress);
    return () => {
      window.removeEventListener('keyup', handleKeyPress);
    };
  }, [guessedLetters, word]);

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
    setShowModal(false);
  };

  const handleGuess = (letter: string) => {
    const newGuessedLetters = new Set(guessedLetters).add(letter);
    setGuessedLetters(newGuessedLetters);

    if (word.includes(letter)) {
      const newCorrectLetters = new Set(correctLetters).add(letter);
      setCorrectLetters(newCorrectLetters);

      if (word.split('').every(l => newCorrectLetters.has(l))) {
        setGameResult({
          title: "🎉 Congratulations! 🎉",
          description: `You won! The word was "${word}". Let's play another round!`,
          isWin: true
        });
        setScore(score + 1);
        setShowModal(true);
      }
    } else {
      const newWrongLetters = new Set(wrongLetters).add(letter);
      setWrongLetters(newWrongLetters);

      if (newWrongLetters.size >= 5) {
        setGameResult({
          title: "Game Over",
          description: `The word was "${word}". Better luck next time!`,
          isWin: false
        });
        setShowModal(true);
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

      <AlertDialog open={showModal} onOpenChange={setShowModal}>
        <AlertDialogContent className="border-4 border-primary">
          <AlertDialogHeader>
            <AlertDialogTitle className={`text-2xl font-bold flex items-center justify-center gap-2 ${gameResult.isWin ? 'text-green-500' : 'text-red-500'}`}>
              {gameResult.isWin && <Sparkles className="h-6 w-6" />}
              {gameResult.title}
              {gameResult.isWin && <Sparkles className="h-6 w-6" />}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-lg text-center mt-4">
              {gameResult.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-center mt-6">
            <AlertDialogAction 
              onClick={newGame}
              className={`px-8 py-3 text-lg font-semibold ${
                gameResult.isWin 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              Play Again
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;