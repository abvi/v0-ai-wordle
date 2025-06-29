"use client"

import { useEffect, useState } from "react"
import type { Letter } from "../types/game"

interface GameBoardProps {
  guesses: Letter[][]
  currentGuess: string
  currentRow: number
  wordLength: number
  isSubmitting: boolean
}

export function GameBoard({ guesses, currentGuess, currentRow, wordLength, isSubmitting }: GameBoardProps) {
  const [animatingRow, setAnimatingRow] = useState<number | null>(null)
  const [revealedLetters, setRevealedLetters] = useState<Set<string>>(new Set())
  const [animationGuess, setAnimationGuess] = useState<string>("")

  useEffect(() => {
    if (isSubmitting) {
      // Store the current guess for animation
      setAnimationGuess(currentGuess)
      setAnimatingRow(currentRow)
      setRevealedLetters(new Set())

      // Animate each letter with a delay
      const animateLetters = async () => {
        for (let i = 0; i < wordLength; i++) {
          await new Promise((resolve) => setTimeout(resolve, 150))
          setRevealedLetters((prev) => new Set([...prev, `${currentRow}-${i}`]))
        }

        // Clear animation state after all letters are revealed
        setTimeout(() => {
          setAnimatingRow(null)
          setRevealedLetters(new Set())
          setAnimationGuess("")
        }, 300)
      }

      animateLetters()
    }
  }, [isSubmitting, currentRow, currentGuess, wordLength])

  const getLetterStyle = (state: string, isRevealed: boolean, isAnimating: boolean) => {
    const baseStyle =
      "w-12 h-12 border-2 flex items-center justify-center text-lg font-bold uppercase transition-all duration-300"

    if (isAnimating && !isRevealed) {
      return `${baseStyle} bg-white border-gray-300 animate-pulse`
    }

    switch (state) {
      case "correct":
        return `${baseStyle} bg-green-500 text-white border-green-500`
      case "present":
        return `${baseStyle} bg-yellow-500 text-white border-yellow-500`
      case "absent":
        return `${baseStyle} bg-gray-500 text-white border-gray-500`
      default:
        return `${baseStyle} bg-white border-gray-300`
    }
  }

  const getTileTransform = (rowIndex: number, colIndex: number) => {
    const isCurrentAnimatingTile = animatingRow === rowIndex
    const tileKey = `${rowIndex}-${colIndex}`
    const isRevealed = revealedLetters.has(tileKey)

    if (isCurrentAnimatingTile && !isRevealed) {
      return "transform rotateY-180 scale-105"
    }

    return ""
  }

  return (
    <div className="grid gap-2 p-4">
      <style jsx>{`
        @keyframes flipIn {
          0% {
            transform: rotateY(-90deg) scale(0.8);
          }
          50% {
            transform: rotateY(0deg) scale(1.1);
          }
          100% {
            transform: rotateY(0deg) scale(1);
          }
        }
        
        .flip-animation {
          animation: flipIn 0.6s ease-in-out;
        }
      `}</style>

      {guesses.map((guess, rowIndex) => (
        <div key={rowIndex} className="flex gap-2 justify-center">
          {Array.from({ length: wordLength }).map((_, colIndex) => {
            let letter = ""
            let state = "empty"
            const tileKey = `${rowIndex}-${colIndex}`
            const isCurrentAnimatingTile = animatingRow === rowIndex
            const isRevealed = revealedLetters.has(tileKey)

            if (rowIndex < currentRow) {
              // Completed row
              letter = guess[colIndex]?.char || ""
              state = guess[colIndex]?.state || "empty"
            } else if (rowIndex === currentRow) {
              // Current row - show animation guess if animating, otherwise current guess
              if (isSubmitting && animationGuess) {
                letter = animationGuess[colIndex] || ""
                // Show the final state if revealed during animation
                if (isRevealed && guess[colIndex]) {
                  state = guess[colIndex].state
                } else {
                  state = "empty"
                }
              } else {
                letter = currentGuess[colIndex] || ""
                state = "empty"
              }
            }

            return (
              <div
                key={colIndex}
                className={`
                  ${getLetterStyle(state, isRevealed, isCurrentAnimatingTile)}
                  ${getTileTransform(rowIndex, colIndex)}
                  ${isCurrentAnimatingTile && isRevealed ? "flip-animation" : ""}
                `}
                style={{
                  animationDelay: isCurrentAnimatingTile ? `${colIndex * 150}ms` : "0ms",
                }}
              >
                {letter}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
