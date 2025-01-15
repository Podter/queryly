import { SEARXNG_API } from "astro:env/server";
import { objectHash } from "ohash";
import { SearxngService } from "searxng";

import { cache } from "./cache";

export const searxng = new SearxngService({
  baseURL: SEARXNG_API,
  defaultSearchParams: {
    format: "json",
    lang: "auto",
    autocomplete: "google",
  },
});

export const search = cache(
  async (...args: Parameters<typeof searxng.search>) => {
    return await searxng.search(...args);
  },
  (...args) => `search:${objectHash(args)}`,
  3600, // 1 hour
);
