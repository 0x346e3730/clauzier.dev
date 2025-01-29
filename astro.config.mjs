// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  prefetch: {
      prefetchAll: true,
  },

  vite: {
      plugins: [tailwindcss()],
  },

  integrations: [
      icon()
  ],

  adapter: node({
    mode: "standalone"
  })
});