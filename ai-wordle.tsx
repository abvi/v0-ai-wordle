"use client"

import { useEffect } from "react"
import { useGame } from "./hooks/useGame"
import { GameBoard } from "./components/GameBoard"
import { Keyboard } from "./components/Keyboard"
import { Button } from "@/components/ui/button"

export default function AIWordle() {
  const { gameState, addLetter, removeLetter, submitGuess, resetGame, isSubmitting, isValidating, isLoadingWords } =
    useGame()

  // Handle physical keyboard input
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (gameState.gameStatus !== "playing" || isSubmitting || isValidating) return

      const key = event.key.toUpperCase()

      if (key === "ENTER") {
        submitGuess()
      } else if (key === "BACKSPACE") {
        removeLetter()
      } else if (/^[A-Z]$/.test(key)) {
        addLetter(key)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [gameState.gameStatus, addLetter, removeLetter, submitGuess, isSubmitting, isValidating])

  if (isLoadingWords) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AI words from OpenAI...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-center text-gray-900">AI Wordle</h1>
          <p className="text-center text-gray-600 mt-2">
            Guess the AI-related word! ({gameState.currentWord.length} letters)
          </p>
          {isValidating && <p className="text-center text-blue-600 mt-1 text-sm">Validating word with AI...</p>}
        </div>
      </header>

      {/* Game Board */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
        <GameBoard
          guesses={gameState.guesses}
          currentGuess={gameState.currentGuess}
          currentRow={gameState.currentRow}
          wordLength={gameState.currentWord.length}
          isSubmitting={isSubmitting}
        />

        {/* Game Status */}
        {gameState.gameStatus !== "playing" && (
          <div className="text-center p-4">
            {gameState.gameStatus === "won" ? (
              <div className="text-green-600">
                <h2 className="text-2xl font-bold mb-2">🎉 Congratulations!</h2>
                <p>
                  You guessed the word: <strong>{gameState.currentWord}</strong>
                </p>
              </div>
            ) : (
              <div className="text-red-600">
                <h2 className="text-2xl font-bold mb-2">😔 Game Over</h2>
                <p>
                  The word was: <strong>{gameState.currentWord}</strong>
                </p>
              </div>
            )}
            <Button onClick={resetGame} className="mt-4">
              Play Again
            </Button>
          </div>
        )}

        {/* Keyboard */}
        <Keyboard
          onLetterClick={isSubmitting || isValidating ? () => {} : addLetter}
          onEnterClick={isSubmitting || isValidating ? () => {} : submitGuess}
          onBackspaceClick={isSubmitting || isValidating ? () => {} : removeLetter}
        />

        {/* Game Info */}
        <div className="text-center p-4 text-gray-600">
          <p>
            Attempts: {gameState.currentRow} / {gameState.maxAttempts}
          </p>
          <p className="text-sm mt-2">🟩 Correct position • 🟨 Wrong position • ⬜ Not in word</p>
          <p className="text-xs mt-1 text-gray-500">
            Words are validated using OpenAI - only AI/tech terms are accepted
          </p>
        </div>
      </main>
    </div>
  )
}
