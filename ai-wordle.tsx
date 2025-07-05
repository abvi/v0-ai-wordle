"use client"

import { useEffect } from "react"
import { useGame } from "./hooks/useGame"
import { GameBoard } from "./components/GameBoard"
import { Keyboard } from "./components/Keyboard"
import { ThemeSelector } from "./components/ThemeSelector"
import { Button } from "@/components/ui/button"

const themeNames = {
  ai: "AI & Technology",
  music: "Music",
  sports: "Sports",
  math: "Mathematics",
}

export default function AIWordGuesser() {
  const {
    gameState,
    addLetter,
    removeLetter,
    submitGuess,
    resetGame,
    playAgainSameTheme,
    selectTheme,
    showThemeSelector,
    isSubmitting,
    isValidating,
    isLoadingWords,
    keyboardState,
  } = useGame()

  // Handle physical keyboard input
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (showThemeSelector || gameState.gameStatus !== "playing" || isSubmitting || isValidating) return

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
  }, [showThemeSelector, gameState.gameStatus, addLetter, removeLetter, submitGuess, isSubmitting, isValidating])

  if (showThemeSelector) {
    return <ThemeSelector onSelectTheme={selectTheme} isLoading={isLoadingWords} />
  }

  if (isLoadingWords) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading words...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold text-gray-900">AI Word Guesser</h1>
              <p className="text-gray-600 mt-1">
                {themeNames[gameState.theme]} • {gameState.currentWord.length} letters
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={resetGame} className="ml-4 bg-transparent">
              Change Theme
            </Button>
          </div>
          {isValidating && <p className="text-center text-blue-600 mt-1 text-sm">Validating word...</p>}
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
            <div className="flex gap-2 justify-center mt-4">
              <Button onClick={playAgainSameTheme}>Play Again ({themeNames[gameState.theme]})</Button>
              <Button variant="outline" onClick={resetGame}>
                Change Theme
              </Button>
            </div>
          </div>
        )}

        {/* Keyboard */}
        <Keyboard
          onLetterClick={addLetter}
          onEnterClick={submitGuess}
          onBackspaceClick={removeLetter}
          keyboardState={keyboardState}
        />

        {/* Game Info */}
        <div className="text-center p-4 text-gray-600">
          <p>
            Attempts: {gameState.currentRow} / {gameState.maxAttempts}
          </p>
          <p className="text-sm mt-2">🟩 Correct position • 🟨 Wrong position • ⬜ Not in word</p>
          <p className="text-xs mt-1 text-gray-500">Any valid English word accepted for guesses</p>
        </div>
      </main>
    </div>
  )
}
