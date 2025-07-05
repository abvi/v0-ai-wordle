"use client"

import type { GameState } from "@/types/game"

interface GameBoardProps {
  guesses: GameState["guesses"]
  currentGuess: string
  currentRow: number
  wordLength: number
  isSubmitting: boolean
}

export function GameBoard({ guesses, currentGuess, currentRow, wordLength, isSubmitting }: GameBoardProps) {
  const maxAttempts = 6

  const getTileClass = (state: string, isFlipping: boolean, hasLetter: boolean) => {
    const baseClass =
      "w-12 h-12 border-2 flex items-center justify-center text-lg font-bold rounded transition-all duration-500"

    if (isFlipping) {
      return `${baseClass} animate-flip border-gray-400 bg-gray-200`
    }

    switch (state) {
      case "correct":
        return `${baseClass} bg-green-500 border-green-500 text-white`
      case "present":
        return `${baseClass} bg-yellow-500 border-yellow-500 text-white`
      case "absent":
        return `${baseClass} bg-gray-500 border-gray-500 text-white`
      default:
        if (hasLetter) {
          return `${baseClass} border-gray-400 bg-white text-gray-900 border-2`
        }
        return `${baseClass} border-gray-300 bg-white text-gray-900`
    }
  }

  const renderRow = (rowIndex: number) => {
    const isCurrentRow = rowIndex === currentRow
    const isSubmittingRow = isCurrentRow && isSubmitting
    const guess = guesses[rowIndex]

    return (
      <div key={rowIndex} className="flex gap-2 justify-center">
        {Array.from({ length: wordLength }).map((_, colIndex) => {
          let letter = ""
          let state = "empty"

          if (guess) {
            // Completed guess - show final state
            letter = guess.word[colIndex] || ""
            state = guess.results[colIndex] || "empty"
          } else if (isCurrentRow && !isSubmitting) {
            // Current guess being typed - show letters as user types
            letter = currentGuess[colIndex] || ""
            state = letter ? "filled" : "empty"
          } else if (isSubmittingRow) {
            // During submission animation - show the letters but with flipping animation
            letter = currentGuess[colIndex] || ""
            state = "flipping"
          }

          const isFlipping = isSubmittingRow && letter
          const animationDelay = colIndex * 150

          return (
            <div
              key={colIndex}
              className={getTileClass(state, isFlipping, !!letter)}
              style={
                isFlipping
                  ? {
                      animationDelay: `${animationDelay}ms`,
                      animationFillMode: "forwards",
                    }
                  : {}
              }
            >
              {letter}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 p-4">
      {Array.from({ length: maxAttempts }).map((_, index) => renderRow(index))}

      <style jsx>{`
        @keyframes flip {
          0% {
            transform: rotateX(0);
          }
          50% {
            transform: rotateX(90deg);
            background-color: #e5e7eb;
          }
          100% {
            transform: rotateX(0);
          }
        }
        
        .animate-flip {
          animation: flip 0.6s ease-in-out;
        }
      `}</style>
    </div>
  )
}
