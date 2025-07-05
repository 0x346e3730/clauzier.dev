export interface SEOData {
  title: string;
  description: string;
  canonical?: string;
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    type?: 'website' | 'article';
  };
  twitter?: {
    card?: 'summary' | 'summary_large_image';
    title?: string;
    description?: string;
    image?: string;
  };
}

export interface ImageData {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface NavigationItem {
  href: string;
  label: string;
  external?: boolean;
  icon?: string;
}

export interface SiteConfig {
  title: string;
  description: string;
  author: string;
  email: string;
  social: {
    twitter: string;
    github: string;
    linkedin: string;
  };
  analytics: {
    plausible?: {
      domain: string;
      src: string;
    };
  };
}

export type Theme = 'hacker' | 'light' | 'dark';
export type AnimationType = 'matrix' | 'scanline' | 'glitch' | 'none';
export type FontVariant = 'neon' | 'radon' | 'argon';

export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    primary: FontVariant;
    secondary: FontVariant;
    mono: FontVariant;
  };
  animations: {
    enabled: boolean;
    types: AnimationType[];
  };
}

export interface ErrorInfo {
  message: string;
  code?: string;
  details?: string;
  timestamp?: Date;
}