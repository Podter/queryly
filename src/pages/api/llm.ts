import type { APIRoute } from "astro";
import {
  streamText,
  experimental_wrapLanguageModel as wrapLanguageModel,
} from "ai";

import { cacheMiddleware, groq } from "~/lib/ai";
import { omitResult, search } from "~/lib/searxng";

export const POST: APIRoute = async ({ request }) => {
  const { prompt } = (await request.json()) as { prompt: string };
  const searchResult = omitResult(await search(prompt, { pageno: 1 }));

  const result = streamText({
    model: wrapLanguageModel({
      model: groq("llama-3.1-8b-instant"),
      middleware: cacheMiddleware,
    }),
    system:
      "You are a helpful assistant. You need to summarize the search results.",
    prompt: JSON.stringify(searchResult, null, 2),
  });

  return result.toDataStreamResponse();
};
