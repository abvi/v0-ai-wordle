import { NextResponse } from "next/server"
import { generateAIWords } from "@/lib/openai-server"

/**
 * GET /api/words
 * Returns a JSON payload `{ words: { "2": [...], ... } }`.
 * Cached for 24 h at the edge (s-maxage) to minimise API calls.
 */
export async function GET() {
  const data = await generateAIWords()
  return NextResponse.json(data, {
    headers: { "Cache-Control": "s-maxage=86400, stale-while-revalidate" },
  })
}
