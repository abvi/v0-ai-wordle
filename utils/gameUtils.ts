import type { LetterState } from "@/types/game"

export function checkGuess(guess: string, target: string): LetterState[] {
  const result: LetterState[] = new Array(guess.length).fill("absent")
  const targetChars = target.split("")
  const guessChars = guess.split("")

  // First pass: mark correct positions
  for (let i = 0; i < guessChars.length; i++) {
    if (guessChars[i] === targetChars[i]) {
      result[i] = "correct"
      targetChars[i] = "" // Mark as used
      guessChars[i] = "" // Mark as processed
    }
  }

  // Second pass: mark present letters
  for (let i = 0; i < guessChars.length; i++) {
    if (guessChars[i] && targetChars.includes(guessChars[i])) {
      result[i] = "present"
      const targetIndex = targetChars.indexOf(guessChars[i])
      targetChars[targetIndex] = "" // Mark as used
    }
  }

  return result
}

export function getRandomWord(wordDatabase: Record<number, string[]>): string {
  const lengths = Object.keys(wordDatabase)
    .map(Number)
    .filter((len) => wordDatabase[len]?.length > 0)
  if (lengths.length === 0) return "MODEL" // Fallback

  const randomLength = lengths[Math.floor(Math.random() * lengths.length)]
  const wordsOfLength = wordDatabase[randomLength]
  return wordsOfLength[Math.floor(Math.random() * wordsOfLength.length)]
}
