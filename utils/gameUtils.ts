import type { Letter, LetterState } from "../types/game"

export function checkGuess(guess: string, targetWord: string): Letter[] {
  const result: Letter[] = []
  const target = targetWord.toUpperCase()
  const guessUpper = guess.toUpperCase()

  // Count letter frequencies in target word
  const targetLetterCount: Record<string, number> = {}
  for (const char of target) {
    targetLetterCount[char] = (targetLetterCount[char] || 0) + 1
  }

  // First pass: mark correct positions
  const tempResult: Letter[] = guessUpper.split("").map((char, index) => ({
    char,
    state: "absent" as LetterState,
  }))

  for (let i = 0; i < guessUpper.length; i++) {
    if (guessUpper[i] === target[i]) {
      tempResult[i].state = "correct"
      targetLetterCount[guessUpper[i]]--
    }
  }

  // Second pass: mark present letters
  for (let i = 0; i < guessUpper.length; i++) {
    if (tempResult[i].state === "absent" && targetLetterCount[guessUpper[i]] > 0) {
      tempResult[i].state = "present"
      targetLetterCount[guessUpper[i]]--
    }
  }

  return tempResult
}

export function isGameWon(guess: Letter[]): boolean {
  return guess.every((letter) => letter.state === "correct")
}
