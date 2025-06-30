"use client"

import { useState, useCallback, useEffect } from "react"
import type { GameState, GameStatus } from "@/types/game"
import { checkGuess, isGameWon } from "@/utils/gameUtils"

export function useGame() {
  /* ---------------- word list ---------------- */
  const [wordList, setWordList] = useState<Record<number, string[]>>({})
  const [isLoadingWords, setIsLoadingWords] = useState(true)

  /* ---------------- gameplay state ---------------- */
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

  /* ---------------- helpers ---------------- */
  const getRandomWord = (store: Record<number, string[]>): string => {
    const lengths = Object.keys(store).map(Number)
    const len = lengths[Math.floor(Math.random() * lengths.length)]
    const bucket = store[len]
    return bucket[Math.floor(Math.random() * bucket.length)]
  }

  /* ---------------- boot sequence ---------------- */
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

  /* ---------------- input handlers ---------------- */
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

    /* ---- 1) validate with API route ---- */
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

    /* ---- 2) reveal animation ---- */
    setIsSubmitting(true)
    const result = checkGuess(gameState.currentGuess, gameState.currentWord)
    const newGuesses = [...gameState.guesses]
    newGuesses[gameState.currentRow] = result
    setGameState((s) => ({ ...s, guesses: newGuesses }))

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
  }, [gameState, isSubmitting, isValidating])

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
  }, [wordList])

  /* ---------------- exports ---------------- */
  return {
    gameState,
    addLetter,
    removeLetter,
    submitGuess,
    resetGame,
    isSubmitting,
    isValidating,
    isLoadingWords,
  }
}
