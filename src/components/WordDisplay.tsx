import React from 'react';

interface WordDisplayProps {
  word: string;
  guessedLetters: Set<string>;
}

const WordDisplay = ({ word, guessedLetters }: WordDisplayProps) => {
  return (
    <div className="word-display">
      {word.split('').map((letter, index) => (
        <div key={index} className="letter-box">
          {guessedLetters.has(letter) ? letter : ''}
        </div>
      ))}
    </div>
  );
};

export default WordDisplay;