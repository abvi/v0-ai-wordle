"use client"

import { Button } from "@/components/ui/button"
import type { KeyboardState } from "@/types/game"

interface KeyboardProps {
  onLetterClick: (letter: string) => void
  onEnterClick: () => void
  onBackspaceClick: () => void
  keyboardState: KeyboardState
}

const keyboardRows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
]

export function Keyboard({ onLetterClick, onEnterClick, onBackspaceClick, keyboardState }: KeyboardProps) {
  const getKeyClass = (key: string) => {
    const baseClass = "h-12 font-semibold text-sm rounded transition-colors duration-200"
    const state = keyboardState[key]

    if (key === "ENTER" || key === "BACKSPACE") {
      return `${baseClass} px-4 bg-gray-600 text-white hover:bg-gray-700`
    }

    switch (state) {
      case "correct":
        return `${baseClass} w-10 bg-green-500 text-white`
      case "present":
        return `${baseClass} w-10 bg-yellow-500 text-white`
      case "absent":
        return `${baseClass} w-10 bg-gray-500 text-white`
      default:
        return `${baseClass} w-10 bg-gray-200 text-gray-900 hover:bg-gray-300`
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
    <div className="flex flex-col gap-2 p-4">
      {keyboardRows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1 justify-center">
          {row.map((key) => (
            <Button key={key} className={getKeyClass(key)} onClick={() => handleKeyClick(key)} variant="ghost">
              {key === "BACKSPACE" ? "⌫" : key}
            </Button>
          ))}
        </div>
      ))}
    </div>
  )
}
