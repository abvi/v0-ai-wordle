export const AI_WORDS: Record<number, string[]> = {
  2: ["AI", "ML", "OS", "UI", "UX", "AR", "VR", "IO", "DB", "JS"],
  3: ["API", "GPU", "CPU", "NLP", "CNN", "RNN", "SQL", "XML", "CSS", "DOM", "RAM", "SSD", "USB", "TCP", "URL", "SDK"],
  4: ["CODE", "DATA", "BERT", "CLIP", "CUDA", "JSON", "HTML", "HTTP", "AJAX", "BASH", "JAVA", "RUST", "RUBY", "PERL"],
  5: [
    "MODEL",
    "AGENT",
    "LOGIC",
    "TRAIN",
    "LEARN",
    "ROBOT",
    "CLOUD",
    "STACK",
    "QUERY",
    "INDEX",
    "CACHE",
    "TOKEN",
    "PARSE",
  ],
  6: [
    "NEURAL",
    "PROMPT",
    "OPENAI",
    "CLAUDE",
    "PYTHON",
    "TENSOR",
    "MATRIX",
    "VECTOR",
    "BINARY",
    "SYNTAX",
    "DEPLOY",
    "GITHUB",
  ],
  7: [
    "MACHINE",
    "NETWORK",
    "PATTERN",
    "COMPUTE",
    "PROCESS",
    "COMPILE",
    "EXECUTE",
    "PROGRAM",
    "BACKEND",
    "FRONTEND",
    "DATASET",
  ],
  8: [
    "LEARNING",
    "TRAINING",
    "COMPUTER",
    "FUNCTION",
    "VARIABLE",
    "OPERATOR",
    "DATABASE",
    "SOFTWARE",
    "HARDWARE",
    "INTERNET",
  ],
}

export function getRandomWord(): string {
  const lengths = Object.keys(AI_WORDS).map(Number)
  const randomLength = lengths[Math.floor(Math.random() * lengths.length)]
  const wordsOfLength = AI_WORDS[randomLength]
  return wordsOfLength[Math.floor(Math.random() * wordsOfLength.length)]
}

export function isValidWord(word: string): boolean {
  const length = word.length
  return AI_WORDS[length]?.includes(word.toUpperCase()) || false
}
