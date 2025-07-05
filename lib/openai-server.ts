import OpenAI from "openai"
import "server-only"

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null

export type WordTheme = "ai" | "music" | "sports" | "math"

export async function generateThemeWords(theme: WordTheme): Promise<Record<number, string[]>> {
  if (!openai) {
    console.log("OpenAI API key not found, using fallback words")
    return getFallbackWords(theme)
  }

  try {
    const themePrompts = {
      ai: `AI, technology, and computer science related words including:
- AI/ML terms (GPU, CPU, LLM, NLP, CNN, RNN, etc.)
- Programming languages (JAVA, RUST, etc.)
- Tech companies (APPLE, GOOGLE, META, etc.)
- Computer science concepts (CODE, DATA, HASH, etc.)
- Modern tech terms (API, SDK, etc.)`,

      music: `Music and audio related words including:
- Musical instruments (PIANO, GUITAR, DRUMS, etc.)
- Music genres (ROCK, JAZZ, BLUES, POP, etc.)
- Musical terms (TEMPO, CHORD, SCALE, etc.)
- Famous musicians and bands (BACH, ELVIS, etc.)
- Audio equipment (MIXER, SPEAKER, etc.)`,

      sports: `Sports and athletics related words including:
- Sports names (SOCCER, TENNIS, GOLF, etc.)
- Equipment (BALL, BAT, GLOVE, etc.)
- Actions (KICK, THROW, CATCH, etc.)
- Positions (COACH, PLAYER, etc.)
- Terms (GOAL, SCORE, TEAM, etc.)`,

      math: `Mathematics and numbers related words including:
- Mathematical operations (ADD, MINUS, etc.)
- Geometric shapes (CIRCLE, SQUARE, etc.)
- Mathematical terms (ANGLE, RATIO, etc.)
- Numbers written out (ONE, TWO, THREE, etc.)
- Math concepts (LOGIC, PROOF, etc.)`,
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a word generator for a themed word guessing game. Generate a comprehensive list of words organized by length (3-6 letters only).

Return ONLY a valid JSON object with this exact structure:
{
  "3": ["WORD1", "WORD2", "WORD3"],
  "4": ["WORD1", "WORD2", "WORD3"],
  "5": ["WORD1", "WORD2", "WORD3"],
  "6": ["WORD1", "WORD2", "WORD3"]
}

Provide at least 15 words per length category. All words must be uppercase and contain only letters A-Z.`,
        },
        {
          role: "user",
          content: `Generate ${themePrompts[theme]}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error("No content received from OpenAI")
    }

    const words = JSON.parse(content)
    console.log(`Successfully generated ${theme} words from OpenAI`)
    return words
  } catch (error) {
    console.error(`Error generating ${theme} words from OpenAI:`, error)
    return getFallbackWords(theme)
  }
}

