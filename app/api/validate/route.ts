import { type NextRequest, NextResponse } from "next/server"
import { validateWord } from "@/lib/openai-server"

export async function POST(request: NextRequest) {
  try {
    const { word } = await request.json()

    if (!word || typeof word !== "string") {
      return NextResponse.json({ error: "Invalid word provided" }, { status: 400 })
    }

    const isValid = await validateWord(word.toUpperCase())
    return NextResponse.json({ isValid })
  } catch (error) {
    console.error("Error in /api/validate:", error)
    return NextResponse.json({ error: "Failed to validate word" }, { status: 500 })
  }
}
