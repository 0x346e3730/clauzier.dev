/**
 * Open Graph Image Utilities
 * Generates and manages OG images for social sharing
 */

import { SITE_CONFIG } from '../constants/site';

export interface OGImageOptions {
  title?: string;
  description?: string;
  type?: 'default' | 'blog' | 'profile';
}

/**
 * Get the OG image URL for a given page
 * For now, uses a default template. Can be extended to generate dynamic images.
 */
export function getOGImage(options: OGImageOptions = {}): string {
  const { type = 'default' } = options;

  // For now, use the template SVG as the default
  // In the future, this could generate dynamic images using:
  // - @vercel/og for edge rendering
  // - Puppeteer for server-side generation
  // - Canvas API for runtime generation

  const baseUrl = SITE_CONFIG.url || 'https://clauzier.dev';

  switch (type) {
    case 'blog':
      // Future: Generate custom OG image for blog posts with title
      return `${baseUrl}/og-image-template.svg`;

    case 'profile':
      // Future: Use profile picture for resume/about pages
      return `${baseUrl}/og-image-template.svg`;

    case 'default':
    default:
      return `${baseUrl}/og-image-template.svg`;
  }
}

/**
 * Get Twitter card type based on content
 */
export function getTwitterCardType(hasImage: boolean): 'summary' | 'summary_large_image' {
  return hasImage ? 'summary_large_image' : 'summary';
}

/**
 * Validate OG image URL
 */
export function isValidOGImage(url: string | undefined): boolean {
  if (!url) return false;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
