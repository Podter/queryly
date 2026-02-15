import type { APIRoute } from "astro";
import { streamText, wrapLanguageModel } from "ai";

import { cacheMiddleware, groq } from "~/lib/ai";
import systemPrompt from "~/lib/prompt.txt?raw";
import { omitResult, search } from "~/lib/searxng";

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const { prompt } = (await request.json()) as { prompt: string };
  const searchResult = omitResult(await search(prompt, { pageno: 1 }));

  const result = streamText({
    model: wrapLanguageModel({
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      middleware: cacheMiddleware(clientAddress),
    }),
    maxOutputTokens: 4096,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: JSON.stringify(searchResult, null, 2) },
      { role: "assistant", content: "<summary>" },
    ],
    stopSequences: ["</summary>"],
  });

  return result.toUIMessageStreamResponse({
    headers: { "Content-Type": "text/event-stream" },
  });
};
