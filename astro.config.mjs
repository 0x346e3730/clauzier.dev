// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import mdx from '@astrojs/mdx';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';

// https://astro.build/config
export default defineConfig({
  site: 'https://clauzier.dev',
  prefetch: {
      prefetchAll: true,
  },

  vite: {
      plugins: [tailwindcss()],
  },

  integrations: [
      icon(),
      mdx({
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'append' }],
          [rehypePrettyCode, {
            theme: 'github-dark',
            onVisitLine(node) {
              if (node.children.length === 0) {
                node.children = [{ type: 'text', value: ' ' }];
              }
            },
          }],
        ],
      }),
  ],

  // Remove the Node.js adapter for static build
  output: 'static',

  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },
});
