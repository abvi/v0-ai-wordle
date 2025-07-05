import "server-only"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function generateAIWords(theme = "ai"): Promise<Record<number, string[]>> {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    console.warn("OPENAI_API_KEY not found, using fallback words")
    return getFallbackWords(theme)
  }

  try {
    const themePrompts = {
      ai: "AI, machine learning, programming, technology, and computer science",
      music: "music, instruments, genres, musical terms, and artists",
      sports: "sports, games, equipment, athletic terms, and competitions",
      math: "mathematics, numbers, shapes, operations, and mathematical concepts",
    }

    const themeDescription = themePrompts[theme as keyof typeof themePrompts] || themePrompts.ai

    const { text } = await generateText({
      model: openai("gpt-4"),
      prompt: `Generate a comprehensive list of words related to ${themeDescription}. 
      
      Organize them by length (3-6 letters only). Return exactly 25 words for each length.
      
      Format as JSON:
      {
        "3": ["API", "GPU", "CPU", ...],
        "4": ["CODE", "DATA", "BERT", ...],
        "5": ["MODEL", "AGENT", "LOGIC", ...],
        "6": ["NEURAL", "PROMPT", "OPENAI", ...]
      }
      
      Requirements:
      - All words must be exactly 3-6 letters
      - All words must be uppercase
      - All words must be real English words
      - All words must be clearly related to ${themeDescription}
      - Return exactly 25 words per length category
      - Return only valid JSON, no other text`,
    })

    const parsed = JSON.parse(text.trim())

    // Validate the response
    if (typeof parsed === "object" && parsed !== null) {
      const validatedWords: Record<number, string[]> = {}

      for (const length of [3, 4, 5, 6]) {
        if (Array.isArray(parsed[length.toString()])) {
          validatedWords[length] = parsed[length.toString()]
            .filter((word: any) => typeof word === "string" && word.length === length)
            .slice(0, 25) // Ensure max 25 words
        }
      }

      // If we got valid words, return them
      if (Object.keys(validatedWords).length > 0) {
        return validatedWords
      }
    }

    throw new Error("Invalid response format from OpenAI")
  } catch (error) {
    console.error("Error generating words from OpenAI:", error)
    return getFallbackWords(theme)
  }
}

export async function validateWord(word: string): Promise<boolean> {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    console.warn("OPENAI_API_KEY not found, using basic validation")
    return word.length >= 3 && word.length <= 6 && /^[A-Z]+$/.test(word)
  }

  try {
    const { text } = await generateText({
      model: openai("gpt-4"),
      prompt: `Is "${word}" a valid English word that would be found in a standard dictionary? 
      
      Consider:
      - Common nouns, verbs, adjectives, adverbs
      - Proper nouns (names, places, brands)
      - Abbreviations and acronyms in common use
      - Technical terms
      
      Respond with only "true" or "false".`,
    })

    return text.trim().toLowerCase() === "true"
  } catch (error) {
    console.error("Error validating word:", error)
    // Fallback: basic validation
    return word.length >= 3 && word.length <= 6 && /^[A-Z]+$/.test(word)
  }
}

function getFallbackWords(theme: string): Record<number, string[]> {
  const fallbackWords = {
    ai: {
      3: ["API", "GPU", "CPU", "BOT", "APP", "WEB", "NET", "BIT", "RAM", "USB"],
      4: ["CODE", "DATA", "TECH", "CHIP", "BYTE", "WIFI", "HTML", "JSON", "RUST", "JAVA"],
      5: ["MODEL", "AGENT", "LOGIC", "ROBOT", "CLOUD", "PIXEL", "LINUX", "MYSQL", "REACT", "SWIFT"],
      6: ["NEURAL", "PYTHON", "GITHUB", "DOCKER", "TENSOR", "MATRIX", "VECTOR", "BINARY", "SYNTAX", "MEMORY"],
    },
    music: {
      3: ["RAP", "POP", "DUB", "JAM", "HIT", "MIX", "KEY", "BAR", "BOW", "SAX"],
      4: ["BEAT", "SONG", "TUNE", "BASS", "DRUM", "ROCK", "JAZZ", "FOLK", "HYMN", "ARIA"],
      5: ["PIANO", "VOCAL", "CHORD", "SCALE", "TEMPO", "GENRE", "ALBUM", "TRACK", "SOUND", "MUSIC"],
      6: ["GUITAR", "VIOLIN", "MELODY", "RHYTHM", "SINGER", "ARTIST", "STUDIO", "RECORD", "CONCERT", "HARMONY"],
    },
    sports: {
      3: ["RUN", "WIN", "GYM", "BOX", "SKI", "ROW", "HIT", "NET", "BAT", "CUP"],
      4: ["GAME", "TEAM", "BALL", "GOAL", "RACE", "SWIM", "JUMP", "KICK", "PLAY", "GOLF"],
      5: ["SPORT", "MATCH", "FIELD", "COURT", "TRACK", "SCORE", "COACH", "MEDAL", "ARENA", "LEAGUE"],
      6: ["SOCCER", "TENNIS", "HOCKEY", "BOXING", "RUNNER", "PLAYER", "WINNER", "TROPHY", "STADIUM", "ATHLETE"],
    },
    math: {
      3: ["SUM", "ADD", "SET", "ARC", "LOG", "SIN", "COS", "TAN", "MAX", "MIN"],
      4: ["MATH", "PLUS", "ZERO", "CUBE", "AREA", "AXIS", "MEAN", "MODE", "ROOT", "UNIT"],
      5: ["ANGLE", "GRAPH", "PRIME", "RATIO", "SLOPE", "CURVE", "POINT", "PROOF", "LOGIC", "EQUAL"],
      6: ["NUMBER", "CIRCLE", "SQUARE", "VECTOR", "MATRIX", "RADIUS", "VOLUME", "FORMULA", "THEORY", "CALCULUS"],
    },
  }

  return fallbackWords[theme as keyof typeof fallbackWords] || fallbackWords.ai
}
