/**
 * Calculate the reading time of a text in minutes
 * Based on average reading speed of 200 words per minute
 */
export function calculateReadingTime(content: string): number {
  // Remove HTML tags and special characters
  const cleanContent = content.replace(/<[^>]*>/g, '')
    .replace(/[^\w\s]/g, '')
    .trim();

  // Count words
  const wordCount = cleanContent.split(/\s+/).length;

  // Calculate reading time (200 words per minute)
  const readingTime = Math.ceil(wordCount / 200);

  // Return at least 1 minute
  return Math.max(1, readingTime);
} 