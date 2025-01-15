import type { APIRoute } from "astro";
import {
  streamText,
  experimental_wrapLanguageModel as wrapLanguageModel,
} from "ai";

import { cacheMiddleware, groq } from "~/lib/ai";
import systemPrompt from "~/lib/prompt.txt?raw";
import { omitResult, search } from "~/lib/searxng";

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const { prompt } = (await request.json()) as { prompt: string };
  const searchResult = omitResult(await search(prompt, { pageno: 1 }));

  const result = streamText({
    model: wrapLanguageModel({
      model: groq("llama-3.1-8b-instant"),
      middleware: cacheMiddleware(clientAddress),
    }),
    maxTokens: 4096,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: JSON.stringify(searchResult, null, 2),
      },
      {
        role: "assistant",
        content: "<summary>",
      },
    ],
    stopSequences: ["</summary>"],
  });

  return result.toDataStreamResponse();
};
