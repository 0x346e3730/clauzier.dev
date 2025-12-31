import { describe, it, expect } from 'vitest';
import { calculateReadingTime, calculateDetailedReadingTime } from '../readingTime';

describe('Reading Time Utils', () => {
  describe('calculateReadingTime', () => {
    it('should calculate reading time for plain text', () => {
      // 200 words should take 1 minute
      const words = Array(200).fill('word').join(' ');
      const result = calculateReadingTime(words);
      expect(result).toBe(1);
    });

    it('should calculate reading time for longer content', () => {
      // 500 words should take 3 minutes (500/200 = 2.5, rounded up to 3)
      const words = Array(500).fill('word').join(' ');
      const result = calculateReadingTime(words);
      expect(result).toBe(3);
    });

    it('should return at least 1 minute for short content', () => {
      const result = calculateReadingTime('Just a few words');
      expect(result).toBe(1);
    });

    it('should strip HTML tags before counting', () => {
      const htmlContent = '<p>This is <strong>HTML</strong> content with <a href="#">links</a></p>';
      const result = calculateReadingTime(htmlContent);
      expect(result).toBe(1); // "This is HTML content with links" = 6 words
    });

    it('should handle empty strings', () => {
      const result = calculateReadingTime('');
      expect(result).toBe(1); // Returns safe fallback of 1 minute due to error handling
    });

    it('should handle markdown-like content', () => {
      const markdown = '# Heading\n\nThis is **bold** and *italic* text.';
      const result = calculateReadingTime(markdown);
      expect(result).toBe(1);
    });

    it('should handle multiple spaces and newlines', () => {
      const content = 'Word1    Word2\n\n\nWord3     Word4';
      const result = calculateReadingTime(content);
      expect(result).toBe(1); // 4 words
    });
  });

  describe('calculateDetailedReadingTime', () => {
    it('should return detailed reading time information', () => {
      const words = Array(400).fill('word').join(' ');
      const result = calculateDetailedReadingTime(words);

      expect(result).toHaveProperty('text');
      expect(result).toHaveProperty('minutes');
      expect(result).toHaveProperty('time');
      expect(result).toHaveProperty('words');
      expect(result.minutes).toBe(2); // 400/200 = 2
      expect(result.words).toBe(400);
      expect(result.text).toBe('2 min read');
      expect(result.time).toBe(2 * 60 * 1000); // 2 minutes in milliseconds
    });

    it('should remove markdown images', () => {
      const content = '![Alt text](image.png) Some text here';
      const result = calculateDetailedReadingTime(content);
      expect(result.words).toBe(3); // "Some text here"
    });

    it('should remove markdown links', () => {
      const content = '[Link text](https://example.com) more words';
      const result = calculateDetailedReadingTime(content);
      expect(result.words).toBe(2); // "more words"
    });

    it('should remove markdown formatting characters', () => {
      const content = '**bold** *italic* `code` ~strikethrough~';
      const result = calculateDetailedReadingTime(content);
      expect(result.words).toBe(4); // "bold italic code strikethrough"
    });

    it('should normalize whitespace', () => {
      const content = 'Word1    Word2\n\n\nWord3';
      const result = calculateDetailedReadingTime(content);
      expect(result.words).toBe(3);
    });

    it('should return zero for empty content', () => {
      const result = calculateDetailedReadingTime('');
      // Returns safe default due to error handling
      expect(result.minutes).toBe(0);
      expect(result.words).toBe(0);
      expect(result.time).toBe(0);
      expect(result.text).toBe('0 min read');
    });

    it('should return minimum 1 minute for non-empty content', () => {
      const result = calculateDetailedReadingTime('Just one word');
      expect(result.minutes).toBe(1);
      expect(result.text).toBe('1 min read');
    });

    it('should handle large content', () => {
      const words = Array(1000).fill('word').join(' ');
      const result = calculateDetailedReadingTime(words);
      expect(result.minutes).toBe(5); // 1000/200 = 5
      expect(result.words).toBe(1000);
      expect(result.text).toBe('5 min read');
    });

    it('should handle HTML and markdown mixed content', () => {
      const content = `
        # Title
        <div>
          This is **important** content with <strong>HTML</strong>.
          ![Image](img.png)
          [Link](url)
        </div>
      `;
      const result = calculateDetailedReadingTime(content);
      // Should extract: "Title This is important content with HTML"
      expect(result.words).toBeGreaterThan(0);
      expect(result.minutes).toBeGreaterThan(0);
    });
  });
});
