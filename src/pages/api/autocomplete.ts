import type { APIRoute } from "astro";
import { SEARXNG_API } from "astro:env/server";

import { cache } from "~/lib/redis";

const AUTOCOMPLETE_TTL = 3600; // 1 hour

type AutocompleteResponse = [string, string[]];

const getAutocomplete = cache(
  async (query: string) => {
    const params = new URLSearchParams();
    params.append("q", query);

    const url = SEARXNG_API + `/autocompleter?${params.toString()}`;
    const response = await fetch(url);

    return {
      response: {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
      },
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      data: ((await response.json()) as AutocompleteResponse)[1] ?? [],
    };
  },
  (query) => `autocomplete:${query}`,
  {
    ttl: AUTOCOMPLETE_TTL,
    shouldCache(result) {
      return result.response.ok;
    },
  },
);

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get("q");
  if (!query) {
    return new Response(null, {
      status: 400,
    });
  }

  const { response, data } = await getAutocomplete(query);
  if (!response.ok) {
    return new Response(null, {
      status: response.status,
      statusText: response.statusText,
    });
  }

  return Response.json(data, {
    headers: {
      "Cache-Control": `public, max-age=${AUTOCOMPLETE_TTL}`,
    },
  });
};
