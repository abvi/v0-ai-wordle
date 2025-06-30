import { generateAIWords } from "@/lib/openai-server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const result = await generateAIWords()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in /api/words:", error)
    return NextResponse.json({ error: "Failed to generate words" }, { status: 500 })
  }
}
