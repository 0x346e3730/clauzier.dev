export type ColorType = 'primary' | 'secondary' | 'tertiary';
export type LocationType = 'remote' | 'on-site' | 'hybrid';

export interface Tag {
  label: string;
  colorType: ColorType;
}

export interface DateInfo {
  month: number; // 1-12
  year: number;
}

export interface Testimonial {
  quote: string;
  author: string;
  title: string;
  company?: string;
  date?: DateInfo;
  rating?: number; // 1-5
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  tags: Tag[];
  startDate: DateInfo;
  endDate: DateInfo | null;
  location: LocationType;
  description: string[];
  testimonial?: Testimonial;
  technologies?: string[];
  achievements?: string[];
  website?: string;
  logo?: string;
}

export interface ExperienceStats {
  totalYears: number;
  totalMonths: number;
  currentRole?: string;
  technologiesUsed: string[];
}