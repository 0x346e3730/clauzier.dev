/**
 * Image optimization utilities and configurations
 */

export interface ImageOptimizationConfig {
  quality: number;
  format: 'webp' | 'avif' | 'jpeg' | 'png';
  sizes: string;
  loading: 'lazy' | 'eager';
  width?: number;
  height?: number;
}

export interface ResponsiveImageSizes {
  mobile: number;
  tablet: number;
  desktop: number;
  xl: number;
}

// Default responsive breakpoints
export const DEFAULT_BREAKPOINTS: ResponsiveImageSizes = {
  mobile: 320,
  tablet: 768,
  desktop: 1024,
  xl: 1920,
};

// Image quality presets
export const QUALITY_PRESETS = {
  low: 60,
  medium: 75,
  high: 85,
  max: 95,
} as const;

// Format priority for modern browsers
export const FORMAT_PRIORITY = ['avif', 'webp', 'jpeg', 'png'] as const;

/**
 * Generate responsive image sizes string
 */
export function generateResponsiveSizes(
  breakpoints: Partial<ResponsiveImageSizes> = {}
): string {
  const sizes = { ...DEFAULT_BREAKPOINTS, ...breakpoints };
  
  return [
    `(max-width: ${sizes.mobile}px) ${sizes.mobile}px`,
    `(max-width: ${sizes.tablet}px) ${sizes.tablet}px`,
    `(max-width: ${sizes.desktop}px) ${sizes.desktop}px`,
    `${sizes.xl}px`,
  ].join(', ');
}

/**
 * Get optimal image configuration based on context
 */
export function getImageConfig(
  context: 'hero' | 'thumbnail' | 'content' | 'avatar' | 'icon',
  customConfig: Partial<ImageOptimizationConfig> = {}
): ImageOptimizationConfig {
  const baseConfigs = {
    hero: {
      quality: QUALITY_PRESETS.high,
      format: 'webp' as const,
      sizes: generateResponsiveSizes(),
      loading: 'eager' as const,
      width: 1920,
      height: 1080,
    },
    thumbnail: {
      quality: QUALITY_PRESETS.medium,
      format: 'webp' as const,
      sizes: generateResponsiveSizes({ mobile: 150, tablet: 200, desktop: 250, xl: 300 }),
      loading: 'lazy' as const,
      width: 300,
      height: 200,
    },
    content: {
      quality: QUALITY_PRESETS.medium,
      format: 'webp' as const,
      sizes: generateResponsiveSizes({ mobile: 300, tablet: 600, desktop: 800, xl: 1000 }),
      loading: 'lazy' as const,
    },
    avatar: {
      quality: QUALITY_PRESETS.high,
      format: 'webp' as const,
      sizes: generateResponsiveSizes({ mobile: 64, tablet: 128, desktop: 256, xl: 512 }),
      loading: 'eager' as const,
      width: 512,
      height: 512,
    },
    icon: {
      quality: QUALITY_PRESETS.max,
      format: 'webp' as const,
      sizes: generateResponsiveSizes({ mobile: 24, tablet: 32, desktop: 48, xl: 64 }),
      loading: 'lazy' as const,
      width: 64,
      height: 64,
    },
  };

  return { ...baseConfigs[context], ...customConfig };
}

/**
 * Generate srcset for responsive images
 */
export function generateSrcSet(
  baseSrc: string,
  breakpoints: ResponsiveImageSizes = DEFAULT_BREAKPOINTS
): string {
  return Object.values(breakpoints)
    .map(width => `${baseSrc}?w=${width}&f=webp&q=75 ${width}w`)
    .join(', ');
}

/**
 * Get WebP fallback URL
 */
export function getWebPUrl(src: string, quality: number = 75): string {
  if (src.includes('?')) {
    return `${src}&f=webp&q=${quality}`;
  }
  return `${src}?f=webp&q=${quality}`;
}

/**
 * Get AVIF URL for next-gen format
 */
export function getAVIFUrl(src: string, quality: number = 75): string {
  if (src.includes('?')) {
    return `${src}&f=avif&q=${quality}`;
  }
  return `${src}?f=avif&q=${quality}`;
}

/**
 * Lazy loading intersection observer setup
 */
export function setupLazyLoading(): IntersectionObserver {
  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
            
            // Add loading class for animation
            img.classList.add('loading');
            
            img.onload = () => {
              img.classList.remove('loading');
              img.classList.add('loaded');
            };
          }
        }
      });
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.01,
    }
  );

  return imageObserver;
}

/**
 * Preload critical images
 */
export function preloadCriticalImages(images: string[]): void {
  images.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = getWebPUrl(src, QUALITY_PRESETS.high);
    document.head.appendChild(link);
  });
}

/**
 * Image format detection and polyfill
 */
export async function detectImageSupport(): Promise<{
  webp: boolean;
  avif: boolean;
}> {
  const testImages = {
    webp: 'data:image/webp;base64,UklGRhgAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAsAAAABBxAREYiI/gcAAABWUDggGAAAADABAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==',
    avif: 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=',
  };

  const results = { webp: false, avif: false };

  try {
    // Test WebP support
    const webpImg = new Image();
    results.webp = await new Promise(resolve => {
      webpImg.onload = () => resolve(webpImg.width === 1);
      webpImg.onerror = () => resolve(false);
      webpImg.src = testImages.webp;
    });

    // Test AVIF support
    const avifImg = new Image();
    results.avif = await new Promise(resolve => {
      avifImg.onload = () => resolve(avifImg.width === 1);
      avifImg.onerror = () => resolve(false);
      avifImg.src = testImages.avif;
    });
  } catch (error) {
    console.warn('Error detecting image format support:', error);
  }

  return results;
}

/**
 * CDN URL generator (placeholder for future CDN implementation)
 */
export function getCDNUrl(
  src: string,
  transformations: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
  } = {}
): string {
  // For now, return optimized local URL
  // In the future, this could integrate with Cloudinary, ImageKit, etc.
  const params = new URLSearchParams();
  
  if (transformations.width) params.set('w', transformations.width.toString());
  if (transformations.height) params.set('h', transformations.height.toString());
  if (transformations.quality) params.set('q', transformations.quality.toString());
  if (transformations.format) params.set('f', transformations.format);
  
  const queryString = params.toString();
  return queryString ? `${src}?${queryString}` : src;
}

/**
 * Generate picture element with multiple formats
 */
export function generatePictureHTML(
  src: string,
  alt: string,
  config: ImageOptimizationConfig
): string {
  const avifSrc = getAVIFUrl(src, config.quality);
  const webpSrc = getWebPUrl(src, config.quality);
  
  return `
    <picture>
      <source srcset="${avifSrc}" type="image/avif">
      <source srcset="${webpSrc}" type="image/webp">
      <img 
        src="${src}" 
        alt="${alt}"
        width="${config.width || ''}"
        height="${config.height || ''}"
        loading="${config.loading}"
        sizes="${config.sizes}"
      >
    </picture>
  `;
}