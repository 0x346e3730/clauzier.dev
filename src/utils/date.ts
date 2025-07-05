import type { DateInfo } from '../types/experience';

export const formatDate = (date: Date, options: Intl.DateTimeFormatOptions = {}): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(date);
};

export const formatDateShort = (date: Date): string => {
  return formatDate(date, { year: 'numeric', month: 'short' });
};

export const formatDateInfo = (dateInfo: DateInfo): string => {
  const date = new Date(dateInfo.year, dateInfo.month - 1);
  return formatDate(date, { year: 'numeric', month: 'long' });
};

export const formatDateInfoShort = (dateInfo: DateInfo): string => {
  const date = new Date(dateInfo.year, dateInfo.month - 1);
  return formatDate(date, { year: 'numeric', month: 'short' });
};

export const calculateDuration = (startDate: DateInfo, endDate: DateInfo | null): string => {
  const start = new Date(startDate.year, startDate.month - 1);
  const end = endDate ? new Date(endDate.year, endDate.month - 1) : new Date();
  
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffMonths / 12);
  
  if (diffYears > 0) {
    const remainingMonths = diffMonths % 12;
    if (remainingMonths > 0) {
      return `${diffYears} year${diffYears > 1 ? 's' : ''} ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
    }
    return `${diffYears} year${diffYears > 1 ? 's' : ''}`;
  }
  
  if (diffMonths > 0) {
    return `${diffMonths} month${diffMonths > 1 ? 's' : ''}`;
  }
  
  return 'Less than a month';
};

export const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  
  return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`;
};