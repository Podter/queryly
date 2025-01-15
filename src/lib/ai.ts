import { deserialize, serialize } from "node:v8";
import type {
  Experimental_LanguageModelV1Middleware as LanguageModelV1Middleware,
  LanguageModelV1StreamPart,
} from "ai";
import { createGroq } from "@ai-sdk/groq";
import { simulateReadableStream } from "ai";
import { GROQ_API_KEY } from "astro:env/server";
import { objectHash } from "ohash";

import { redis } from "./redis";

export const groq = createGroq({
  apiKey: GROQ_API_KEY,
});

export const cacheMiddleware: LanguageModelV1Middleware = {
  wrapStream: async ({ doStream, params }) => {
    const cacheKey = `ai:${objectHash(params)}`;

    // Check if the result is in the cache
    const cached = await redis.getBuffer(cacheKey);

    // If cached, return a simulated ReadableStream that yields the cached result
    if (cached !== null) {
      // Format the timestamps in the cached response
      const formattedChunks = (
        deserialize(cached) as LanguageModelV1StreamPart[]
      ).map((p) => {
        if (p.type === "response-metadata" && p.timestamp) {
          return { ...p, timestamp: new Date(p.timestamp) };
        } else return p;
      });
      return {
        stream: simulateReadableStream({
          initialDelayInMs: 5000,
          chunks: formattedChunks,
        }),
        rawCall: { rawPrompt: null, rawSettings: {} },
      };
    }

    // If not cached, proceed with streaming
    const { stream, ...rest } = await doStream();

    const fullResponse: LanguageModelV1StreamPart[] = [];

    const transformStream = new TransformStream<
      LanguageModelV1StreamPart,
      LanguageModelV1StreamPart
    >({
      transform(chunk, controller) {
        fullResponse.push(chunk);
        controller.enqueue(chunk);
      },
      async flush() {
        // Store the full response in the cache after streaming is complete
        await redis.set(cacheKey, serialize(fullResponse));
        await redis.expire(cacheKey, 3600); // 1 hour
      },
    });

    return {
      stream: stream.pipeThrough(transformStream),
      ...rest,
    };
  },
};
