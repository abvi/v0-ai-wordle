import "server-only"
import OpenAI from "openai"

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null

export async function generateAIWords(): Promise<{ words: Record<number, string[]> }> {
  if (!openai) {
    console.log("No OpenAI API key found, using fallback words")
    return {
      words: {
        2: ["AI", "ML", "OS", "UI", "UX", "AR", "VR", "3D"],
        3: ["API", "GPU", "CPU", "NLP", "CNN", "RNN", "SQL", "XML"],
        4: ["CODE", "DATA", "BERT", "CLIP", "CUDA", "JSON", "HTML", "HTTP"],
        5: ["MODEL", "AGENT", "LOGIC", "TRAIN", "PIXEL", "CLOUD", "ROBOT", "SMART"],
        6: ["NEURAL", "PROMPT", "OPENAI", "CLAUDE", "PYTHON", "TENSOR", "VECTOR", "MATRIX"],
        7: ["MACHINE", "NETWORK", "PATTERN", "COMPUTE", "DIGITAL", "QUANTUM", "ANDROID", "CHATBOT"],
        8: ["LEARNING", "TRAINING", "COMPUTER", "ALGORITHM", "INTERNET", "SOFTWARE", "HARDWARE", "DATABASE"],
      },
    }
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Generate AI and technology-related words for a word guessing game. 
          Return a JSON object with word lengths as keys (2-8) and arrays of uppercase words as values.
          Include 10+ words per length. Focus on: AI/ML terms, programming languages, tech companies, 
          computer science concepts, and technology acronyms.`,
        },
        {
          role: "user",
          content: "Generate the word list",
        },
      ],
      temperature: 0.7,
    })

    const content = response.choices[0]?.message?.content
    if (!content) throw new Error("No content in response")

    const parsed = JSON.parse(content)
    return { words: parsed }
  } catch (error) {
    console.error("Error generating words from OpenAI:", error)
    // Return fallback words
    return {
      words: {
        2: ["AI", "ML", "OS", "UI", "UX", "AR", "VR", "3D"],
        3: ["API", "GPU", "CPU", "NLP", "CNN", "RNN", "SQL", "XML"],
        4: ["CODE", "DATA", "BERT", "CLIP", "CUDA", "JSON", "HTML", "HTTP"],
        5: ["MODEL", "AGENT", "LOGIC", "TRAIN", "PIXEL", "CLOUD", "ROBOT", "SMART"],
        6: ["NEURAL", "PROMPT", "OPENAI", "CLAUDE", "PYTHON", "TENSOR", "VECTOR", "MATRIX"],
        7: ["MACHINE", "NETWORK", "PATTERN", "COMPUTE", "DIGITAL", "QUANTUM", "ANDROID", "CHATBOT"],
        8: ["LEARNING", "TRAINING", "COMPUTER", "ALGORITHM", "INTERNET", "SOFTWARE", "HARDWARE", "DATABASE"],
      },
    }
  }
}

export async function validateWord(word: string): Promise<boolean> {
  if (!openai) {
    // Simple fallback validation
    return /^[A-Z]+$/.test(word) && word.length >= 2 && word.length <= 8
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a dictionary validator. Return only "true" or "false" to indicate if the given word is a valid English word that would be found in a standard dictionary. Accept common nouns, verbs, adjectives, proper nouns, and standard abbreviations.`,
        },
        {
          role: "user",
          content: word,
        },
      ],
      temperature: 0,
    })

    const content = response.choices[0]?.message?.content?.trim().toLowerCase()
    return content === "true"
  } catch (error) {
    console.error("Error validating word:", error)
    // Fallback: allow any alphabetic word
    return /^[A-Z]+$/.test(word) && word.length >= 2 && word.length <= 8
  }
}
