/**
 * Bundle optimization utilities and dynamic imports
 */

// Dynamic import utilities for code splitting
export const loadComponent = async <T>(
  componentFactory: () => Promise<{ default: T }>
): Promise<T> => {
  try {
    const module = await componentFactory();
    return module.default;
  } catch (error) {
    console.error('Failed to load component:', error);
    throw error;
  }
};

// Lazy load utilities with retry logic
export const loadWithRetry = async <T>(
  loader: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await loader();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      console.warn(`Load attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
  
  throw new Error('Max retries exceeded');
};

// Feature detection for conditional loading
export const shouldLoadFeature = (feature: string): boolean => {
  const features = {
    // Modern browser features
    webp: () => {
      const canvas = document.createElement('canvas');
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    },
    
    avif: () => {
      const canvas = document.createElement('canvas');
      return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
    },
    
    // API availability
    intersection: () => 'IntersectionObserver' in window,
    
    serviceWorker: () => 'serviceWorker' in navigator,
    
    // Connection quality
    highBandwidth: () => {
      const connection = (navigator as any).connection;
      if (!connection) return true; // Assume high bandwidth if unknown
      
      return connection.effectiveType === '4g' && connection.downlink > 1.5;
    },
    
    // Device capabilities
    reducedMotion: () => {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    },
  };
  
  const detector = features[feature as keyof typeof features];
  return detector ? detector() : true;
};

// Progressive enhancement loader
export class ProgressiveEnhancer {
  private loadedFeatures = new Set<string>();
  
  async enhance(feature: string, loader: () => Promise<any>): Promise<void> {
    if (this.loadedFeatures.has(feature)) {
      return;
    }
    
    if (!shouldLoadFeature(feature)) {
      console.log(`Skipping feature ${feature} - not supported or appropriate`);
      return;
    }
    
    try {
      await loader();
      this.loadedFeatures.add(feature);
      console.log(`Enhanced with feature: ${feature}`);
    } catch (error) {
      console.error(`Failed to enhance with feature ${feature}:`, error);
    }
  }
  
  isLoaded(feature: string): boolean {
    return this.loadedFeatures.has(feature);
  }
}

// Bundle analyzer for runtime insights
export class BundleAnalyzer {
  private chunks = new Map<string, number>();
  private loadTimes = new Map<string, number>();
  
  trackChunkLoad(chunkName: string, size: number): void {
    this.chunks.set(chunkName, size);
  }
  
  trackLoadTime(chunkName: string, duration: number): void {
    this.loadTimes.set(chunkName, duration);
  }
  
  getAnalytics(): {
    totalSize: number;
    chunkCount: number;
    averageLoadTime: number;
    largestChunk: string | null;
  } {
    const totalSize = Array.from(this.chunks.values()).reduce((sum, size) => sum + size, 0);
    const chunkCount = this.chunks.size;
    const totalLoadTime = Array.from(this.loadTimes.values()).reduce((sum, time) => sum + time, 0);
    const averageLoadTime = this.loadTimes.size > 0 ? totalLoadTime / this.loadTimes.size : 0;
    
    let largestChunk: string | null = null;
    let largestSize = 0;
    
    for (const [chunk, size] of this.chunks.entries()) {
      if (size > largestSize) {
        largestSize = size;
        largestChunk = chunk;
      }
    }
    
    return {
      totalSize,
      chunkCount,
      averageLoadTime,
      largestChunk,
    };
  }
  
  report(): void {
    const analytics = this.getAnalytics();
    console.group('Bundle Analytics');
    console.log('Total Size:', `${(analytics.totalSize / 1024).toFixed(2)} KB`);
    console.log('Chunk Count:', analytics.chunkCount);
    console.log('Average Load Time:', `${analytics.averageLoadTime.toFixed(2)}ms`);
    console.log('Largest Chunk:', analytics.largestChunk);
    console.groupEnd();
  }
}

// Resource prioritization
export const prioritizeResources = (): void => {
  // Critical resources first
  const criticalResources = [
    '/_astro/critical.css',
    '/_astro/app.js',
  ];
  
  // Preload critical resources
  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    
    if (resource.endsWith('.css')) {
      link.as = 'style';
    } else if (resource.endsWith('.js')) {
      link.as = 'script';
    }
    
    document.head.appendChild(link);
  });
  
  // Prefetch non-critical resources on idle
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      const nonCriticalResources = [
        '/blog/',
        '/resume/',
        '/_astro/components.js',
      ];
      
      nonCriticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = resource;
        document.head.appendChild(link);
      });
    });
  }
};

// Intelligent code splitting based on user behavior
export class IntelligentLoader {
  private userBehavior = {
    pageViews: 0,
    timeSpent: 0,
    interactions: 0,
  };
  
  constructor() {
    this.trackBehavior();
  }
  
  private trackBehavior(): void {
    // Track page views
    this.userBehavior.pageViews++;
    
    // Track time spent
    const startTime = Date.now();
    window.addEventListener('beforeunload', () => {
      this.userBehavior.timeSpent += Date.now() - startTime;
    });
    
    // Track interactions
    ['click', 'scroll', 'keydown'].forEach(event => {
      document.addEventListener(event, () => {
        this.userBehavior.interactions++;
      }, { once: true, passive: true });
    });
  }
  
  async loadBasedOnBehavior(): Promise<void> {
    // Load advanced features for engaged users
    if (this.userBehavior.interactions > 3 || this.userBehavior.timeSpent > 30000) {
      await this.loadAdvancedFeatures();
    }
    
    // Load blog-related features if user seems interested in content
    if (this.userBehavior.pageViews > 1) {
      await this.loadContentFeatures();
    }
  }
  
  private async loadAdvancedFeatures(): Promise<void> {
    // Load search functionality
    if (!document.querySelector('#search-loaded')) {
      // const searchModule = await import('../components/Search.js').catch(() => null);
      // if (searchModule) {
        const marker = document.createElement('div');
        marker.id = 'search-loaded';
        marker.style.display = 'none';
        document.head.appendChild(marker);
      // }
    }
  }
  
  private async loadContentFeatures(): Promise<void> {
    // Load reading progress indicator
    if (!document.querySelector('#reading-progress-loaded')) {
      // const progressModule = await import('../components/ReadingProgress.js').catch(() => null);
      // if (progressModule) {
        const marker = document.createElement('div');
        marker.id = 'reading-progress-loaded';
        marker.style.display = 'none';
        document.head.appendChild(marker);
      // }
    }
  }
}

// Export singleton instances
export const bundleAnalyzer = new BundleAnalyzer();
export const progressiveEnhancer = new ProgressiveEnhancer();
export const intelligentLoader = new IntelligentLoader();