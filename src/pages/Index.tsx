import React, { useState, useEffect } from 'react';
import HangmanDrawing from '../components/HangmanDrawing';
import Keyboard from '../components/Keyboard';
import { useToast } from '../hooks/use-toast';

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
  const { toast } = useToast();

  useEffect(() => {
    newGame();
  }, []);

  // Add keyboard event listener
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
  }, [guessedLetters, word]); // Add dependencies for the effect

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
  };

  const handleGuess = (letter: string) => {
    const newGuessedLetters = new Set(guessedLetters).add(letter);
    setGuessedLetters(newGuessedLetters);

    if (word.includes(letter)) {
      const newCorrectLetters = new Set(correctLetters).add(letter);
      setCorrectLetters(newCorrectLetters);

      // Check win
      if (word.split('').every(l => newCorrectLetters.has(l))) {
        toast({
          title: "Congratulations!",
          description: "You won! Starting a new game...",
        });
        setScore(score + 1);
        setTimeout(newGame, 2000);
      }
    } else {
      const newWrongLetters = new Set(wrongLetters).add(letter);
      setWrongLetters(newWrongLetters);

      // Check lose - changed from 10 to 5 wrong guesses
      if (newWrongLetters.size >= 5) {
        toast({
          title: "Game Over",
          description: `The word was ${word}. Starting a new game...`,
          variant: "destructive",
        });
        setTimeout(newGame, 2000);
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
    </div>
  );
};

export default Index;