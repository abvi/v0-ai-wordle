"use client"

interface KeyboardProps {
  onLetterClick: (letter: string) => void
  onEnterClick: () => void
  onBackspaceClick: () => void
}

export function Keyboard({ onLetterClick, onEnterClick, onBackspaceClick }: KeyboardProps) {
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
  ]

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
    <div className="p-4">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1 justify-center mb-2">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => handleKeyClick(key)}
              className={`
                px-3 py-4 bg-gray-200 hover:bg-gray-300 rounded font-semibold
                transition-colors duration-150 text-sm
                ${key === "ENTER" || key === "BACKSPACE" ? "px-4" : "min-w-[40px]"}
              `}
            >
              {key === "BACKSPACE" ? "⌫" : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}
