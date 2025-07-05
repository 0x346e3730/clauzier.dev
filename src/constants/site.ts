import type { SiteConfig } from '../types/common';

export const SITE_CONFIG: SiteConfig = {
  title: 'Antonin CLAUZIER',
  description: 'Personal blog and portfolio of Antonin CLAUZIER - Software Engineer',
  author: 'Antonin CLAUZIER',
  email: 'contact@clauzier.dev',
  social: {
    twitter: '@0x346e3730',
    github: 'https://github.com/0x346e3730',
    linkedin: 'https://linkedin.com/in/antonin-clauzier',
  },
  analytics: {
    plausible: {
      domain: 'clauzier.dev',
      src: 'https://plausible.clauzier.dev/js/script.file-downloads.hash.outbound-links.pageview-props.tagged-events.js',
    },
  },
};

export const PERSONAL_INFO = {
  BIRTH_DATE: new Date('1998-05-22'),
  LOCATION: 'Saint-Denis, La Réunion',
  PROFESSION: 'Lead Developer',
  ORGANIZATIONS: {
    BLUE_WALL: {
      name: 'Le Blue Wall',
      url: 'https://www.lebluewall.fr/',
      description: 'Biggest e-sports fan club in the world',
    },
    SAUVADE: {
      name: 'Sauvade',
      url: 'https://www.sauvade.fr/',
      description: 'Animal rescue association',
    },
  },
} as const;

export const calculateAge = (birthDate: Date): number => {
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1;
  }
  
  return age;
};

export const NAVIGATION_ITEMS = [
  { href: '/blog/', label: 'BLOG' },
  { href: '/', label: 'HOME' },
  { href: '/resume/', label: 'RESUME' },
] as const;

export const SEO_DEFAULTS = {
  TITLE_TEMPLATE: '%s | Antonin CLAUZIER',
  DESCRIPTION: 'Personal website and blog of Antonin CLAUZIER, Lead Developer specializing in web technologies and e-commerce solutions.',
  KEYWORDS: ['Antonin CLAUZIER', 'developer', 'software engineer', 'web development', 'blog', 'portfolio'],
  LOCALE: 'en_US',
  SITE_URL: 'https://clauzier.dev',
} as const;