"use client"

import type { GameState, Letter } from "@/types/game"

interface GameBoardProps {
  gameState: GameState
  isSubmitting: boolean
}

export function GameBoard({ gameState, isSubmitting }: GameBoardProps) {
  const { guesses, currentGuess, currentRow, currentWord } = gameState

  const getTileColor = (letter: Letter): string => {
    switch (letter.state) {
      case "correct":
        return "bg-green-500 text-white border-green-500"
      case "present":
        return "bg-yellow-500 text-white border-yellow-500"
      case "absent":
        return "bg-gray-500 text-white border-gray-500"
      default:
        return "bg-white border-gray-300"
    }
  }

  const renderRow = (rowIndex: number) => {
    const isCurrentRow = rowIndex === currentRow
    const isAnimatingRow = isCurrentRow && isSubmitting
    const guess = guesses[rowIndex] || []
    const wordLength = currentWord.length

    return (
      <div key={rowIndex} className="flex gap-1 justify-center mb-1">
        {Array.from({ length: wordLength }, (_, colIndex) => {
          const letter = guess[colIndex] || { char: "", state: "empty" }
          const isCurrentGuess = isCurrentRow && colIndex < currentGuess.length
          const currentGuessChar = isCurrentRow ? currentGuess[colIndex] || "" : ""

          const displayChar = letter.char || currentGuessChar
          const shouldAnimate = isAnimatingRow && letter.char
          const animationDelay = shouldAnimate ? colIndex * 150 : 0

          return (
            <div
              key={colIndex}
              className={`
                w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold
                transition-all duration-300 transform
                ${getTileColor(letter)}
                ${shouldAnimate ? "animate-flip" : ""}
                ${isCurrentGuess && !letter.char ? "border-gray-400 scale-105" : ""}
              `}
              style={{
                animationDelay: `${animationDelay}ms`,
              }}
            >
              {displayChar}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center p-4">
      <div className="grid gap-1">{Array.from({ length: 6 }, (_, i) => renderRow(i))}</div>
    </div>
  )
}
