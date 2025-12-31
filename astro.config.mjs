// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import mdx from '@astrojs/mdx';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import { visualizer } from 'rollup-plugin-visualizer';

// https://astro.build/config
export default defineConfig({
  site: 'https://clauzier.dev',
  
  // Advanced prefetching configuration
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },

  // Performance optimizations
  build: {
    // No custom properties here; removed invalid options
  },

  // Advanced Vite configuration for performance
  vite: {
    plugins: [tailwindcss(), visualizer({ filename: 'stats.html', open: false })],
    build: {
      // Enable CSS code splitting
      cssCodeSplit: true,
      // Rollup optimizations
      rollupOptions: {
        output: {
          // Manual chunk splitting for better caching
          manualChunks: {
            // Vendor chunk for third-party libraries
            vendor: ['astro-icon'],
            // Utils chunk for utility functions
            utils: [
              './src/utils/date.ts',
              './src/utils/experience.ts',
              './src/utils/readingTime.ts',
            ],
          },
          // Optimize chunk file names
          chunkFileNames: '_astro/[name].[hash].js',
          entryFileNames: '_astro/[name].[hash].js',
          assetFileNames: '_astro/[name].[hash][extname]',
        },
      },
      // Enable minification
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // Remove console.log in production
          drop_debugger: true,
          pure_funcs: ['console.log'], // Remove specific function calls
        },
        mangle: {
          safari10: true, // Safari 10 compatibility
        },
      },
      // Source maps for debugging (can be disabled in production)
      sourcemap: false,
    },
    // Optimize dependencies
    optimizeDeps: {
      include: ['astro-icon'],
    },
    // Enable server-side compression
    preview: {
      headers: {
        'Cache-Control': 'public, max-age=600',
      },
    },
  },

  // Integrations with optimizations
  integrations: [
    icon({
      // Optimize icon handling - only include icons actually used
      include: {
        ph: [
          'envelope',
          'globe',
          'map-pin',
          'linkedin-logo',
          'github-logo',
          'x-logo',
          'instagram-logo',
          'twitch-logo',
          'quotes',
          'caret-down'
        ],
        la: ['symfony'],
      },
    }),
    mdx({
      // Optimize MDX processing
      optimize: true,
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { 
          behavior: 'append',
          properties: { class: 'anchor-link' }
        }],
        [rehypePrettyCode, {
          theme: 'github-dark',
          // Optimize code highlighting
          keepBackground: false,
          onVisitLine(node) {
            if (node.children.length === 0) {
              node.children = [{ type: 'text', value: ' ' }];
            }
          },
          onVisitHighlightedLine(node) {
            node.properties.className = ['line--highlighted'];
          },
          onVisitHighlightedWord(node) {
            node.properties.className = ['word--highlighted'];
          },
        }],
      ],
    }),
  ],

  // Static build optimization
  output: 'static',

  // Image optimization
  image: {
    // Enable image optimization
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: 268402689, // ~16K x 16K
      },
    },
  },

  // Markdown optimization
  markdown: {
    // Optimize Shiki
    shikiConfig: {
      theme: 'github-dark',
      wrap: false, // Don't wrap lines for better performance
    },
    // Enable syntax highlighting caching
    syntaxHighlight: 'shiki',
  },

  // Compress HTML output
  compressHTML: true,
});
