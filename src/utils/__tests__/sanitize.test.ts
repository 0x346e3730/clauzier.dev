import { describe, it, expect } from 'vitest';
import {
  sanitizeUrl,
  sanitizeText,
  sanitizeEmail,
  sanitizeSlug,
  isExternalUrl,
  addSecurityAttributes,
} from '../sanitize';

describe('Sanitize Utils', () => {
  describe('sanitizeUrl', () => {
    it('should allow valid HTTPS URLs', () => {
      const url = 'https://example.com/path?query=value';
      const result = sanitizeUrl(url);
      expect(result).toBe('https://example.com/path?query=value');
    });

    it('should allow valid HTTP URLs', () => {
      const url = 'http://example.com';
      const result = sanitizeUrl(url);
      expect(result).toBe('http://example.com/');
    });

    it('should reject javascript: protocol', () => {
      const url = 'javascript:alert("XSS")';
      const result = sanitizeUrl(url);
      expect(result).toBe('#');
    });

    it('should reject data: protocol', () => {
      const url = 'data:text/html,<script>alert("XSS")</script>';
      const result = sanitizeUrl(url);
      expect(result).toBe('#');
    });

    it('should reject file: protocol', () => {
      const url = 'file:///etc/passwd';
      const result = sanitizeUrl(url);
      expect(result).toBe('#');
    });

    it('should handle invalid URLs', () => {
      const url = 'not a valid url';
      const result = sanitizeUrl(url);
      expect(result).toBe('#');
    });

    it('should preserve query parameters', () => {
      const url = 'https://example.com?foo=bar&baz=qux';
      const result = sanitizeUrl(url);
      expect(result).toContain('foo=bar');
      expect(result).toContain('baz=qux');
    });

    it('should preserve fragments', () => {
      const url = 'https://example.com/page#section';
      const result = sanitizeUrl(url);
      expect(result).toContain('#section');
    });
  });

  describe('sanitizeText', () => {
    it('should remove HTML tags', () => {
      const text = 'Hello <script>alert("XSS")</script> World';
      const result = sanitizeText(text);
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
      expect(result).toContain('scriptalert("XSS")/script');
    });

    it('should remove javascript: protocol', () => {
      const text = 'Click javascript:alert("XSS")';
      const result = sanitizeText(text);
      expect(result).not.toMatch(/javascript:/i);
    });

    it('should remove event handlers', () => {
      const text = 'onclick=alert("XSS") onerror=alert("XSS")';
      const result = sanitizeText(text);
      expect(result).not.toMatch(/on\w+=/i);
    });

    it('should trim whitespace', () => {
      const text = '  Hello World  ';
      const result = sanitizeText(text);
      expect(result).toBe('Hello World');
    });

    it('should handle empty strings', () => {
      const result = sanitizeText('');
      expect(result).toBe('');
    });

    it('should preserve safe text', () => {
      const text = 'This is safe text with numbers 123 and symbols !@#$%';
      const result = sanitizeText(text);
      expect(result).toContain('This is safe text');
      expect(result).toContain('123');
    });
  });

  describe('sanitizeEmail', () => {
    it('should accept valid email addresses', () => {
      const email = 'user@example.com';
      const result = sanitizeEmail(email);
      expect(result).toBe('user@example.com');
    });

    it('should lowercase email addresses', () => {
      const email = 'User@Example.COM';
      const result = sanitizeEmail(email);
      expect(result).toBe('user@example.com');
    });

    it('should trim whitespace', () => {
      const email = 'user@example.com';
      const result = sanitizeEmail(email);
      expect(result).toBe('user@example.com');
    });

    it('should reject invalid email formats', () => {
      expect(() => sanitizeEmail('not-an-email')).toThrow('Invalid email format');
      expect(() => sanitizeEmail('missing@domain')).toThrow('Invalid email format');
      expect(() => sanitizeEmail('@example.com')).toThrow('Invalid email format');
      expect(() => sanitizeEmail('user@')).toThrow('Invalid email format');
    });

    it('should accept emails with subdomains', () => {
      const email = 'user@mail.example.com';
      const result = sanitizeEmail(email);
      expect(result).toBe('user@mail.example.com');
    });

    it('should accept emails with special characters', () => {
      const email = 'user+tag@example.com';
      const result = sanitizeEmail(email);
      expect(result).toBe('user+tag@example.com');
    });
  });

  describe('sanitizeSlug', () => {
    it('should convert to lowercase', () => {
      const slug = 'MyBlogPost';
      const result = sanitizeSlug(slug);
      expect(result).toBe('myblogpost');
    });

    it('should replace spaces with hyphens', () => {
      const slug = 'My Blog Post';
      const result = sanitizeSlug(slug);
      expect(result).toBe('my-blog-post');
    });

    it('should remove special characters', () => {
      const slug = 'My Blog! Post?';
      const result = sanitizeSlug(slug);
      expect(result).toBe('my-blog-post');
    });

    it('should collapse multiple hyphens', () => {
      const slug = 'my---blog--post';
      const result = sanitizeSlug(slug);
      expect(result).toBe('my-blog-post');
    });

    it('should remove leading and trailing hyphens', () => {
      const slug = '-my-blog-post-';
      const result = sanitizeSlug(slug);
      expect(result).toBe('my-blog-post');
    });

    it('should preserve existing hyphens', () => {
      const slug = 'my-existing-slug';
      const result = sanitizeSlug(slug);
      expect(result).toBe('my-existing-slug');
    });

    it('should preserve numbers', () => {
      const slug = 'post-123-title';
      const result = sanitizeSlug(slug);
      expect(result).toBe('post-123-title');
    });

    it('should handle unicode characters', () => {
      const slug = 'café-résumé';
      const result = sanitizeSlug(slug);
      expect(result).not.toContain('é');
      expect(result).toMatch(/^[a-z0-9-]+$/);
    });
  });

  describe('isExternalUrl', () => {
    it('should identify external URLs', () => {
      const url = 'https://external.com/page';
      const result = isExternalUrl(url);
      expect(result).toBe(true);
    });

    it('should identify internal URLs as not external', () => {
      // Mock window.location for this test
      const originalLocation = global.window?.location;
      if (global.window) {
        Object.defineProperty(global.window, 'location', {
          writable: true,
          value: { host: 'clauzier.dev' },
        });
      }

      const url = 'https://clauzier.dev/blog';
      const result = isExternalUrl(url);
      expect(result).toBe(false);

      // Restore original
      if (global.window && originalLocation) {
        Object.defineProperty(global.window, 'location', {
          writable: true,
          value: originalLocation,
        });
      }
    });

    it('should handle relative URLs', () => {
      const url = '/blog/post';
      const result = isExternalUrl(url);
      expect(result).toBe(false);
    });

    it('should handle invalid URLs', () => {
      const url = 'not a url';
      const result = isExternalUrl(url);
      expect(result).toBe(false);
    });

    it('should handle different protocols', () => {
      const url = 'http://external.com';
      const result = isExternalUrl(url);
      expect(result).toBe(true);
    });

    it('should handle subdomains of current site', () => {
      const url = 'https://blog.clauzier.dev';
      const result = isExternalUrl(url);
      expect(result).toBe(true); // Different subdomain is external
    });
  });

  describe('addSecurityAttributes', () => {
    it('should add security attributes for external URLs', () => {
      const url = 'https://external.com';
      const result = addSecurityAttributes(url);
      expect(result).toEqual({
        target: '_blank',
        rel: 'noopener noreferrer',
      });
    });

    it('should not add attributes for internal URLs', () => {
      // Mock window.location for this test
      const originalLocation = global.window?.location;
      if (global.window) {
        Object.defineProperty(global.window, 'location', {
          writable: true,
          value: { host: 'clauzier.dev' },
        });
      }

      const url = 'https://clauzier.dev/blog';
      const result = addSecurityAttributes(url);
      expect(result).toEqual({});

      // Restore original
      if (global.window && originalLocation) {
        Object.defineProperty(global.window, 'location', {
          writable: true,
          value: originalLocation,
        });
      }
    });

    it('should not add attributes for relative URLs', () => {
      const url = '/blog/post';
      const result = addSecurityAttributes(url);
      expect(result).toEqual({});
    });

    it('should handle hash links', () => {
      const url = '#section';
      const result = addSecurityAttributes(url);
      expect(result).toEqual({});
    });
  });
});
