"use client"

import type { Letter } from "@/types/game"

interface GameBoardProps {
  guesses: Letter[][]
  currentGuess: string
  currentRow: number
  wordLength: number
  isSubmitting: boolean
}

export function GameBoard({ guesses, currentGuess, currentRow, wordLength, isSubmitting }: GameBoardProps) {
  const renderTile = (letter: Letter, rowIndex: number, colIndex: number) => {
    const isCurrentRow = rowIndex === currentRow
    const isSubmittingRow = isSubmitting && isCurrentRow
    const animationDelay = isSubmittingRow ? colIndex * 150 : 0

    // For the current row during submission, show the submitted letters
    const displayChar = isCurrentRow && !isSubmitting ? currentGuess[colIndex] || "" : letter.char

    const getTileClass = () => {
      let baseClass =
        "w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold transition-all duration-300"

      if (isSubmittingRow) {
        baseClass += " animate-flip"
      }

      // Color based on letter state
      switch (letter.state) {
        case "correct":
          return `${baseClass} bg-green-500 text-white border-green-500`
        case "present":
          return `${baseClass} bg-yellow-500 text-white border-yellow-500`
        case "absent":
          return `${baseClass} bg-gray-500 text-white border-gray-500`
        default:
          if (displayChar) {
            return `${baseClass} bg-white border-gray-400 text-black`
          }
          return `${baseClass} bg-white border-gray-300 text-black`
      }
    }

    return (
      <div
        key={`${rowIndex}-${colIndex}`}
        className={getTileClass()}
        style={{
          animationDelay: isSubmittingRow ? `${animationDelay}ms` : undefined,
        }}
      >
        {displayChar}
      </div>
    )
  }

  return (
    <div className="grid gap-2 p-4">
      {guesses.map((guess, rowIndex) => (
        <div key={rowIndex} className="flex gap-2 justify-center">
          {Array.from({ length: wordLength }, (_, colIndex) => {
            const letter = guess[colIndex] || { char: "", state: "empty" }
            return renderTile(letter, rowIndex, colIndex)
          })}
        </div>
      ))}
    </div>
  )
}
