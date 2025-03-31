import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    description: z.string().optional(),
    author: z.string().default('Antonin CLAUZIER'),
    tags: z.array(z.string()).optional(),
    external: z.object({
      url: z.string().url(),
      site: z.string(),
    }).optional(),
    draft: z.boolean().default(false),
    lastModified: z.date().optional(),
  }),
});

export const collections = {
  'blog': blogCollection,
}; 