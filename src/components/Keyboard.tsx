import React from 'react';

interface Props {
  onGuess: (letter: string) => void;
  guessedLetters: Set<string>;
  correctLetters: Set<string>;
  wrongLetters: Set<string>;
}

const KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const Keyboard: React.FC<Props> = ({ onGuess, guessedLetters, correctLetters, wrongLetters }) => {
  return (
    <div className="keyboard">
      {KEYS.map((key) => {
        const isGuessed = guessedLetters.has(key);
        const isCorrect = correctLetters.has(key);
        const isWrong = wrongLetters.has(key);
        
        let className = 'key';
        if (isCorrect) className += ' correct';
        if (isWrong) className += ' wrong';
        if (isGuessed) className += ' used';

        return (
          <button
            key={key}
            className={className}
            onClick={() => onGuess(key)}
            disabled={isGuessed}
          >
            {key}
          </button>
        );
      })}
    </div>
  );
};

export default Keyboard;