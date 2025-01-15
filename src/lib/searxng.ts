import crypto from "node:crypto";
import { SEARXNG_API, SECRET } from "astro:env/server";
import { objectHash } from "ohash";
import { SearxngService } from "searxng";

import { cache } from "./cache";
import { pick } from "./object-utils";

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

export function getFaviconUrl(authority: string) {
  const hash = crypto
    .createHmac("sha256", SECRET as crypto.BinaryLike)
    .update(authority)
    .digest("hex");

  const params = new URLSearchParams();
  params.append("a", authority);
  params.append("h", hash);

  return `/api/favicon?${params.toString()}`;
}

export function omitResult(data: Awaited<ReturnType<typeof search>>) {
  const results = data.results.map((result) =>
    pick(
      result,
      "url",
      "title",
      "content",
      "engine",
      "publishedDate",
      "score",
      "category",
      "metadata",
      "source",
    ),
  );
  return {
    ...pick(
      data,
      "query",
      "answers",
      "corrections",
      "infoboxes",
      "suggestions",
    ),
    results,
  };
}
