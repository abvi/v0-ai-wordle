"use client"

import { useState, useCallback } from "react"
import type { GameState, GameStatus } from "../types/game"
import { getRandomWord, isValidWord } from "../data/words"
import { checkGuess, isGameWon } from "../utils/gameUtils"

export function useGame() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const word = getRandomWord()
    return {
      currentWord: word,
      guesses: Array(6)
        .fill(null)
        .map(() => Array(word.length).fill({ char: "", state: "empty" })),
      currentGuess: "",
      currentRow: 0,
      gameStatus: "playing",
      maxAttempts: 6,
    }
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const addLetter = useCallback(
    (letter: string) => {
      if (gameState.gameStatus !== "playing" || isSubmitting) return

      setGameState((prev) => {
        if (prev.currentGuess.length >= prev.currentWord.length) return prev

        return {
          ...prev,
          currentGuess: prev.currentGuess + letter.toUpperCase(),
        }
      })
    },
    [gameState.gameStatus, isSubmitting],
  )

  const removeLetter = useCallback(() => {
    if (gameState.gameStatus !== "playing" || isSubmitting) return

    setGameState((prev) => ({
      ...prev,
      currentGuess: prev.currentGuess.slice(0, -1),
    }))
  }, [gameState.gameStatus, isSubmitting])

  const submitGuess = useCallback(() => {
    if (gameState.gameStatus !== "playing" || isSubmitting) return
    if (gameState.currentGuess.length !== gameState.currentWord.length) return

    setIsSubmitting(true)

    // First, calculate the guess result and update the guesses array
    const guessResult = checkGuess(gameState.currentGuess, gameState.currentWord)
    const newGuesses = [...gameState.guesses]
    newGuesses[gameState.currentRow] = guessResult

    // Update the game state immediately with the guess result
    setGameState((prev) => ({
      ...prev,
      guesses: newGuesses,
    }))

    // Wait for animation to complete before updating game status and row
    setTimeout(
      () => {
        const won = isGameWon(guessResult)
        const lost = !won && gameState.currentRow >= gameState.maxAttempts - 1

        let newStatus: GameStatus = "playing"
        if (won) newStatus = "won"
        else if (lost) newStatus = "lost"

        setGameState((prev) => ({
          ...prev,
          currentGuess: "",
          currentRow: prev.currentRow + 1,
          gameStatus: newStatus,
        }))

        setIsSubmitting(false)
      },
      gameState.currentWord.length * 150 + 300,
    ) // Animation duration + buffer
  }, [
    gameState.gameStatus,
    gameState.currentGuess,
    gameState.currentWord,
    gameState.currentRow,
    gameState.maxAttempts,
    isSubmitting,
  ])

  const resetGame = useCallback(() => {
    const word = getRandomWord()
    setGameState({
      currentWord: word,
      guesses: Array(6)
        .fill(null)
        .map(() => Array(word.length).fill({ char: "", state: "empty" })),
      currentGuess: "",
      currentRow: 0,
      gameStatus: "playing",
      maxAttempts: 6,
    })
    setIsSubmitting(false)
  }, [])

  return {
    gameState,
    addLetter,
    removeLetter,
    submitGuess,
    resetGame,
    isSubmitting,
  }
}
