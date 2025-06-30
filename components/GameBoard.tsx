"use client"

import type { GameState, LetterState } from "@/types/game"

interface GameBoardProps {
  gameState: GameState
  isSubmitting: boolean
}

export function GameBoard({ gameState, isSubmitting }: GameBoardProps) {
  const { guesses, currentGuess, currentRow, currentWord } = gameState

  const getTileStyle = (state: LetterState, isAnimating: boolean, animationDelay: number) => {
    const baseClasses =
      "w-12 h-12 border-2 flex items-center justify-center text-xl font-bold transition-all duration-300"

    if (isAnimating) {
      return `${baseClasses} border-gray-400 bg-white text-gray-800 animate-pulse`
    }

    switch (state) {
      case "correct":
        return `${baseClasses} bg-green-500 border-green-500 text-white transform`
      case "present":
        return `${baseClasses} bg-yellow-500 border-yellow-500 text-white transform`
      case "absent":
        return `${baseClasses} bg-gray-500 border-gray-500 text-white transform`
      case "filled":
        return `${baseClasses} border-gray-400 bg-white text-gray-800`
      default:
        return `${baseClasses} border-gray-300 bg-white text-gray-800`
    }
  }

  const renderRow = (rowIndex: number) => {
    const guess = guesses[rowIndex] || []
    const isCurrentRow = rowIndex === currentRow
    const isAnimatingRow = isSubmitting && isCurrentRow

    // Create tiles array for this row
    const tiles = Array(currentWord.length)
      .fill(null)
      .map((_, colIndex) => {
        let char = ""
        let state: LetterState = "empty"

        if (guess[colIndex]) {
          // This row has been submitted
          char = guess[colIndex].char
          state = guess[colIndex].state
        } else if (isCurrentRow && colIndex < currentGuess.length) {
          // This is the current row and we're typing
          char = currentGuess[colIndex]
          state = "filled"
        }

        return { char, state }
      })

    return (
      <div key={rowIndex} className="flex gap-2 justify-center">
        {tiles.map((tile, colIndex) => {
          const isAnimating = isAnimatingRow && tile.char !== ""
          const animationDelay = colIndex * 150

          return (
            <div
              key={colIndex}
              className={getTileStyle(tile.state, isAnimating, animationDelay)}
              style={{
                animationDelay: isAnimating ? `${animationDelay}ms` : undefined,
              }}
            >
              {tile.char}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 p-4">
      {Array(6)
        .fill(null)
        .map((_, rowIndex) => renderRow(rowIndex))}
    </div>
  )
}
