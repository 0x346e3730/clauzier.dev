/**
 * Performance monitoring and metrics collection
 */

export interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  
  // Other important metrics
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
  
  // Custom metrics
  pageLoadTime?: number;
  domContentLoaded?: number;
  resourcesLoaded?: number;
  
  // Navigation timing
  navigationStart?: number;
  fetchStart?: number;
  connectTime?: number;
  requestTime?: number;
  responseTime?: number;
  
  // Resource metrics
  totalResources?: number;
  failedResources?: number;
  cacheHitRate?: number;
  
  // User engagement
  timeOnPage?: number;
  scrollDepth?: number;
  interactions?: number;
}

export interface PerformanceThresholds {
  lcp: { good: number; needsImprovement: number };
  fid: { good: number; needsImprovement: number };
  cls: { good: number; needsImprovement: number };
  fcp: { good: number; needsImprovement: number };
  ttfb: { good: number; needsImprovement: number };
}

// Performance thresholds based on Core Web Vitals
export const PERFORMANCE_THRESHOLDS: PerformanceThresholds = {
  lcp: { good: 2500, needsImprovement: 4000 },
  fid: { good: 100, needsImprovement: 300 },
  cls: { good: 0.1, needsImprovement: 0.25 },
  fcp: { good: 1800, needsImprovement: 3000 },
  ttfb: { good: 800, needsImprovement: 1800 },
};

