"use client"

import type React from "react"

import type { GameState } from "@/types/game"

interface GameBoardProps {
  guesses: GameState["guesses"]
  currentGuess: string
  currentRow: number
  wordLength: number
  isSubmitting: boolean
  targetWord: string
}

export function GameBoard({ guesses, currentGuess, currentRow, wordLength, isSubmitting, targetWord }: GameBoardProps) {
  const maxAttempts = 6

  const getTileClass = (state: string, isFlipping: boolean, hasLetter: boolean, delay = 0) => {
    const baseClass =
      "w-12 h-12 border-2 flex items-center justify-center text-lg font-bold rounded transition-all duration-200"

    if (isFlipping) {
      // During animation, we'll let CSS handle the color transition
      return `${baseClass} animate-flip border-gray-400`
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
          let finalState = "empty"

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
            // We need to calculate what the final state will be for the animation
            const targetWordLocal = targetWord
            if (letter === targetWordLocal[colIndex]) {
              finalState = "correct"
            } else if (targetWordLocal.includes(letter)) {
              finalState = "present"
            } else {
              finalState = "absent"
            }
          }

          const isFlipping = isSubmittingRow && letter
          const animationDelay = colIndex * 150

          return (
            <div
              key={colIndex}
              className={getTileClass(state, isFlipping, !!letter)}
              style={
                {
                  ...(isFlipping
                    ? {
                        animationDelay: `${animationDelay}ms`,
                        animationFillMode: "forwards",
                        "--final-bg":
                          finalState === "correct" ? "#22c55e" : finalState === "present" ? "#eab308" : "#6b7280",
                        "--final-border":
                          finalState === "correct" ? "#22c55e" : finalState === "present" ? "#eab308" : "#6b7280",
                      }
                    : {}),
                } as React.CSSProperties
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
      background-color: white;
      border-color: #9ca3af;
    }
    50% {
      transform: rotateX(90deg);
      background-color: white;
      border-color: #9ca3af;
    }
    51% {
      transform: rotateX(90deg);
      background-color: var(--final-bg);
      border-color: var(--final-border);
      color: white;
    }
    100% {
      transform: rotateX(0);
      background-color: var(--final-bg);
      border-color: var(--final-border);
      color: white;
    }
  }
  
  .animate-flip {
    animation: flip 0.6s ease-in-out;
  }
`}</style>
    </div>
  )
}
