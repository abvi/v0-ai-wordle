import type { Letter } from "../types/game"

export function checkGuess(guess: string, targetWord: string): Letter[] {
  const result: Letter[] = []
  const targetLetters = targetWord.split("")
  const guessLetters = guess.split("")

  // First pass: mark correct positions
  const remainingTarget: string[] = []
  const remainingGuess: { char: string; index: number }[] = []

  for (let i = 0; i < guessLetters.length; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      result[i] = { char: guessLetters[i], state: "correct" }
    } else {
      remainingTarget.push(targetLetters[i])
      remainingGuess.push({ char: guessLetters[i], index: i })
      result[i] = { char: guessLetters[i], state: "absent" }
    }
  }

  // Second pass: mark present letters
  for (const { char, index } of remainingGuess) {
    const targetIndex = remainingTarget.indexOf(char)
    if (targetIndex !== -1) {
      result[index].state = "present"
      remainingTarget.splice(targetIndex, 1)
    }
  }

  return result
}

export function isGameWon(guess: Letter[]): boolean {
  return guess.every((letter) => letter.state === "correct")
}
