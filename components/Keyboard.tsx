"use client"

import type React from "react"

interface KeyboardProps {
  onLetterClick: (letter: string) => void
  onEnterClick: () => void
  onBackspaceClick: () => void
}

export function Keyboard({ onLetterClick, onEnterClick, onBackspaceClick }: KeyboardProps) {
  const topRow = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"]
  const middleRow = ["A", "S", "D", "F", "G", "H", "J", "K", "L"]
  const bottomRow = ["Z", "X", "C", "V", "B", "N", "M"]

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
        px-3 py-4 bg-gray-200 hover:bg-gray-300 rounded font-semibold text-sm
        transition-colors duration-150 active:bg-gray-400
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
          <KeyButton key={letter} onClick={() => onLetterClick(letter)}>
            {letter}
          </KeyButton>
        ))}
      </div>

      {/* Middle Row */}
      <div className="flex gap-1 mb-2 justify-center">
        {middleRow.map((letter) => (
          <KeyButton key={letter} onClick={() => onLetterClick(letter)}>
            {letter}
          </KeyButton>
        ))}
      </div>

      {/* Bottom Row */}
      <div className="flex gap-1 justify-center">
        <KeyButton onClick={onEnterClick} className="px-6">
          ENTER
        </KeyButton>
        {bottomRow.map((letter) => (
          <KeyButton key={letter} onClick={() => onLetterClick(letter)}>
            {letter}
          </KeyButton>
        ))}
        <KeyButton onClick={onBackspaceClick} className="px-6">
          ⌫
        </KeyButton>
      </div>
    </div>
  )
}
