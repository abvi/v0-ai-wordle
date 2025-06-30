"use client"

import { Button } from "@/components/ui/button"
import type { LetterState } from "@/types/game"

interface KeyboardProps {
  onKeyPress: (key: string) => void
  onEnter: () => void
  onBackspace: () => void
  keyboardState: Record<string, LetterState>
  disabled?: boolean
}

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
]

export function Keyboard({ onKeyPress, onEnter, onBackspace, keyboardState, disabled = false }: KeyboardProps) {
  const getKeyStyle = (key: string) => {
    const state = keyboardState[key]
    const baseClasses = "h-12 font-semibold text-sm transition-all duration-200 active:scale-95"

    switch (state) {
      case "correct":
        return `${baseClasses} bg-green-500 hover:bg-green-600 text-white border-green-500`
      case "present":
        return `${baseClasses} bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500`
      case "absent":
        return `${baseClasses} bg-gray-500 hover:bg-gray-600 text-white border-gray-500`
      default:
        return `${baseClasses} bg-gray-200 hover:bg-gray-300 text-gray-800 border-gray-300`
    }
  }

  const handleKeyClick = (key: string) => {
    if (disabled) return

    if (key === "ENTER") {
      onEnter()
    } else if (key === "BACKSPACE") {
      onBackspace()
    } else {
      onKeyPress(key)
    }
  }

  return (
    <div className="flex flex-col gap-2 max-w-lg mx-auto">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1 justify-center">
          {row.map((key) => (
            <Button
              key={key}
              onClick={() => handleKeyClick(key)}
              disabled={disabled}
              className={`${getKeyStyle(key)} ${
                key === "ENTER" || key === "BACKSPACE" ? "px-3 min-w-[60px]" : "w-10 px-0"
              }`}
              variant="outline"
            >
              {key === "BACKSPACE" ? "⌫" : key}
            </Button>
          ))}
        </div>
      ))}
    </div>
  )
}
