export type LetterState = "correct" | "present" | "absent"

export type GameStatus = "playing" | "won" | "lost"

export interface GameState {
  currentWord: string
  guesses: Array<{ word: string; results: LetterState[] }>
  currentGuess: string
  currentRow: number
  gameStatus: GameStatus
  maxAttempts: number
}

export type KeyboardState = Record<string, LetterState>
