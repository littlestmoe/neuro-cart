# Cohere AI Setup

How to get a Cohere API key and configure it for Neuro Cart's AI server actions.

## Get API Key

1. Go to [dashboard.cohere.com](https://dashboard.cohere.com)
1. Sign in or create an account
1. Navigate to **API Keys**
1. Copy your production API key

## Configure Environment

Add the key to each app's `.env.local`:

```env
COHERE_API_KEY=your_api_key_here
```

## Model Used

Neuro Cart uses **Cohere Command A** (`command-a-03-2025`) for all AI operations. This model supports:

- Long-form text generation (product descriptions, summaries)
- JSON-structured output (search suggestions, moderation analysis)
- Analytical reasoning (fraud detection, sales insights)

## SDK Stack

| Layer    | Package                 | Purpose                                |
| :------- | :---------------------- | :------------------------------------- |
| SDK      | `ai` (Vercel AI SDK v6) | Unified AI function interface          |
| Provider | `@ai-sdk/cohere`        | Cohere model binding                   |
| Runtime  | Next.js Server Actions  | Server-side execution (`"use server"`) |

## Verify

Start a dev server and trigger any AI action (e.g., click "Configure" on the Admin AI Tools page). Check your Cohere dashboard for API call logs to confirm connectivity.

## Rate Limits

Cohere's free tier allows 1,000 API calls per month. For production usage, upgrade to a paid plan on the Cohere dashboard.
