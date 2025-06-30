import "server-only"
import OpenAI from "openai"

// Fallback word list in case OpenAI is unavailable
const FALLBACK_WORDS: Record<number, string[]> = {
  2: ["AI", "ML", "OS", "UI", "UX", "AR", "VR", "3D"],
  3: ["API", "GPU", "CPU", "NLP", "CNN", "RNN", "SQL", "XML", "CSS", "DOM"],
  4: ["CODE", "DATA", "BERT", "CLIP", "CUDA", "JSON", "HTML", "HTTP", "AJAX"],
  5: ["MODEL", "AGENT", "LOGIC", "TRAIN", "PIXEL", "CLOUD", "ROBOT", "SMART"],
  6: ["NEURAL", "PROMPT", "OPENAI", "CLAUDE", "PYTHON", "TENSOR", "MATRIX"],
  7: ["MACHINE", "NETWORK", "PATTERN", "COMPUTE", "DIGITAL", "QUANTUM"],
  8: ["LEARNING", "TRAINING", "COMPUTER", "ALGORITHM", "ROBOTICS", "INTERNET"],
}

let openaiClient: OpenAI | null = null

try {
  const apiKey = process.env.OPENAI_API_KEY
  if (apiKey) {
    openaiClient = new OpenAI({ apiKey })
  }
} catch (error) {
  console.warn("Failed to initialize OpenAI client:", error)
}

export async function generateAIWords(): Promise<{ words: Record<number, string[]> }> {
  if (!openaiClient) {
    console.log("OpenAI not available, using fallback words")
    return { words: FALLBACK_WORDS }
  }

  try {
    const completion = await openaiClient.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates lists of AI and technology-related words.",
        },
        {
          role: "user",
          content: `Generate a comprehensive list of AI, machine learning, and technology-related words organized by length (2-8 letters). 
          Include terms like: AI concepts, programming languages, tech companies, algorithms, hardware terms, software terms, etc.
          
          Return ONLY a JSON object in this exact format:
          {
            "2": ["AI", "ML", "OS", "UI"],
            "3": ["API", "GPU", "CPU", "NLP"],
            "4": ["CODE", "DATA", "BERT"],
            "5": ["MODEL", "AGENT", "LOGIC"],
            "6": ["NEURAL", "PROMPT", "OPENAI"],
            "7": ["MACHINE", "NETWORK", "PATTERN"],
            "8": ["LEARNING", "TRAINING", "COMPUTER"]
          }
          
          Provide at least 15-20 words per length category. All words should be uppercase and commonly known in tech/AI contexts.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error("No content received from OpenAI")
    }

    const words = JSON.parse(content) as Record<number, string[]>

    // Validate the structure
    for (let i = 2; i <= 8; i++) {
      if (!words[i] || !Array.isArray(words[i]) || words[i].length === 0) {
        throw new Error(`Invalid word structure for length ${i}`)
      }
    }

    return { words }
  } catch (error) {
    console.error("Error generating words from OpenAI:", error)
    return { words: FALLBACK_WORDS }
  }
}

export async function validateWord(word: string): Promise<boolean> {
  if (!openaiClient) {
    // Simple fallback validation - check if it's a reasonable English word
    return word.length >= 2 && word.length <= 8 && /^[A-Z]+$/.test(word)
  }

  try {
    const completion = await openaiClient.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a word validator. Respond with only 'true' or 'false'.",
        },
        {
          role: "user",
          content: `Is "${word}" a valid English word that could reasonably be related to AI, technology, programming, or computing? Consider: AI/ML terms, programming languages, tech companies, hardware/software terms, general computing concepts, etc. Respond with only 'true' or 'false'.`,
        },
      ],
      temperature: 0,
      max_tokens: 10,
    })

    const response = completion.choices[0]?.message?.content?.toLowerCase().trim()
    return response === "true"
  } catch (error) {
    console.error("Error validating word with OpenAI:", error)
    // Fallback to basic validation
    return word.length >= 2 && word.length <= 8 && /^[A-Z]+$/.test(word)
  }
}
