"use client"

import { useEffect } from "react"
import { GameBoard } from "@/components/GameBoard"
import { Keyboard } from "@/components/Keyboard"
import { useGame } from "@/hooks/useGame"

export default function AIWordle() {
  const {
    gameState,
    addLetter,
    removeLetter,
    submitGuess,
    resetGame,
    isSubmitting,
    isValidating,
    isLoadingWords,
    keyboardState,
  } = useGame()

  // Handle physical keyboard input
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isSubmitting || isValidating) return

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
  }, [addLetter, removeLetter, submitGuess, isSubmitting, isValidating])

  if (isLoadingWords) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading AI words...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-center text-gray-900">AI Wordle</h1>
          <p className="text-center text-gray-600 mt-1">Guess the AI-related word in 6 tries!</p>
        </div>
      </header>

      {/* Game Content */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full px-4">
        <GameBoard gameState={gameState} isSubmitting={isSubmitting} />

        {/* Status Messages */}
        <div className="h-8 flex items-center justify-center mb-4">
          {isValidating && <p className="text-blue-600 font-medium">Validating word...</p>}
          {gameState.gameStatus === "won" && (
            <p className="text-green-600 font-bold text-lg">🎉 Congratulations! You won!</p>
          )}
          {gameState.gameStatus === "lost" && (
            <p className="text-red-600 font-bold text-lg">
              Game Over! The word was: <span className="font-mono">{gameState.currentWord}</span>
            </p>
          )}
        </div>

        <Keyboard
          onLetterClick={addLetter}
          onEnterClick={submitGuess}
          onBackspaceClick={removeLetter}
          keyboardState={keyboardState}
        />

        {/* Reset Button */}
        {(gameState.gameStatus === "won" || gameState.gameStatus === "lost") && (
          <button
            onClick={resetGame}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Play Again
          </button>
        )}
      </main>
    </div>
  )
}
