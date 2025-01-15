import type { APIRoute } from "astro";
import { createGroq } from "@ai-sdk/groq";
import { streamText } from "ai";
import { GROQ_API_KEY } from "astro:env/server";

import { omitResult, search } from "~/lib/searxng";

const groq = createGroq({
  apiKey: GROQ_API_KEY,
});

export const POST: APIRoute = async ({ request }) => {
  const { prompt } = (await request.json()) as { prompt: string };
  const searchResult = omitResult(await search(prompt, { pageno: 1 }));

  const result = streamText({
    model: groq("llama-3.1-8b-instant"),
    system:
      "You are a helpful assistant. You need to summarize the search results.",
    prompt: JSON.stringify(searchResult, null, 2),
  });

  return result.toDataStreamResponse();
};
