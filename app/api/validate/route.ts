import { type NextRequest, NextResponse } from "next/server"
import { validateWord } from "@/lib/openai-server"

export async function POST(request: NextRequest) {
  try {
    const { word } = await request.json()

    if (!word || typeof word !== "string") {
      return NextResponse.json({ isValid: false })
    }

    const isValid = await validateWord(word.toUpperCase())

    return NextResponse.json({ isValid })
  } catch (error) {
    console.error("Error in /api/validate:", error)
    return NextResponse.json({ isValid: false })
  }
}
