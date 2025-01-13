// @ts-check
import node from "@astrojs/node";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

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
    react(),
  ],
});
