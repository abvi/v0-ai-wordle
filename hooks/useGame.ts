"use client"

import { useState, useCallback, useEffect } from "react"
import type { GameState, GameStatus, LetterState } from "@/types/game"
import { checkGuess, isGameWon } from "@/utils/gameUtils"

export function useGame() {
  const [wordList, setWordList] = useState<Record<number, string[]>>({})
  const [isLoadingWords, setIsLoadingWords] = useState(true)
  const [keyboardState, setKeyboardState] = useState<Record<string, LetterState>>({})

  const [gameState, setGameState] = useState<GameState>({
    currentWord: "",
    guesses: [],
    currentGuess: "",
    currentRow: 0,
    gameStatus: "playing",
    maxAttempts: 6,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isValidating, setIsValidating] = useState(false)

  const getRandomWord = (store: Record<number, string[]>): string => {
    const lengths = Object.keys(store).map(Number)
    const len = lengths[Math.floor(Math.random() * lengths.length)]
    const bucket = store[len]
    return bucket[Math.floor(Math.random() * bucket.length)]
  }

  const updateKeyboardState = useCallback((guess: string, result: { char: string; state: LetterState }[]) => {
    setKeyboardState((prev) => {
      const newState = { ...prev }

      result.forEach(({ char, state }) => {
        const currentState = newState[char]

        // Priority: correct > present > absent
        // Don't downgrade a key's state
        if (state === "correct") {
          newState[char] = "correct"
        } else if (state === "present" && currentState !== "correct") {
          newState[char] = "present"
        } else if (state === "absent" && !currentState) {
          newState[char] = "absent"
        }
      })

      return newState
    })
  }, [])

  useEffect(() => {
    const boot = async () => {
      setIsLoadingWords(true)
      try {
        const res = await fetch("/api/words")
        const json = (await res.json()) as { words: Record<number, string[]> }
        setWordList(json.words)

        const first = getRandomWord(json.words)
        setGameState({
          currentWord: first,
          guesses: Array(6)
            .fill(null)
            .map(() => Array(first.length).fill({ char: "", state: "empty" })),
          currentGuess: "",
          currentRow: 0,
          gameStatus: "playing",
          maxAttempts: 6,
        })
      } catch (err) {
        console.error("Failed to load word list, cannot continue.", err)
      } finally {
        setIsLoadingWords(false)
      }
    }

    boot()
  }, [])

  const addLetter = useCallback(
    (l: string) => {
      if (gameState.gameStatus !== "playing" || isSubmitting || isValidating) return
      if (gameState.currentGuess.length >= gameState.currentWord.length) return
      setGameState((s) => ({ ...s, currentGuess: s.currentGuess + l.toUpperCase() }))
    },
    [gameState, isSubmitting, isValidating],
  )

  const removeLetter = useCallback(() => {
    if (gameState.gameStatus !== "playing" || isSubmitting || isValidating) return
    setGameState((s) => ({ ...s, currentGuess: s.currentGuess.slice(0, -1) }))
  }, [gameState, isSubmitting, isValidating])

  const submitGuess = useCallback(async () => {
    if (
      gameState.gameStatus !== "playing" ||
      isSubmitting ||
      isValidating ||
      gameState.currentGuess.length !== gameState.currentWord.length
    )
      return

    setIsValidating(true)
    try {
      const res = await fetch(`/api/validate?word=${encodeURIComponent(gameState.currentGuess)}`)
      const json = (await res.json()) as { valid: boolean }
      if (!json.valid) {
        alert("Not a valid English word. Please try another word!")
        setIsValidating(false)
        return
      }
    } catch (err) {
      console.error("Validation failed, allowing word for now.", err)
    }
    setIsValidating(false)

    setIsSubmitting(true)
    const result = checkGuess(gameState.currentGuess, gameState.currentWord)
    const newGuesses = [...gameState.guesses]
    newGuesses[gameState.currentRow] = result
    setGameState((s) => ({ ...s, guesses: newGuesses }))

    // Update keyboard state with the new guess results
    updateKeyboardState(gameState.currentGuess, result)

    setTimeout(
      () => {
        const won = isGameWon(result)
        const lost = !won && gameState.currentRow >= gameState.maxAttempts - 1
        const status: GameStatus = won ? "won" : lost ? "lost" : "playing"

        setGameState((s) => ({
          ...s,
          currentGuess: "",
          currentRow: s.currentRow + 1,
          gameStatus: status,
        }))
        setIsSubmitting(false)
      },
      gameState.currentWord.length * 150 + 300,
    )
  }, [gameState, isSubmitting, isValidating, updateKeyboardState])

  const resetGame = useCallback(() => {
    if (!Object.keys(wordList).length) return
    const next = getRandomWord(wordList)
    setGameState({
      currentWord: next,
      guesses: Array(6)
        .fill(null)
        .map(() => Array(next.length).fill({ char: "", state: "empty" })),
      currentGuess: "",
      currentRow: 0,
      gameStatus: "playing",
      maxAttempts: 6,
    })
    setIsSubmitting(false)
    setIsValidating(false)
    setKeyboardState({}) // Reset keyboard colors
  }, [wordList])

  return {
    gameState,
    addLetter,
    removeLetter,
    submitGuess,
    resetGame,
    isSubmitting,
    isValidating,
    isLoadingWords,
    keyboardState,
  }
}
