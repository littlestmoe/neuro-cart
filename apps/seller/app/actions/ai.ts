"use server";

import { generateText } from "ai";
import { createCohere } from "@ai-sdk/cohere";

const cohere = createCohere({
  apiKey: process.env.COHERE_API_KEY,
});

export async function generateProductDescription(
  name: string,
  category: string,
  keywords: string[],
) {
  const { text } = await generateText({
    model: cohere("command-a-03-2025"),
    prompt: `Write a compelling product description for an e-commerce listing.
    Product Name: ${name}
    Category: ${category}
    Keywords: ${keywords.join(", ")}
    Write 2-3 paragraphs that highlight features, benefits, and appeal. Be professional and persuasive.`,
  });

  return text;
}

export async function generateProductTags(name: string, description: string) {
  const { text } = await generateText({
    model: cohere("command-a-03-2025"),
    prompt: `Generate 8-12 relevant product tags for SEO and categorization.
    Product: ${name}
    Description: ${description}
    Return a JSON array of strings (tags only). Return only valid JSON, no markdown.`,
  });

  try {
    return JSON.parse(text);
  } catch {
    return [name.toLowerCase()];
  }
}

export async function analyzeSalesData(salesSummary: string) {
  const { text } = await generateText({
    model: cohere("command-a-03-2025"),
    prompt: `As a business analytics AI, analyze this sales data and provide 3-4 actionable insights:
    ${salesSummary}
    Focus on trends, opportunities, and recommendations for the seller.`,
  });

  return text;
}
