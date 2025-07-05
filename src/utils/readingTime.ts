import { handleError, validateRequired } from './errors';

export interface ReadingTimeResult {
  text: string;
  minutes: number;
  time: number;
  words: number;
}

const WORDS_PER_MINUTE = 200;

/**
 * Calculate the reading time of a text in minutes
 * Based on average reading speed of 200 words per minute
 */
export function calculateReadingTime(content: string): number {
  try {
    validateRequired(content, 'content');
    
    // Remove HTML tags and special characters
    const cleanContent = content.replace(/<[^>]*>/g, '')
      .replace(/[^\w\s]/g, '')
      .trim();

    // Count words
    const wordCount = cleanContent.split(/\s+/).filter(word => word.length > 0).length;

    // Calculate reading time (200 words per minute)
    const readingTime = Math.ceil(wordCount / WORDS_PER_MINUTE);

    // Return at least 1 minute
    return Math.max(1, readingTime);
  } catch (error) {
    handleError(error, 'calculateReadingTime');
    return 1; // Safe fallback
  }
}

export const calculateDetailedReadingTime = (content: string): ReadingTimeResult => {
  try {
    validateRequired(content, 'content');

    // Remove markdown syntax and HTML tags
    const cleanContent = content
      .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
      .replace(/\[.*?\]\(.*?\)/g, '') // Remove links
      .replace(/[#*`_~]/g, '') // Remove markdown formatting
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    // Count words
    const words = cleanContent.split(' ').filter(word => word.length > 0).length;
    
    if (words === 0) {
      return {
        text: '0 min read',
        minutes: 0,
        time: 0,
        words: 0,
      };
    }

    // Calculate reading time
    const minutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
    const time = minutes * 60 * 1000; // in milliseconds

    return {
      text: `${minutes} min read`,
      minutes,
      time,
      words,
    };
  } catch (error) {
    handleError(error, 'calculateDetailedReadingTime');
    
    // Return safe default
    return {
      text: '0 min read',
      minutes: 0,
      time: 0,
      words: 0,
    };
  }
}; 