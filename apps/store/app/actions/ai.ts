"use server";

import { generateText } from "ai";
import { createCohere } from "@ai-sdk/cohere";

const cohere = createCohere({
  apiKey: process.env.COHERE_API_KEY,
});

export async function searchProducts(query: string) {
  const { text } = await generateText({
    model: cohere("command-a-03-2025"),
    prompt: `You are an AI shopping assistant for Neuro Cart, an e-commerce platform. The user searched for: "${query}". 
    Return a JSON array of search suggestions with fields: query (refined search term), category (product category), confidence (0-1).
    Return only valid JSON, no markdown.`,
  });

  try {
    return JSON.parse(text);
  } catch {
    return [{ query, category: "general", confidence: 1 }];
  }
}

export async function getRecommendations(
  productName: string,
  category: string,
) {
  const { text } = await generateText({
    model: cohere("command-a-03-2025"),
    prompt: `You are an AI product recommendation engine for Neuro Cart. Based on the product "${productName}" in category "${category}", 
    suggest 4 related product ideas. Return a JSON array with fields: name, description, priceRange, reason.
    Return only valid JSON, no markdown.`,
  });

  try {
    return JSON.parse(text);
  } catch {
    return [];
  }
}

export async function generateProductSummary(description: string) {
  const { text } = await generateText({
    model: cohere("command-a-03-2025"),
    prompt: `Summarize this product description in 2-3 concise sentences for an e-commerce listing: "${description}"`,
  });

  return text;
}
