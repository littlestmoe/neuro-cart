export const AI_PROVIDER = "cohere" as const;
export const AI_MODEL = "command-a-03-2025" as const;
export const AI_REASONING_MODEL = "command-a-reasoning-08-2025" as const;

export const AI_CONFIG = {
  provider: AI_PROVIDER,
  model: AI_MODEL,
  reasoningModel: AI_REASONING_MODEL,
  maxTokens: 2048,
  temperature: 0.7,
} as const;
