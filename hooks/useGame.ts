"use client"

import { useState, useCallback } from "react"
import type { GameState, LetterState, KeyboardState, WordTheme } from "@/types/game"
import { checkGuess, getRandomWord } from "@/utils/gameUtils"

const INITIAL_KEYBOARD_STATE: KeyboardState = {}

export function useGame() {
  const [gameState, setGameState] = useState<GameState>({
    currentWord: "",
    guesses: [],
    currentGuess: "",
    currentRow: 0,
    gameStatus: "playing",
    maxAttempts: 6,
    theme: "ai",
  })

  const [keyboardState, setKeyboardState] = useState<KeyboardState>(INITIAL_KEYBOARD_STATE)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [isLoadingWords, setIsLoadingWords] = useState(false)
  const [wordDatabase, setWordDatabase] = useState<Record<number, string[]>>({})
  const [showThemeSelector, setShowThemeSelector] = useState(true)

  // Load words from API when theme changes
  const loadWordsForTheme = useCallback(async (theme: WordTheme) => {
    setIsLoadingWords(true)
    try {
      const response = await fetch(`/api/words?theme=${theme}`)
      const data = await response.json()

      if (data.words) {
        setWordDatabase(data.words)
        const randomWord = getRandomWord(data.words)
        setGameState((prev) => ({
          ...prev,
          currentWord: randomWord,
          theme: theme,
          guesses: [],
          currentGuess: "",
          currentRow: 0,
          gameStatus: "playing",
        }))
      }
    } catch (error) {
      console.error("Failed to load words:", error)
      // Fallback to a simple word if API fails
      setGameState((prev) => ({ ...prev, currentWord: "MODEL" }))
    } finally {
      setIsLoadingWords(false)
    }
  }, [])

  const selectTheme = useCallback(
    (theme: WordTheme) => {
      setShowThemeSelector(false)
      setKeyboardState(INITIAL_KEYBOARD_STATE)
      loadWordsForTheme(theme)
    },
    [loadWordsForTheme],
  )

  const addLetter = useCallback(
    (letter: string) => {
      if (gameState.gameStatus !== "playing" || isSubmitting || isValidating) return

      setGameState((prev) => {
        if (prev.currentGuess.length >= prev.currentWord.length) return prev
        return {
          ...prev,
          currentGuess: prev.currentGuess + letter.toUpperCase(),
        }
      })
    },
    [gameState.gameStatus, isSubmitting, isValidating],
  )

  const removeLetter = useCallback(() => {
    if (gameState.gameStatus !== "playing" || isSubmitting || isValidating) return

    setGameState((prev) => ({
      ...prev,
      currentGuess: prev.currentGuess.slice(0, -1),
    }))
  }, [gameState.gameStatus, isSubmitting, isValidating])

  const updateKeyboardState = useCallback((guess: string, results: LetterState[]) => {
    setKeyboardState((prev) => {
      const newState = { ...prev }

      for (let i = 0; i < guess.length; i++) {
        const letter = guess[i]
        const result = results[i]

        // Only update if the new state is "better" than the current state
        if (
          !newState[letter] ||
          (newState[letter] === "absent" && result !== "absent") ||
          (newState[letter] === "present" && result === "correct")
        ) {
          newState[letter] = result
        }
      }

      return newState
    })
  }, [])

  const submitGuess = useCallback(async () => {
    if (
      gameState.gameStatus !== "playing" ||
      gameState.currentGuess.length !== gameState.currentWord.length ||
      isSubmitting ||
      isValidating
    ) {
      return
    }

    setIsValidating(true)

    try {
      // Validate the word with OpenAI
      const response = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: gameState.currentGuess }),
      })

      const data = await response.json()

      if (!data.isValid) {
        // Word is not valid, show error and return
        alert("Not a valid word!")
        setIsValidating(false)
        return
      }

      // Word is valid, proceed with submission
      setIsValidating(false)
      setIsSubmitting(true)

      const results = checkGuess(gameState.currentGuess, gameState.currentWord)

      // Store the current guess and results for animation
      const currentGuess = gameState.currentGuess

      // Update keyboard state immediately
      updateKeyboardState(currentGuess, results)

      // Add the guess to the guesses array immediately
      setGameState((prev) => ({
        ...prev,
        guesses: [...prev.guesses, { word: currentGuess, results }],
        currentGuess: "",
      }))

      // Wait for animation to complete before updating game state
      setTimeout(
        () => {
          setGameState((prev) => {
            const isWin = results.every((result) => result === "correct")
            const isLoss = prev.currentRow + 1 >= prev.maxAttempts && !isWin

            return {
              ...prev,
              currentRow: prev.currentRow + 1,
              gameStatus: isWin ? "won" : isLoss ? "lost" : "playing",
            }
          })
          setIsSubmitting(false)
        },
        results.length * 150 + 300,
      ) // Animation duration + buffer
    } catch (error) {
      console.error("Error validating word:", error)
      setIsValidating(false)
      alert("Error validating word. Please try again.")
    }
  }, [gameState, isSubmitting, isValidating, updateKeyboardState])

  const resetGame = useCallback(() => {
    setShowThemeSelector(true)
    setGameState({
      currentWord: "",
      guesses: [],
      currentGuess: "",
      currentRow: 0,
      gameStatus: "playing",
      maxAttempts: 6,
      theme: "ai",
    })
    setKeyboardState(INITIAL_KEYBOARD_STATE)
    setIsSubmitting(false)
    setIsValidating(false)
    setWordDatabase({})
  }, [])

  const playAgainSameTheme = useCallback(() => {
    const randomWord = getRandomWord(wordDatabase)
    setGameState((prev) => ({
      ...prev,
      currentWord: randomWord,
      guesses: [],
      currentGuess: "",
      currentRow: 0,
      gameStatus: "playing",
    }))
    setKeyboardState(INITIAL_KEYBOARD_STATE)
    setIsSubmitting(false)
    setIsValidating(false)
  }, [wordDatabase])

  return {
    gameState,
    keyboardState,
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
  }
}
