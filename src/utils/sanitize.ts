/**
 * Sanitization utilities for user content and external data
 */

export const sanitizeUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new Error('Invalid protocol');
    }
    
    return urlObj.toString();
  } catch {
    // Return a safe fallback URL
    return '#';
  }
};

export const sanitizeText = (text: string): string => {
  return text
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

export const sanitizeEmail = (email: string): string => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
  return email.toLowerCase().trim();
};

export const sanitizeSlug = (slug: string): string => {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

export const isExternalUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    const currentHost = typeof window !== 'undefined' ? window.location.host : 'clauzier.dev';
    return urlObj.host !== currentHost;
  } catch {
    return false;
  }
};

export const addSecurityAttributes = (url: string): { target?: string; rel?: string } => {
  if (isExternalUrl(url)) {
    return {
      target: '_blank',
      rel: 'noopener noreferrer',
    };
  }
  return {};
};