import { NextResponse } from "next/server"
import { generateThemeWords, type WordTheme } from "@/lib/openai-server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const theme = (searchParams.get("theme") as WordTheme) || "ai"

    const words = await generateThemeWords(theme)
    return NextResponse.json({ words })
  } catch (error) {
    console.error("Error in /api/words:", error)
    return NextResponse.json({ error: "Failed to generate words" }, { status: 500 })
  }
}
