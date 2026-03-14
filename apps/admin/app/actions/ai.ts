"use server";

import { generateText } from "ai";
import { createCohere } from "@ai-sdk/cohere";

const cohere = createCohere({
  apiKey: process.env.COHERE_API_KEY,
});

export async function analyzeContent(content: string, contentType: string) {
  const { text } = await generateText({
    model: cohere("command-a-03-2025"),
    prompt: `As a content moderation AI for Neuro Cart e-commerce platform, analyze this ${contentType}:
    "${content}"
    
    Evaluate for: inappropriate content, spam, misleading claims, policy violations.
    Return a JSON object with fields: safe (boolean), confidence (0-1), flags (array of strings), suggestion (string).
    Return only valid JSON, no markdown.`,
  });

  try {
    return JSON.parse(text);
  } catch {
    return {
      safe: true,
      confidence: 0.5,
      flags: [],
      suggestion: "Unable to analyze",
    };
  }
}

export async function generatePlatformInsights(metrics: string) {
  const { text } = await generateText({
    model: cohere("command-a-03-2025"),
    prompt: `As a platform analytics AI for Neuro Cart, analyze these platform metrics:
    ${metrics}
    Provide 4-5 key insights about platform health, user behavior, and growth opportunities.`,
  });

  return text;
}

export async function detectFraud(transactionData: string) {
  const { text } = await generateText({
    model: cohere("command-a-03-2025"),
    prompt: `As a fraud detection AI, analyze this transaction pattern:
    ${transactionData}
    Return a JSON object with: riskLevel (low/medium/high), score (0-1), indicators (array of strings), recommendation (string).
    Return only valid JSON, no markdown.`,
  });

  try {
    return JSON.parse(text);
  } catch {
    return {
      riskLevel: "low",
      score: 0.1,
      indicators: [],
      recommendation: "No issues detected",
    };
  }
}
