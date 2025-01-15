import type { APIRoute } from "astro";
import { SEARXNG_API } from "astro:env/server";

import { cache } from "~/lib/cache";

const CACHE_DAYS = 7;

const getFavicon = cache(
  async (authority: string, hash: string) => {
    const params = new URLSearchParams();
    params.append("authority", authority);
    params.append("h", hash);

    const url = SEARXNG_API + `/favicon_proxy?${params.toString()}`;
    const response = await fetch(url);

    return response;
  },
  (authority, hash) => `favicon:${authority}:${hash}`,
  CACHE_DAYS * 86400,
);

export const GET: APIRoute = async ({ url }) => {
  const response = await getFavicon(
    url.searchParams.get("a") ?? "",
    url.searchParams.get("h") ?? "",
  );

  if (!response.ok) {
    return new Response(null, {
      status: response.status,
      statusText: response.statusText,
    });
  }

  return new Response(response.body, {
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "image/png",
      "Cache-Control": `public, max-age=${CACHE_DAYS * 86400}`,
    },
  });
};
