/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { deserialize, serialize } from "node:v8";
import { REDIS_URL } from "astro:env/server";
import { Redis } from "ioredis";

export const redis = new Redis(REDIS_URL);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Callback = (...args: any[]) => Promise<any>;

export function cache<T extends Callback>(
  callback: T,
  key: string | ((...args: Parameters<T>) => string),
  ttl?: number, // seconds
): T {
  async function cachedCallback(...args: Parameters<typeof callback>) {
    const cacheKey = typeof key === "function" ? key(...args) : key;

    const cached = await redis.getBuffer(cacheKey);
    if (cached) {
      const data = deserialize(cached);
      return data;
    }

    const data = await callback(...args);
    await redis.set(cacheKey, serialize(data));
    if (ttl) {
      await redis.expire(cacheKey, ttl);
    }

    return data;
  }

  return cachedCallback as T;
}
