"use client"

import type { KeyboardState } from "@/types/game"

interface KeyboardProps {
  onLetterClick: (letter: string) => void
  onEnterClick: () => void
  onBackspaceClick: () => void
  keyboardState: KeyboardState
}

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
]

export function Keyboard({ onLetterClick, onEnterClick, onBackspaceClick, keyboardState }: KeyboardProps) {
  const getKeyStyle = (key: string) => {
    const state = keyboardState[key]
    const baseStyle = "h-12 rounded font-semibold text-sm transition-all duration-200 active:scale-95"

    if (key === "ENTER" || key === "BACKSPACE") {
      return `${baseStyle} px-3 bg-gray-300 hover:bg-gray-400 text-gray-800`
    }

    switch (state) {
      case "correct":
        return `${baseStyle} px-4 bg-green-500 hover:bg-green-600 text-white`
      case "present":
        return `${baseStyle} px-4 bg-yellow-500 hover:bg-yellow-600 text-white`
      case "absent":
        return `${baseStyle} px-4 bg-gray-500 hover:bg-gray-600 text-white`
      default:
        return `${baseStyle} px-4 bg-gray-200 hover:bg-gray-300 text-gray-800`
    }
  }

  const handleKeyClick = (key: string) => {
    if (key === "ENTER") {
      onEnterClick()
    } else if (key === "BACKSPACE") {
      onBackspaceClick()
    } else {
      onLetterClick(key)
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      <div className="space-y-2">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1">
            {row.map((key) => (
              <button key={key} onClick={() => handleKeyClick(key)} className={getKeyStyle(key)}>
                {key === "BACKSPACE" ? "⌫" : key}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
