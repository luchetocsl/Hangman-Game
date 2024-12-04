import React from 'react';

interface Props {
  wrongGuesses: number;
}

const HangmanDrawing: React.FC<Props> = ({ wrongGuesses }) => {
  return (
    <svg className="hangman-drawing" viewBox="0 0 200 250">
      {/* Base */}
      {wrongGuesses > 0 && (
        <line x1="20" y1="230" x2="180" y2="230" stroke="currentColor" strokeWidth="4" />
      )}
      {/* Vertical bar */}
      {wrongGuesses > 1 && (
        <line x1="40" y1="230" x2="40" y2="20" stroke="currentColor" strokeWidth="4" />
      )}
      {/* Top bar */}
      {wrongGuesses > 2 && (
        <line x1="40" y1="20" x2="120" y2="20" stroke="currentColor" strokeWidth="4" />
      )}
      {/* Rope */}
      {wrongGuesses > 3 && (
        <line x1="120" y1="20" x2="120" y2="50" stroke="currentColor" strokeWidth="4" />
      )}
      {/* Head */}
      {wrongGuesses > 4 && (
        <circle cx="120" cy="70" r="20" stroke="currentColor" strokeWidth="4" fill="none" />
      )}
      {/* Body */}
      {wrongGuesses > 5 && (
        <line x1="120" y1="90" x2="120" y2="150" stroke="currentColor" strokeWidth="4" />
      )}
      {/* Left arm */}
      {wrongGuesses > 6 && (
        <line x1="120" y1="110" x2="80" y2="130" stroke="currentColor" strokeWidth="4" />
      )}
      {/* Right arm */}
      {wrongGuesses > 7 && (
        <line x1="120" y1="110" x2="160" y2="130" stroke="currentColor" strokeWidth="4" />
      )}
      {/* Left leg */}
      {wrongGuesses > 8 && (
        <line x1="120" y1="150" x2="80" y2="190" stroke="currentColor" strokeWidth="4" />
      )}
      {/* Right leg */}
      {wrongGuesses > 9 && (
        <line x1="120" y1="150" x2="160" y2="190" stroke="currentColor" strokeWidth="4" />
      )}
    </svg>
  );
};

export default HangmanDrawing;