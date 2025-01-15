import { deserialize, serialize } from "node:v8";
import { Ratelimit } from "@upstash/ratelimit";
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data = deserialize(cached);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return data;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = await callback(...args);
    await redis.set(cacheKey, serialize(data));
    if (ttl) {
      await redis.expire(cacheKey, ttl);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return data;
  }

  return cachedCallback as T;
}

export const limiter = new Ratelimit({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  redis: {
    sadd: async <TData>(key: string, ...members: TData[]) =>
      redis.sadd(key, ...members.map(String)),
    eval: async <TArgs extends unknown[], TData = unknown>(
      script: string,
      keys: string[],
      args: TArgs,
    ) =>
      redis.eval(
        script,
        keys.length,
        ...keys,
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        ...(args ?? []).map(String),
      ) as Promise<TData>,
    scriptLoad: async (script: string) =>
      redis.script("LOAD", script) as Promise<string>,
    smismember: async (key: string, members: unknown[]) =>
      redis.smismember(key, ...(members as string[])) as Promise<(0 | 1)[]>,
    evalsha: <TData>(sha1: string, keys: string[], args: unknown[]) =>
      redis.evalsha(sha1, keys.length, ...keys, ...(args as string[])) as TData,
    hset: async <TData>(key: string, kv: Record<string, TData>) =>
      redis.hset(key, kv),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any,
  limiter: Ratelimit.fixedWindow(10, "1m"),
});
