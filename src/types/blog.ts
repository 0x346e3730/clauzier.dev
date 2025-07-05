import type { CollectionEntry } from 'astro:content';
import type { ImageData } from './common';

export type BlogPost = CollectionEntry<'blog'>;

export interface BlogProps {
  post: BlogPost;
}

export interface BlogPostSummary {
  slug: string;
  title: string;
  description: string;
  pubDate: Date;
  tags?: string[];
  categories?: string[];
  readingTime?: number;
  featured?: boolean;
  heroImage?: ImageData;
}

export interface BlogCategory {
  name: string;
  slug: string;
  description?: string;
  count: number;
}

export interface BlogSeries {
  name: string;
  slug: string;
  description?: string;
  posts: BlogPostSummary[];
}

export interface BlogTag {
  name: string;
  slug: string;
  count: number;
} 