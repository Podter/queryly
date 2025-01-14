import { SEARXNG_API } from "astro:env/server";
import { SearxngService } from "searxng";

export const searxng = new SearxngService({
  baseURL: SEARXNG_API,
  defaultSearchParams: {
    format: "json",
    lang: "auto",
    autocomplete: "google",
  },
});
