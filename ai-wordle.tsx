"use client"

import { useEffect } from "react"
import { useGame } from "@/hooks/useGame"
import { GameBoard } from "@/components/GameBoard"
import { Keyboard } from "@/components/Keyboard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isSubmitting || isValidating) return

      const key = event.key.toUpperCase()

      if (key === "ENTER") {
        event.preventDefault()
        submitGuess()
      } else if (key === "BACKSPACE") {
        event.preventDefault()
        removeLetter()
      } else if (/^[A-Z]$/.test(key)) {
        event.preventDefault()
        addLetter(key)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [addLetter, removeLetter, submitGuess, isSubmitting, isValidating])

  if (isLoadingWords) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading AI words...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStatusMessage = () => {
    if (isValidating) return "Validating word..."
    if (isSubmitting) return "Checking guess..."
    if (gameState.gameStatus === "won") return `Congratulations! The word was "${gameState.currentWord}"`
    if (gameState.gameStatus === "lost") return `Game over! The word was "${gameState.currentWord}"`
    return `Guess the ${gameState.currentWord.length}-letter AI word!`
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-800">AI Wordle</CardTitle>
            <p className="text-gray-600 mt-2">{getStatusMessage()}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <GameBoard gameState={gameState} isSubmitting={isSubmitting} />

            <Keyboard
              onKeyPress={addLetter}
              onEnter={submitGuess}
              onBackspace={removeLetter}
              keyboardState={keyboardState}
              disabled={isSubmitting || isValidating || gameState.gameStatus !== "playing"}
            />

            {(gameState.gameStatus === "won" || gameState.gameStatus === "lost") && (
              <div className="text-center">
                <Button onClick={resetGame} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Play Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
