export type LetterState = "correct" | "present" | "absent" | "empty"

export type GameStatus = "playing" | "won" | "lost"

export interface Letter {
  char: string
  state: LetterState
}

export interface GameState {
  currentWord: string
  guesses: Letter[][]
  currentGuess: string
  currentRow: number
  gameStatus: GameStatus
  maxAttempts: number
}
