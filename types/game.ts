export type LetterState = "empty" | "filled" | "correct" | "present" | "absent"

export interface GameState {
  currentWord: string
  guesses: { char: string; state: LetterState }[][]
  currentGuess: string
  currentRow: number
  gameStatus: GameStatus
  maxAttempts: number
}

export type GameStatus = "playing" | "won" | "lost"