export async function validateWord(word: string): Promise<boolean> {
  if (!openai) {
    console.log("OpenAI API key not found, using basic validation")
    return word.length >= 3 && word.length <= 6 && /^[A-Z]+$/.test(word)
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a word validator for a word guessing game. Determine if the given word is a valid English word that would be found in a standard dictionary.

Accept:
- Common English words (nouns, verbs, adjectives, adverbs)
- Proper nouns (names, places, brands)
- Common abbreviations and acronyms
- Technical terms and jargon
- Slang words that are widely recognized

Reject:
- Random letter combinations
- Obvious typos or misspellings
- Words with numbers or special characters

Respond with only "true" or "false".`,
        },
        {
          role: "user",
          content: word,
        },
      ],
      temperature: 0,
      max_tokens: 10,
    })

    const response = completion.choices[0]?.message?.content?.trim().toLowerCase()
    return response === "true"
  } catch (error) {
    console.error("Error validating word with OpenAI:", error)
    // Fallback: accept any alphabetic word of reasonable length
    return word.length >= 3 && word.length <= 6 && /^[A-Z]+$/.test(word)
  }
}

function getFallbackWords(theme: WordTheme): Record<number, string[]> {
  const fallbackWords = {
    ai: {
      3: ["API", "GPU", "CPU", "NLP", "CNN", "RNN", "SQL", "XML", "CSS", "PHP", "AWS", "IBM", "AMD", "IOT", "VPN"],
      4: [
        "CODE",
        "DATA",
        "HASH",
        "JSON",
        "HTML",
        "HTTP",
        "JAVA",
        "RUST",
        "TECH",
        "CHIP",
        "DISK",
        "BOOT",
        "WIFI",
        "BYTE",
        "LOOP",
      ],
      5: [
        "MODEL",
        "AGENT",
        "LOGIC",
        "TRAIN",
        "CLOUD",
        "CYBER",
        "ROBOT",
        "SMART",
        "PIXEL",
        "CACHE",
        "DEBUG",
        "LINUX",
        "MYSQL",
        "REACT",
        "SWIFT",
      ],
      6: [
        "NEURAL",
        "PYTHON",
        "GITHUB",
        "DOCKER",
        "LAMBDA",
        "TENSOR",
        "VECTOR",
        "MATRIX",
        "BINARY",
        "KERNEL",
        "SERVER",
        "MOBILE",
        "CODING",
        "SYNTAX",
        "MEMORY",
      ],
    },
    music: {
      3: ["RAP", "POP", "DUB", "JAM", "HIT", "KEY", "BAR", "BOW", "MIC", "AMP", "GIG", "SET", "TAB", "CUE", "MIX"],
      4: [
        "ROCK",
        "JAZZ",
        "FOLK",
        "SOUL",
        "BEAT",
        "TUNE",
        "SONG",
        "BAND",
        "DRUM",
        "BASS",
        "FLUE",
        "HARP",
        "LUTE",
        "REED",
        "TONE",
      ],
      5: [
        "PIANO",
        "GUITAR",
        "DRUMS",
        "FLUTE",
        "ORGAN",
        "TEMPO",
        "CHORD",
        "SCALE",
        "MUSIC",
        "SOUND",
        "VOICE",
        "DANCE",
        "OPERA",
        "BLUES",
        "METAL",
      ],
      6: [
        "VIOLIN",
        "SINGER",
        "MELODY",
        "RHYTHM",
        "STUDIO",
        "RECORD",
        "ARTIST",
        "CONCERT",
        "LYRICS",
        "HARMONY",
        "BALLAD",
        "CHORUS",
        "BRIDGE",
        "SAMPLE",
        "REVERB",
      ],
    },
    sports: {
      3: ["RUN", "HIT", "WIN", "CUP", "BAT", "NET", "GYM", "BOX", "SKI", "ROW", "JOG", "LAP", "SET", "ACE", "TIE"],
      4: [
        "BALL",
        "GAME",
        "TEAM",
        "GOAL",
        "RACE",
        "SWIM",
        "JUMP",
        "KICK",
        "PASS",
        "SHOT",
        "PLAY",
        "GOLF",
        "SURF",
        "DIVE",
        "LIFT",
      ],
      5: [
        "SPORT",
        "MATCH",
        "SCORE",
        "FIELD",
        "COURT",
        "TRACK",
        "COACH",
        "TRAIN",
        "MEDAL",
        "PRIZE",
        "RUGBY",
        "BOXER",
        "RIDER",
        "SKATE",
        "THROW",
      ],
      6: [
        "SOCCER",
        "TENNIS",
        "HOCKEY",
        "PLAYER",
        "WINNER",
        "RUNNER",
        "LEAGUE",
        "SEASON",
        "TROPHY",
        "ATHLETE",
        "BOXING",
        "RACING",
        "SKIING",
        "DIVING",
        "CYCLING",
      ],
    },
    math: {
      3: ["ADD", "SUM", "SET", "ONE", "TWO", "SIX", "TEN", "ODD", "ARC", "LOG", "SIN", "COS", "TAN", "MAX", "MIN"],
      4: [
        "MATH",
        "PLUS",
        "ZERO",
        "FOUR",
        "FIVE",
        "NINE",
        "CUBE",
        "ROOT",
        "AREA",
        "LINE",
        "AXIS",
        "MEAN",
        "MODE",
        "SINE",
        "CONE",
      ],
      5: [
        "THREE",
        "SEVEN",
        "EIGHT",
        "ANGLE",
        "RATIO",
        "GRAPH",
        "CURVE",
        "POINT",
        "SLOPE",
        "PROOF",
        "LOGIC",
        "PRIME",
        "EQUAL",
        "ROUND",
        "SOLVE",
      ],
      6: [
        "NUMBER",
        "CIRCLE",
        "SQUARE",
        "VOLUME",
        "RADIUS",
        "DEGREE",
        "FACTOR",
        "MATRIX",
        "VECTOR",
        "FORMULA",
        "THEORY",
        "METHOD",
        "RESULT",
        "ANSWER",
        "SYMBOL",
      ],
    },
  }

  return fallbackWords[theme]
}
