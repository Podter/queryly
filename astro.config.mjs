// @ts-check
import node from "@astrojs/node";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { defineConfig, envField } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://queryly.podter.me",
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
  ],
  env: {
    schema: {
      SECRET: envField.string({
        context: "server",
        access: "secret",
      }),
      SEARXNG_API: envField.string({
        context: "server",
        access: "secret",
        url: true,
      }),
      REDIS_URL: envField.string({
        context: "server",
        access: "secret",
        url: true,
      }),
      GROQ_API_KEY: envField.string({
        context: "server",
        access: "secret",
      }),
    },
  },
});
