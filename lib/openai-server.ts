import OpenAI from "openai"
import "server-only"

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null

export async function generateAIWords(): Promise<Record<number, string[]>> {
  if (!openai) {
    console.log("OpenAI API key not found, using fallback words")
    return getFallbackWords()
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a word generator for an AI-themed word guessing game. Generate a comprehensive list of AI, technology, and computer science related words organized by length (3-6 letters). 

Categories to include:
- AI/ML terms (AI, ML, GPU, CPU, LLM, NLP, CNN, RNN, etc.)
- Programming languages (JS, GO, SQL, etc.)
- Tech companies (APPLE, GOOGLE, META, etc.)
- Computer science concepts (CODE, DATA, HASH, etc.)
- Modern tech terms (API, SDK, UI, UX, etc.)

Return ONLY a valid JSON object with this exact structure:
{
  "3": ["API", "GPU", "CPU", "NLP", "CNN"],
  "4": ["CODE", "DATA", "HASH", "JSON"],
  "5": ["MODEL", "AGENT", "LOGIC", "TRAIN"],
  "6": ["NEURAL", "PYTHON", "GITHUB", "DOCKER"],
}

Provide at least 10 words per length category. All words must be uppercase and contain only letters A-Z.`,
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
    console.log("Successfully generated words from OpenAI")
    return words
  } catch (error) {
    console.error("Error generating words from OpenAI:", error)
    return getFallbackWords()
  }
}

export async function validateWord(word: string): Promise<boolean> {
  if (!openai) {
    console.log("OpenAI API key not found, using basic validation")
    return word.length >= 2 && word.length <= 8 && /^[A-Z]+$/.test(word)
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
    return word.length >= 2 && word.length <= 8 && /^[A-Z]+$/.test(word)
  }
}

function getFallbackWords(): Record<number, string[]> {
  return {
    2: ["AI", "ML", "OS", "UI", "UX", "IT", "PC", "CD", "HD", "IP"],
    3: ["API", "GPU", "CPU", "NLP", "CNN", "RNN", "SQL", "XML", "CSS", "PHP", "AWS", "IBM", "AMD"],
    4: ["CODE", "DATA", "HASH", "JSON", "HTML", "HTTP", "JAVA", "RUST", "TECH", "CHIP", "DISK", "BOOT"],
    5: ["MODEL", "AGENT", "LOGIC", "TRAIN", "CLOUD", "CYBER", "ROBOT", "SMART", "PIXEL", "CACHE", "DEBUG"],
    6: ["NEURAL", "PYTHON", "GITHUB", "DOCKER", "LAMBDA", "TENSOR", "VECTOR", "MATRIX", "BINARY", "KERNEL"],
    7: ["MACHINE", "NETWORK", "PATTERN", "COMPUTE", "DIGITAL", "QUANTUM", "PROCESS", "STORAGE", "PROGRAM"],
    8: ["LEARNING", "TRAINING", "COMPUTER", "ALGORITHM", "DATABASE", "SOFTWARE", "HARDWARE", "INTERNET", "PROTOCOL"],
  }
}
