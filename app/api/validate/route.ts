import { validateWord } from "@/lib/openai-server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const word = searchParams.get("word")

    if (!word) {
      return NextResponse.json({ error: "Word parameter is required" }, { status: 400 })
    }

    const valid = await validateWord(word.toUpperCase())
    return NextResponse.json({ valid })
  } catch (error) {
    console.error("Error in /api/validate:", error)
    return NextResponse.json({ error: "Failed to validate word" }, { status: 500 })
  }
}
