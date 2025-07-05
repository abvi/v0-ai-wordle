import type { LetterState } from "@/types/game"

export function checkGuess(guess: string, target: string): LetterState[] {
  const result: LetterState[] = new Array(guess.length).fill("absent")
  const targetLetters = target.split("")
  const guessLetters = guess.split("")

  // First pass: mark correct positions
  for (let i = 0; i < guessLetters.length; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      result[i] = "correct"
      targetLetters[i] = "*" // Mark as used
      guessLetters[i] = "*" // Mark as used
    }
  }

  // Second pass: mark present letters
  for (let i = 0; i < guessLetters.length; i++) {
    if (guessLetters[i] !== "*") {
      const targetIndex = targetLetters.indexOf(guessLetters[i])
      if (targetIndex !== -1) {
        result[i] = "present"
        targetLetters[targetIndex] = "*" // Mark as used
      }
    }
  }

  return result
}

export function getRandomWord(wordDatabase: Record<number, string[]>): string {
  const lengths = Object.keys(wordDatabase)
    .map(Number)
    .filter((len) => len >= 3 && len <= 6)
  if (lengths.length === 0) return "MODEL" // Fallback

  const randomLength = lengths[Math.floor(Math.random() * lengths.length)]
  const wordsOfLength = wordDatabase[randomLength]

  if (!wordsOfLength || wordsOfLength.length === 0) return "MODEL" // Fallback

  return wordsOfLength[Math.floor(Math.random() * wordsOfLength.length)]
}
