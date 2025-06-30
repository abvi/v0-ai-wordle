import type { LetterState } from "@/types/game"

interface GameBoardProps {
  guesses: Array<{ word: string; results: LetterState[] }>
  currentGuess: string
  currentRow: number
  wordLength: number
  isSubmitting: boolean
}

export function GameBoard({ guesses, currentGuess, currentRow, wordLength, isSubmitting }: GameBoardProps) {
  const maxAttempts = 6

  const getTileStyle = (state: LetterState | null, isAnimating: boolean, animationDelay: number) => {
    const baseStyle = `
      w-12 h-12 border-2 flex items-center justify-center text-xl font-bold
      transition-all duration-300 ease-in-out
    `

    if (isAnimating) {
      return `${baseStyle} border-gray-400 bg-white text-gray-800 animate-pulse`
    }

    switch (state) {
      case "correct":
        return `${baseStyle} border-green-500 bg-green-500 text-white transform`
      case "present":
        return `${baseStyle} border-yellow-500 bg-yellow-500 text-white transform`
      case "absent":
        return `${baseStyle} border-gray-500 bg-gray-500 text-white transform`
      default:
        return `${baseStyle} border-gray-300 bg-white text-gray-800`
    }
  }

  const renderRow = (rowIndex: number) => {
    const guess = guesses[rowIndex]
    const isCurrentRow = rowIndex === currentRow
    const isAnimatingRow = isSubmitting && isCurrentRow

    return (
      <div key={rowIndex} className="flex gap-2 justify-center">
        {Array.from({ length: wordLength }).map((_, colIndex) => {
          let letter = ""
          let state: LetterState | null = null

          if (guess) {
            letter = guess.word[colIndex] || ""
            state = guess.results[colIndex] || null
          } else if (isCurrentRow) {
            letter = currentGuess[colIndex] || ""
          }

          const isAnimating = isAnimatingRow && colIndex < currentGuess.length
          const animationDelay = colIndex * 150

          return (
            <div
              key={colIndex}
              className={getTileStyle(state, isAnimating, animationDelay)}
              style={{
                animationDelay: isAnimating ? `${animationDelay}ms` : undefined,
              }}
            >
              {letter}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm mx-auto p-4">
      <div className="space-y-2">{Array.from({ length: maxAttempts }).map((_, rowIndex) => renderRow(rowIndex))}</div>
    </div>
  )
}
