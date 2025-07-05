import { type NextRequest, NextResponse } from "next/server"
import { generateAIWords } from "@/lib/openai-server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const theme = searchParams.get("theme") || "ai"

    const words = await generateAIWords(theme)

    return NextResponse.json({ words })
  } catch (error) {
    console.error("Error in /api/words:", error)
    return NextResponse.json({ error: "Failed to generate words" }, { status: 500 })
  }
}
