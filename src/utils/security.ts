/**
 * Security utilities and best practices
 */

// Rate limiting (client-side)
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    return true;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

// Create a global rate limiter instance
export const rateLimiter = new RateLimiter();

// Content validation
export const validateContent = (content: string): boolean => {
  // Check for potential XSS patterns
  const xssPatterns = [
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe[\s\S]*?>/gi,
    /<object[\s\S]*?>/gi,
    /<embed[\s\S]*?>/gi,
  ];

  return !xssPatterns.some(pattern => pattern.test(content));
};

// Environment validation
export const isProduction = (): boolean => {
  return import.meta.env.PROD || process.env.NODE_ENV === 'production';
};

export const isDevelopment = (): boolean => {
  return import.meta.env.DEV || process.env.NODE_ENV === 'development';
};

// Secure headers for API responses (Node.js context)
export const getSecurityHeaders = () => ({
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
});

// CSRF token generation (for forms if needed)
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    // Fallback for Node.js
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Input validation helpers
export const validateInput = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  },
  
  url: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
  
  slug: (slug: string): boolean => {
    const slugRegex = /^[a-z0-9-]+$/;
    return slugRegex.test(slug) && slug.length <= 100;
  },
  
  text: (text: string, maxLength: number = 1000): boolean => {
    return typeof text === 'string' && 
           text.length <= maxLength && 
           validateContent(text);
  }
};