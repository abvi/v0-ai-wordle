import { NextResponse } from "next/server"
import { generateAIWords } from "@/lib/openai-server"

export async function GET() {
  try {
    const words = await generateAIWords()
    return NextResponse.json({ words })
  } catch (error) {
    console.error("Error in /api/words:", error)
    return NextResponse.json({ error: "Failed to generate words" }, { status: 500 })
  }
}
