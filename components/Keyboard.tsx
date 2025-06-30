"use client"

import type React from "react"
import type { LetterState } from "@/types/game"

interface KeyboardProps {
  onLetterClick: (letter: string) => void
  onEnterClick: () => void
  onBackspaceClick: () => void
  keyboardState: Record<string, LetterState>
}

export function Keyboard({ onLetterClick, onEnterClick, onBackspaceClick, keyboardState }: KeyboardProps) {
  const topRow = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"]
  const middleRow = ["A", "S", "D", "F", "G", "H", "J", "K", "L"]
  const bottomRow = ["Z", "X", "C", "V", "B", "N", "M"]

  const getKeyColor = (letter: string): string => {
    const state = keyboardState[letter]
    switch (state) {
      case "correct":
        return "bg-green-500 hover:bg-green-600 text-white"
      case "present":
        return "bg-yellow-500 hover:bg-yellow-600 text-white"
      case "absent":
        return "bg-gray-500 hover:bg-gray-600 text-white"
      default:
        return "bg-gray-200 hover:bg-gray-300 text-black"
    }
  }

  const KeyButton = ({
    children,
    onClick,
    className = "",
  }: {
    children: React.ReactNode
    onClick: () => void
    className?: string
  }) => (
    <button
      onClick={onClick}
      className={`
        px-3 py-4 rounded font-semibold text-sm
        transition-colors duration-150 active:scale-95
        ${className}
      `}
    >
      {children}
    </button>
  )

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      {/* Top Row */}
      <div className="flex gap-1 mb-2 justify-center">
        {topRow.map((letter) => (
          <KeyButton key={letter} onClick={() => onLetterClick(letter)} className={getKeyColor(letter)}>
            {letter}
          </KeyButton>
        ))}
      </div>

      {/* Middle Row */}
      <div className="flex gap-1 mb-2 justify-center">
        {middleRow.map((letter) => (
          <KeyButton key={letter} onClick={() => onLetterClick(letter)} className={getKeyColor(letter)}>
            {letter}
          </KeyButton>
        ))}
      </div>

      {/* Bottom Row */}
      <div className="flex gap-1 justify-center">
        <KeyButton onClick={onEnterClick} className="px-6 bg-gray-200 hover:bg-gray-300 text-black">
          ENTER
        </KeyButton>
        {bottomRow.map((letter) => (
          <KeyButton key={letter} onClick={() => onLetterClick(letter)} className={getKeyColor(letter)}>
            {letter}
          </KeyButton>
        ))}
        <KeyButton onClick={onBackspaceClick} className="px-6 bg-gray-200 hover:bg-gray-300 text-black">
          ⌫
        </KeyButton>
      </div>
    </div>
  )
}
