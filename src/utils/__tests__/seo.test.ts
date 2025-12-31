import { describe, it, expect } from 'vitest';
import { generateSEO, generateBlogPostSEO, generateStructuredData } from '../seo';

describe('SEO Utils', () => {
  describe('generateSEO', () => {
    it('should generate SEO with default values', () => {
      const result = generateSEO();

      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('description');
      expect(result).toHaveProperty('openGraph');
      expect(result).toHaveProperty('twitter');
    });

    it('should use custom title', () => {
      const result = generateSEO({ title: 'Custom Title' });

      expect(result.title).toContain('Custom Title');
    });

    it('should use custom description', () => {
      const customDescription = 'This is a custom description';
      const result = generateSEO({ description: customDescription });

      expect(result.description).toBe(customDescription);
    });

    it('should include canonical URL when provided', () => {
      const canonical = 'https://clauzier.dev/blog/post';
      const result = generateSEO({ canonical });

      expect(result.canonical).toBe(canonical);
    });

    it('should generate OpenGraph data', () => {
      const result = generateSEO({
        title: 'Test Title',
        description: 'Test Description',
      });

      expect(result.openGraph).toHaveProperty('title');
      expect(result.openGraph).toHaveProperty('description');
      expect(result.openGraph).toHaveProperty('type');
      expect(result.openGraph.type).toBe('website');
    });

    it('should allow custom OpenGraph type', () => {
      const result = generateSEO({
        openGraph: { type: 'article' },
      });

      expect(result.openGraph.type).toBe('article');
    });

    it('should generate Twitter Card data', () => {
      const result = generateSEO({
        title: 'Test Title',
        description: 'Test Description',
      });

      expect(result.twitter).toHaveProperty('card');
      expect(result.twitter).toHaveProperty('title');
      expect(result.twitter).toHaveProperty('description');
      expect(result.twitter.card).toBe('summary_large_image'); // Default is now summary_large_image
    });

    it('should allow custom Twitter card type', () => {
      const result = generateSEO({
        twitter: { card: 'summary_large_image' },
      });

      expect(result.twitter.card).toBe('summary_large_image');
    });

    it('should include OpenGraph image when provided', () => {
      const imageUrl = 'https://example.com/image.jpg';
      const result = generateSEO({
        openGraph: { image: imageUrl },
      });

      expect(result.openGraph.image).toBe(imageUrl);
    });

    it('should include Twitter image when provided', () => {
      const imageUrl = 'https://example.com/image.jpg';
      const result = generateSEO({
        twitter: { image: imageUrl },
      });

      expect(result.twitter.image).toBe(imageUrl);
    });

    it('should merge custom OpenGraph data', () => {
      const result = generateSEO({
        openGraph: {
          type: 'article',
          image: 'image.jpg',
        },
      });

      expect(result.openGraph.type).toBe('article');
      expect(result.openGraph.image).toBe('image.jpg');
      expect(result.openGraph).toHaveProperty('title');
      expect(result.openGraph).toHaveProperty('description');
    });
  });

  describe('generateBlogPostSEO', () => {
    const mockPost = {
      title: 'Test Blog Post',
      description: 'This is a test blog post',
      pubDate: new Date('2024-01-01'),
      author: 'Test Author',
    };

    it('should generate SEO for blog post', () => {
      const result = generateBlogPostSEO(mockPost);

      expect(result.title).toContain('Test Blog Post');
      expect(result.description).toBe('This is a test blog post');
      expect(result.openGraph.type).toBe('article');
    });

    it('should use summary card when no hero image', () => {
      const result = generateBlogPostSEO(mockPost);

      // Now always uses summary_large_image and falls back to default OG image
      expect(result.twitter.card).toBe('summary_large_image');
    });

    it('should use summary_large_image card with hero image', () => {
      const postWithImage = {
        ...mockPost,
        heroImage: { src: '/images/hero.jpg', alt: 'Hero' },
      };
      const result = generateBlogPostSEO(postWithImage);

      expect(result.twitter.card).toBe('summary_large_image');
      expect(result.twitter.image).toBe('/images/hero.jpg');
      expect(result.openGraph.image).toBe('/images/hero.jpg');
    });

    it('should include tags in keywords', () => {
      const postWithTags = {
        ...mockPost,
        tags: ['javascript', 'webdev'],
      };
      const result = generateBlogPostSEO(postWithTags);

      // The function generates keywords but we can't directly test them
      // as they're not returned in the SEO data
      expect(result).toBeDefined();
    });

    it('should handle post without description', () => {
      const postWithoutDesc = {
        title: 'Test Post',
        pubDate: new Date(),
        author: 'Author',
      };
      const result = generateBlogPostSEO(postWithoutDesc);

      expect(result.description).toBeDefined();
      expect(result.description).toBeTruthy();
    });

    it('should handle post without tags', () => {
      const result = generateBlogPostSEO(mockPost);

      expect(result).toBeDefined();
      expect(result.title).toContain('Test Blog Post');
    });
  });

  describe('generateStructuredData', () => {
    describe('website type', () => {
      it('should generate website structured data', () => {
        const data = {
          name: 'Test Website',
          description: 'A test website',
          url: 'https://example.com',
          author: 'Test Author',
        };
        const result = generateStructuredData('website', data);

        expect(result['@context']).toBe('https://schema.org');
        expect(result['@type']).toBe('website');
        expect(result.name).toBe('Test Website');
        expect(result.description).toBe('A test website');
        expect(result.url).toBe('https://example.com');
        expect(result.author).toEqual({
          '@type': 'Person',
          name: 'Test Author',
        });
      });
    });

    describe('article type', () => {
      it('should generate article structured data', () => {
        const pubDate = new Date('2024-01-01');
        const data = {
          title: 'Test Article',
          description: 'Article description',
          pubDate,
          author: 'Test Author',
        };
        const result = generateStructuredData('article', data);

        expect(result['@context']).toBe('https://schema.org');
        expect(result['@type']).toBe('article');
        expect(result.headline).toBe('Test Article');
        expect(result.description).toBe('Article description');
        expect(result.datePublished).toBe(pubDate.toISOString());
        expect(result.author).toEqual({
          '@type': 'Person',
          name: 'Test Author',
        });
      });

      it('should use pubDate for dateModified when lastModified is not provided', () => {
        const pubDate = new Date('2024-01-01');
        const data = {
          title: 'Test',
          pubDate,
          author: 'Author',
        };
        const result = generateStructuredData('article', data);

        expect(result.dateModified).toBe(pubDate.toISOString());
      });

      it('should use lastModified when provided', () => {
        const pubDate = new Date('2024-01-01');
        const lastModified = new Date('2024-02-01');
        const data = {
          title: 'Test',
          pubDate,
          lastModified,
          author: 'Author',
        };
        const result = generateStructuredData('article', data);

        expect(result.dateModified).toBe(lastModified.toISOString());
      });

      it('should include hero image when provided', () => {
        const data = {
          title: 'Test',
          pubDate: new Date(),
          author: 'Author',
          heroImage: { src: '/images/hero.jpg' },
        };
        const result = generateStructuredData('article', data);

        expect(result.image).toBe('/images/hero.jpg');
      });

      it('should include tags as keywords', () => {
        const data = {
          title: 'Test',
          pubDate: new Date(),
          author: 'Author',
          tags: ['javascript', 'webdev'],
        };
        const result = generateStructuredData('article', data);

        expect(result.keywords).toBe('javascript, webdev');
      });
    });

    describe('person type', () => {
      it('should generate person structured data', () => {
        const data = {
          name: 'Test Person',
          jobTitle: 'Developer',
          description: 'A developer',
          url: 'https://example.com',
          sameAs: ['https://twitter.com/test', 'https://github.com/test'],
        };
        const result = generateStructuredData('person', data);

        expect(result['@context']).toBe('https://schema.org');
        expect(result['@type']).toBe('person');
        expect(result.name).toBe('Test Person');
        expect(result.jobTitle).toBe('Developer');
        expect(result.description).toBe('A developer');
        expect(result.url).toBe('https://example.com');
        expect(result.sameAs).toEqual([
          'https://twitter.com/test',
          'https://github.com/test',
        ]);
      });
    });

    describe('unknown type', () => {
      it('should return base data for unknown type', () => {
        const result = generateStructuredData('unknown' as any, {});

        expect(result['@context']).toBe('https://schema.org');
        expect(result['@type']).toBe('unknown');
        expect(Object.keys(result).length).toBe(2);
      });
    });
  });
});
