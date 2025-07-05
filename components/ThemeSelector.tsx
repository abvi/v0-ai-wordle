"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { WordTheme } from "@/types/game"

interface ThemeSelectorProps {
  onSelectTheme: (theme: WordTheme) => void
  isLoading: boolean
}

const themes = [
  {
    id: "ai" as WordTheme,
    name: "AI & Technology",
    icon: "🤖",
    description: "Programming, AI/ML, tech companies",
    examples: "API, CODE, NEURAL, PYTHON",
  },
  {
    id: "music" as WordTheme,
    name: "Music",
    icon: "🎵",
    description: "Instruments, genres, musical terms",
    examples: "PIANO, JAZZ, MELODY, GUITAR",
  },
  {
    id: "sports" as WordTheme,
    name: "Sports",
    icon: "⚽",
    description: "Sports, equipment, athletic terms",
    examples: "SOCCER, TENNIS, ATHLETE, STADIUM",
  },
  {
    id: "math" as WordTheme,
    name: "Mathematics",
    icon: "🔢",
    description: "Numbers, shapes, operations",
    examples: "ANGLE, GRAPH, VECTOR, FORMULA",
  },
]

export function ThemeSelector({ onSelectTheme, isLoading }: ThemeSelectorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Word Guesser</h1>
          <p className="text-lg text-gray-600">Choose your theme to start playing!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {themes.map((theme) => (
            <Card
              key={theme.id}
              className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-blue-300"
              onClick={() => !isLoading && onSelectTheme(theme.id)}
            >
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">{theme.icon}</div>
                <CardTitle className="text-xl">{theme.name}</CardTitle>
                <CardDescription>{theme.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-gray-500 mb-4">Examples: {theme.examples}</p>
                <Button
                  className="w-full"
                  disabled={isLoading}
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectTheme(theme.id)
                  }}
                >
                  {isLoading ? "Loading..." : "Play"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
