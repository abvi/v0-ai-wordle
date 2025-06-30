import { NextResponse } from "next/server"
import { validateWordServer } from "@/lib/openai-server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const word = searchParams.get("word")?.toUpperCase() || ""

  if (!word) {
    return NextResponse.json({ valid: false, error: "Word query param missing." }, { status: 400 })
  }

  const valid = await validateWordServer(word)
  return NextResponse.json({ valid })
}
