import type { SiteConfig } from '../types/common';

export const SITE_CONFIG: SiteConfig = {
  title: 'Antonin CLAUZIER',
  description: 'Personal website (and blog) of Antonin CLAUZIER',
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
  PROFESSION: 'Deputy CTO @ OPX',
  ORGANIZATIONS: {
    BLUE_WALL: {
      name: 'Le Blue Wall',
      url: 'https://www.lebluewall.fr/',
      description: 'Biggest e-sports fan club in the world',
    },
    SAUVADE: {
      name: 'Sauvade',
      url: 'https://asso-sauvade.fr/',
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
  DESCRIPTION: 'Personal website and blog of Antonin CLAUZIER, Deputy CTO specializing in web technologies.',
  KEYWORDS: ['Antonin CLAUZIER', 'software engineering', 'web development', 'blog'],
  LOCALE: 'en_US',
  SITE_URL: 'https://clauzier.dev',
} as const;