export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private observers: Map<string, PerformanceObserver> = new Map();
  private startTime: number = performance.now();
  private resourceCount = { total: 0, failed: 0, cached: 0 };
  private userEngagement = { scrollDepth: 0, interactions: 0 };
  
  constructor() {
    this.initializeMonitoring();
  }
  
  private initializeMonitoring(): void {
    // Core Web Vitals monitoring
    this.observeCoreWebVitals();
    
    // Navigation timing
    this.collectNavigationTiming();
    
    // Resource monitoring
    this.observeResources();
    
    // User engagement tracking
    this.trackUserEngagement();
    
    // Page visibility changes
    this.setupVisibilityTracking();
  }
  
  private observeCoreWebVitals(): void {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        this.metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
        this.reportMetric('lcp', this.metrics.lcp);
      });
      
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.set('lcp', lcpObserver);
      } catch (e) {
        console.warn('LCP observation not supported');
      }
    }
    
    // First Input Delay (FID)
    if ('PerformanceObserver' in window) {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.fid = entry.processingStart - entry.startTime;
          this.reportMetric('fid', this.metrics.fid);
        });
      });
      
      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.set('fid', fidObserver);
      } catch (e) {
        console.warn('FID observation not supported');
      }
    }
    
    // Cumulative Layout Shift (CLS)
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        this.metrics.cls = clsValue;
        this.reportMetric('cls', this.metrics.cls);
      });
      
      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.set('cls', clsObserver);
      } catch (e) {
        console.warn('CLS observation not supported');
      }
    }
    
    // First Contentful Paint (FCP)
    if ('PerformanceObserver' in window) {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = entry.startTime;
            this.reportMetric('fcp', this.metrics.fcp);
          }
        });
      });
      
      try {
        fcpObserver.observe({ entryTypes: ['paint'] });
        this.observers.set('fcp', fcpObserver);
      } catch (e) {
        console.warn('FCP observation not supported');
      }
    }
  }
  
  private collectNavigationTiming(): void {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          this.metrics.ttfb = navigation.responseStart - navigation.fetchStart;
          this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.navigationStart;
          this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.navigationStart;
          this.metrics.connectTime = navigation.connectEnd - navigation.connectStart;
          this.metrics.requestTime = navigation.responseStart - navigation.requestStart;
          this.metrics.responseTime = navigation.responseEnd - navigation.responseStart;
          
          this.reportMetric('ttfb', this.metrics.ttfb);
          this.reportMetric('domContentLoaded', this.metrics.domContentLoaded);
          this.reportMetric('pageLoadTime', this.metrics.pageLoadTime);
        }
      }, 0);
    });
  }
  
  private observeResources(): void {
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.resourceCount.total++;
          
          // Check if resource was served from cache
          if (entry.transferSize === 0 && entry.decodedBodySize > 0) {
            this.resourceCount.cached++;
          }
          
          // Check for failed resources
          if (entry.responseStart === 0) {
            this.resourceCount.failed++;
          }
        });
        
        this.metrics.totalResources = this.resourceCount.total;
        this.metrics.failedResources = this.resourceCount.failed;
        this.metrics.cacheHitRate = this.resourceCount.total > 0 
          ? this.resourceCount.cached / this.resourceCount.total 
          : 0;
      });
      
      try {
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.set('resource', resourceObserver);
      } catch (e) {
        console.warn('Resource observation not supported');
      }
    }
  }
  
  private trackUserEngagement(): void {
    let maxScrollDepth = 0;
    
    // Track scroll depth
    const trackScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      const scrollPercent = (scrollTop + windowHeight) / documentHeight;
      maxScrollDepth = Math.max(maxScrollDepth, scrollPercent);
      
      this.userEngagement.scrollDepth = Math.round(maxScrollDepth * 100);
      this.metrics.scrollDepth = this.userEngagement.scrollDepth;
    };
    
    window.addEventListener('scroll', trackScroll, { passive: true });
    
    // Track interactions
    ['click', 'keydown', 'touchstart'].forEach(eventType => {
      document.addEventListener(eventType, () => {
        this.userEngagement.interactions++;
        this.metrics.interactions = this.userEngagement.interactions;
      }, { passive: true });
    });
  }
  
  private setupVisibilityTracking(): void {
    let visibilityStart = Date.now();
    
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        const visibleTime = Date.now() - visibilityStart;
        this.metrics.timeOnPage = (this.metrics.timeOnPage || 0) + visibleTime;
      } else {
        visibilityStart = Date.now();
      }
    });
    
    // Track total time on page when leaving
    window.addEventListener('beforeunload', () => {
      if (!document.hidden) {
        const visibleTime = Date.now() - visibilityStart;
        this.metrics.timeOnPage = (this.metrics.timeOnPage || 0) + visibleTime;
      }
      
      this.sendBeacon();
    });
  }
  
  private reportMetric(name: string, value: number): void {
    const threshold = PERFORMANCE_THRESHOLDS[name as keyof PerformanceThresholds];
    
    if (threshold) {
      let rating: 'good' | 'needs-improvement' | 'poor';
      
      if (value <= threshold.good) {
        rating = 'good';
      } else if (value <= threshold.needsImprovement) {
        rating = 'needs-improvement';
      } else {
        rating = 'poor';
      }
      
      // Send to analytics if available
      if (typeof window.plausible !== 'undefined') {
        window.plausible('Core Web Vital', {
          props: {
            metric: name,
            value: Math.round(value),
            rating: rating,
          },
        });
      }
      
      // Log in development
      if (import.meta.env.DEV) {
        console.log(`${name.toUpperCase()}: ${Math.round(value)}ms (${rating})`);
      }
    }
  }
  
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }
  
  public generateReport(): string {
    const metrics = this.getMetrics();
    const report = [];
    
    report.push('=== Performance Report ===');
    
    // Core Web Vitals
    if (metrics.lcp) {
      const rating = this.getRating('lcp', metrics.lcp);
      report.push(`LCP: ${Math.round(metrics.lcp)}ms (${rating})`);
    }
    
    if (metrics.fid) {
      const rating = this.getRating('fid', metrics.fid);
      report.push(`FID: ${Math.round(metrics.fid)}ms (${rating})`);
    }
    
    if (metrics.cls) {
      const rating = this.getRating('cls', metrics.cls);
      report.push(`CLS: ${metrics.cls.toFixed(3)} (${rating})`);
    }
    
    // Other metrics
    if (metrics.fcp) {
      report.push(`FCP: ${Math.round(metrics.fcp)}ms`);
    }
    
    if (metrics.ttfb) {
      report.push(`TTFB: ${Math.round(metrics.ttfb)}ms`);
    }
    
    if (metrics.pageLoadTime) {
      report.push(`Page Load: ${Math.round(metrics.pageLoadTime)}ms`);
    }
    
    // Resource metrics
    if (metrics.totalResources) {
      report.push(`Resources: ${metrics.totalResources} total, ${metrics.failedResources || 0} failed`);
    }
    
    if (metrics.cacheHitRate !== undefined) {
      report.push(`Cache Hit Rate: ${Math.round(metrics.cacheHitRate * 100)}%`);
    }
    
    // Engagement metrics
    if (metrics.scrollDepth) {
      report.push(`Scroll Depth: ${metrics.scrollDepth}%`);
    }
    
    if (metrics.interactions) {
      report.push(`Interactions: ${metrics.interactions}`);
    }
    
    if (metrics.timeOnPage) {
      report.push(`Time on Page: ${Math.round(metrics.timeOnPage / 1000)}s`);
    }
    
    return report.join('\n');
  }
  
  private getRating(metric: string, value: number): string {
    const threshold = PERFORMANCE_THRESHOLDS[metric as keyof PerformanceThresholds];
    if (!threshold) return 'unknown';
    
    if (value <= threshold.good) return 'good';
    if (value <= threshold.needsImprovement) return 'needs-improvement';
    return 'poor';
  }
  
  private sendBeacon(): void {
    const data = {
      metrics: this.getMetrics(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
    };
    
    // Send via beacon API if available
    if ('sendBeacon' in navigator) {
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      navigator.sendBeacon('/api/metrics', blob);
    }
  }
  
  public destroy(): void {
    // Disconnect all observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Global access for debugging
if (typeof window !== 'undefined') {
  (window as any).__performanceMonitor = performanceMonitor;
}