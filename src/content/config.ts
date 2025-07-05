import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    description: z.string().optional(),
    author: z.string().default('Antonin CLAUZIER'),
    tags: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
    series: z.string().optional(),
    seriesOrder: z.number().optional(),
    heroImage: z.object({
      src: z.string(),
      alt: z.string(),
      caption: z.string().optional(),
    }).optional(),
    images: z.array(z.object({
      src: z.string(),
      alt: z.string(),
      caption: z.string().optional(),
    })).optional(),
    external: z.object({
      url: z.string().url(),
      site: z.string(),
    }).optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    lastModified: z.date().optional(),
    readingTime: z.number().optional(), // in minutes
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    canonical: z.string().url().optional(),
  }),
});

export const collections = {
  'blog': blogCollection,
}; 