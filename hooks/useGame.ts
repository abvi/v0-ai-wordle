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
      isSubmitting: false,
    }
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const addLetter = useCallback(
    (letter: string) => {
      if (gameState.gameStatus !== "playing") return

      setGameState((prev) => {
        if (prev.currentGuess.length >= prev.currentWord.length) return prev

        return {
          ...prev,
          currentGuess: prev.currentGuess + letter.toUpperCase(),
        }
      })
    },
    [gameState.gameStatus],
  )

  const removeLetter = useCallback(() => {
    if (gameState.gameStatus !== "playing") return

    setGameState((prev) => ({
      ...prev,
      currentGuess: prev.currentGuess.slice(0, -1),
    }))
  }, [gameState.gameStatus])

  const submitGuess = useCallback(async () => {
    if (gameState.gameStatus !== "playing") return
    if (gameState.currentGuess.length !== gameState.currentWord.length) return
    if (!isValidWord(gameState.currentGuess)) {
      alert("All guesses must be AI related words! Please try again.")
      return
    }

    setIsSubmitting(true)

    // Wait for animation to complete before updating game state
    setTimeout(
      () => {
        setGameState((prev) => {
          const guessResult = checkGuess(prev.currentGuess, prev.currentWord)
          const newGuesses = [...prev.guesses]
          newGuesses[prev.currentRow] = guessResult

          const won = isGameWon(guessResult)
          const lost = !won && prev.currentRow >= prev.maxAttempts - 1

          let newStatus: GameStatus = "playing"
          if (won) newStatus = "won"
          else if (lost) newStatus = "lost"

          return {
            ...prev,
            guesses: newGuesses,
            currentGuess: "",
            currentRow: prev.currentRow + 1,
            gameStatus: newStatus,
          }
        })

        setIsSubmitting(false)
      },
      gameState.currentWord.length * 150 + 300,
    ) // Animation duration + buffer
  }, [gameState.gameStatus, gameState.currentGuess, gameState.currentWord.length])

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
