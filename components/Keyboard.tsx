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
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
]

export function Keyboard({ onLetterClick, onEnterClick, onBackspaceClick, keyboardState }: KeyboardProps) {
  const getKeyClass = (key: string) => {
    const baseClass = "h-12 font-semibold text-sm transition-all duration-200 hover:scale-105"

    if (key === "ENTER" || key === "⌫") {
      return `${baseClass} px-4 bg-gray-600 text-white hover:bg-gray-700`
    }

    const state = keyboardState[key]
    switch (state) {
      case "correct":
        return `${baseClass} w-10 bg-green-500 text-white hover:bg-green-600`
      case "present":
        return `${baseClass} w-10 bg-yellow-500 text-white hover:bg-yellow-600`
      case "absent":
        return `${baseClass} w-10 bg-gray-500 text-white hover:bg-gray-600`
      default:
        return `${baseClass} w-10 bg-gray-200 text-gray-900 hover:bg-gray-300`
    }
  }

  const handleKeyClick = (key: string) => {
    if (key === "ENTER") {
      onEnterClick()
    } else if (key === "⌫") {
      onBackspaceClick()
    } else {
      onLetterClick(key)
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      <div className="space-y-2">
        {keyboardRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 justify-center">
            {row.map((key) => (
              <Button key={key} variant="outline" className={getKeyClass(key)} onClick={() => handleKeyClick(key)}>
                {key}
              </Button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
