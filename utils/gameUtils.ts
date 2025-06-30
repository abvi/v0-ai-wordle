import type { Letter } from "@/types/game"

export function checkGuess(guess: string, target: string): Letter[] {
  const result: Letter[] = []
  const targetLetters = target.split("")
  const guessLetters = guess.split("")

  // First pass: mark correct positions
  const targetCounts: Record<string, number> = {}
  for (let i = 0; i < targetLetters.length; i++) {
    const letter = targetLetters[i]
    targetCounts[letter] = (targetCounts[letter] || 0) + 1
  }

  // Initialize result array
  for (let i = 0; i < guessLetters.length; i++) {
    result[i] = { char: guessLetters[i], state: "absent" }
  }

  // First pass: mark correct positions and reduce counts
  for (let i = 0; i < guessLetters.length; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      result[i].state = "correct"
      targetCounts[guessLetters[i]]--
    }
  }

  // Second pass: mark present positions
  for (let i = 0; i < guessLetters.length; i++) {
    if (result[i].state === "absent" && targetCounts[guessLetters[i]] > 0) {
      result[i].state = "present"
      targetCounts[guessLetters[i]]--
    }
  }

  return result
}

export function isGameWon(guess: Letter[]): boolean {
  return guess.every((letter) => letter.state === "correct")
}
