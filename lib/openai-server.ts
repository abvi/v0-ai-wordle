"server-only"

// lib/openai.ts
// Centralised helpers for talking to OpenAI (or falling back to local data)

import type { ChatCompletionMessageParam } from "openai/resources/index.mjs"
import OpenAI from "openai"

// --- Safely create the OpenAI client ---------------------------------------
let openai: OpenAI | null = null

const apiKey = typeof process !== "undefined" ? process.env.OPENAI_API_KEY : undefined

if (apiKey) {
  try {
    openai = new OpenAI({
      apiKey,
      // We’re in the browser inside next-lite, so opt-in explicitly
      // dangerouslyAllowBrowser: true,
    })
  } catch (err) {
    console.error("Failed to create OpenAI client ➜ falling back to local word list.", err)
    openai = null
  }
}

// ---------------------------------------------------------------------------
// Fallback list used whenever the API is unavailable
// ---------------------------------------------------------------------------
export const fallbackWords: Record<number, string[]> = {
  2: ["AI", "ML", "OS", "UI", "UX", "VR", "AR"],
  3: ["API", "GPU", "CPU", "NLP", "CNN", "SQL", "IDE"],
  4: ["CODE", "DATA", "BERT", "CLIP", "JSON", "NODE"],
  5: ["MODEL", "AGENT", "LOGIC", "TRAIN", "TOKEN", "PROMP"],
  6: ["NEURAL", "PROMPT", "CUDA", "PYTHON", "RUSTY"],
  7: ["MACHINE", "NETWORK", "PATTERN", "BROWSER"],
  8: ["LEARNING", "TRAINING", "COMPUTER", "ALGORITHM"],
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface WordGenerationResponse {
  words: Record<number, string[]>
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const systemPrompt =
  "You are a helpful assistant that ONLY returns valid JSON. " +
  "Generate AI/technology-related words grouped by length 2-8. " +
  "Return exactly this shape:\n" +
  '{ "words": { "2": ["AI", ...], "3": [...], "4": [...], "5": [...], "6": [...], "7": [...], "8": [...] } }'

async function safeChat(messages: ChatCompletionMessageParam[]) {
  if (!openai) throw new Error("OpenAI unavailable")
  return openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.6,
    max_tokens: 1500,
    messages,
  })
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export async function generateAIWords(): Promise<WordGenerationResponse> {
  // Skip network if no client
  if (!openai) {
    return { words: fallbackWords }
  }

  try {
    const res = await safeChat([
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: "Produce at least 25 unique words for every length. UPPERCASE only. No commentary.",
      },
    ])

    const content = res.choices[0]?.message?.content ?? ""
    const parsed = JSON.parse(content) as WordGenerationResponse

    // Basic sanity check
    if (!parsed?.words) throw new Error("Missing words key")
    return parsed
  } catch (err) {
    console.error("generateAIWords() ➜ using fallback list.", err)
    return { words: fallbackWords }
  }
}

export async function validateWordServer(word: string): Promise<boolean> {
  // Accept everything if we have no client; prevents blocking gameplay
  if (!openai) return true

  try {
    const res = await safeChat([
      {
        role: "system",
        content:
          "You are a validator. Reply ONLY 'true' or 'false'. " +
          "Return 'true' if the word is a valid English word.",
      },
      { role: "user", content: word.toUpperCase() },
    ])

    const answer = res.choices[0]?.message?.content?.trim().toLowerCase()
    return answer === "true"
  } catch (err) {
    console.error(`validateWord("${word}") ➜ defaulting to true.`, err)
    return true
  }
}
