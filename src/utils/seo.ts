import type { SEOData } from '../types/common';
import { SEO_DEFAULTS } from '../constants/site';

export const generateSEO = (data: Partial<SEOData> = {}): SEOData => {
  const title = data.title 
    ? `${data.title} | ${SEO_DEFAULTS.TITLE_TEMPLATE.replace('%s', '')}`
    : SEO_DEFAULTS.TITLE_TEMPLATE.replace('%s | ', '');

  return {
    title,
    description: data.description || SEO_DEFAULTS.DESCRIPTION,
    canonical: data.canonical,
    openGraph: {
      title: data.openGraph?.title || title,
      description: data.openGraph?.description || data.description || SEO_DEFAULTS.DESCRIPTION,
      type: data.openGraph?.type || 'website',
      image: data.openGraph?.image,
      ...data.openGraph,
    },
    twitter: {
      card: data.twitter?.card || 'summary',
      title: data.twitter?.title || title,
      description: data.twitter?.description || data.description || SEO_DEFAULTS.DESCRIPTION,
      image: data.twitter?.image,
      ...data.twitter,
    },
  };
};

export const generateBlogPostSEO = (post: {
  title: string;
  description?: string;
  pubDate: Date;
  author: string;
  tags?: string[];
  heroImage?: { src: string; alt: string };
}): SEOData => {
  const keywords = post.tags ? [...SEO_DEFAULTS.KEYWORDS, ...post.tags] : SEO_DEFAULTS.KEYWORDS;
  
  return generateSEO({
    title: post.title,
    description: post.description,
    openGraph: {
      type: 'article',
      image: post.heroImage?.src,
    },
    twitter: {
      card: post.heroImage ? 'summary_large_image' : 'summary',
      image: post.heroImage?.src,
    },
  });
};

export const generateStructuredData = (type: 'website' | 'article' | 'person', data: any) => {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type,
  };

  switch (type) {
    case 'website':
      return {
        ...baseData,
        name: data.name,
        description: data.description,
        url: data.url,
        author: {
          '@type': 'Person',
          name: data.author,
        },
      };
    
    case 'article':
      return {
        ...baseData,
        headline: data.title,
        description: data.description,
        datePublished: data.pubDate.toISOString(),
        dateModified: data.lastModified?.toISOString() || data.pubDate.toISOString(),
        author: {
          '@type': 'Person',
          name: data.author,
        },
        image: data.heroImage?.src,
        keywords: data.tags?.join(', '),
      };
    
    case 'person':
      return {
        ...baseData,
        name: data.name,
        jobTitle: data.jobTitle,
        description: data.description,
        url: data.url,
        sameAs: data.sameAs,
      };
    
    default:
      return baseData;
  }
};