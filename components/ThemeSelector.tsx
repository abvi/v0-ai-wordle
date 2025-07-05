"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { WordTheme } from "@/types/game"

interface ThemeSelectorProps {
  onSelectTheme: (theme: WordTheme) => void
  isLoading: boolean
}

const themes = [
  {
    id: "ai" as const,
    name: "AI & Technology",
    description: "Words related to artificial intelligence, programming, and technology",
    icon: "🤖",
    examples: "API, CODE, NEURAL, PYTHON",
  },
  {
    id: "music" as const,
    name: "Music",
    description: "Musical instruments, genres, terms, and artists",
    icon: "🎵",
    examples: "PIANO, JAZZ, CHORD, MELODY",
  },
  {
    id: "sports" as const,
    name: "Sports",
    description: "Sports, games, equipment, and athletic terms",
    icon: "⚽",
    examples: "SOCCER, TENNIS, GOAL, TEAM",
  },
  {
    id: "math" as const,
    name: "Mathematics",
    description: "Numbers, shapes, operations, and mathematical concepts",
    icon: "🔢",
    examples: "ANGLE, CIRCLE, PRIME, GRAPH",
  },
]

export function ThemeSelector({ onSelectTheme, isLoading }: ThemeSelectorProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">AI Word Guesser</CardTitle>
          <p className="text-gray-600 mt-2">Choose a theme to start playing!</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {themes.map((theme) => (
              <Button
                key={theme.id}
                variant="outline"
                className="h-auto p-6 flex flex-col items-start text-left hover:bg-blue-50 hover:border-blue-300 transition-colors bg-transparent"
                onClick={() => onSelectTheme(theme.id)}
                disabled={isLoading}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{theme.icon}</span>
                  <h3 className="text-lg font-semibold text-gray-900">{theme.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">{theme.description}</p>
                <div className="text-xs text-gray-500">
                  <span className="font-medium">Examples: </span>
                  {theme.examples}
                </div>
              </Button>
            ))}
          </div>
          {isLoading && (
            <div className="text-center mt-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading words...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
