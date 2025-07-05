import { NextResponse } from "next/server"
import { validateWord } from "@/lib/openai-server"

export async function POST(request: Request) {
  try {
    const { word } = await request.json()

    if (!word || typeof word !== "string") {
      return NextResponse.json({ isValid: false }, { status: 400 })
    }

    const isValid = await validateWord(word.toUpperCase())
    return NextResponse.json({ isValid })
  } catch (error) {
    console.error("Error validating word:", error)
    return NextResponse.json({ isValid: false }, { status: 500 })
  }
}
