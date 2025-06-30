import type { LetterState } from "@/types/game"

export function checkGuess(guess: string, target: string): { char: string; state: LetterState }[] {
  const result: { char: string; state: LetterState }[] = []
  const targetChars = target.split("")
  const guessChars = guess.split("")

  // First pass: mark correct positions
  const targetCharCount: Record<string, number> = {}
  const usedPositions = new Set<number>()

  // Count characters in target
  targetChars.forEach((char) => {
    targetCharCount[char] = (targetCharCount[char] || 0) + 1
  })

  // First pass: find correct positions
  guessChars.forEach((char, index) => {
    if (char === targetChars[index]) {
      result[index] = { char, state: "correct" }
      targetCharCount[char]--
      usedPositions.add(index)
    }
  })

  // Second pass: find present positions
  guessChars.forEach((char, index) => {
    if (usedPositions.has(index)) return // Already marked as correct

    if (targetCharCount[char] > 0) {
      result[index] = { char, state: "present" }
      targetCharCount[char]--
    } else {
      result[index] = { char, state: "absent" }
    }
  })

  return result
}

export function isGameWon(guessResult: { char: string; state: LetterState }[]): boolean {
  return guessResult.every(({ state }) => state === "correct")
}
