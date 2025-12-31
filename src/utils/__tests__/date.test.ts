import { describe, it, expect } from 'vitest';
import { formatDate, calculateDuration, getRelativeTime } from '../date';
import type { DateInfo } from '../../types/experience';

describe('Date Utils', () => {
  describe('formatDate', () => {
    it('should format date with default options', () => {
      const date = new Date('2023-01-15');
      const result = formatDate(date);
      expect(result).toBe('January 15, 2023');
    });

    it('should format date with custom options', () => {
      const date = new Date('2023-01-15');
      const result = formatDate(date, { year: 'numeric', month: 'short', day: 'numeric' });
      expect(result).toBe('Jan 15, 2023');
    });
  });

  describe('calculateDuration', () => {
    it('should calculate duration in years and months', () => {
      const startDate: DateInfo = { month: 1, year: 2020 };
      const endDate: DateInfo = { month: 6, year: 2022 };
      const result = calculateDuration(startDate, endDate);
      expect(result).toMatch(/2 years/);
    });

    it('should calculate duration for current job (null end date)', () => {
      const startDate: DateInfo = { month: 1, year: 2023 };
      const result = calculateDuration(startDate, null);
      expect(result).toMatch(/year|month/);
    });

    it('should handle short durations', () => {
      const startDate: DateInfo = { month: 12, year: 2023 };
      const endDate: DateInfo = { month: 12, year: 2023 };
      const result = calculateDuration(startDate, endDate);
      expect(result).toBe('Less than a month');
    });
  });

  describe('getRelativeTime', () => {
    it('should return "Today" for current date', () => {
      const today = new Date();
      const result = getRelativeTime(today);
      expect(result).toBe('Today');
    });

    it('should return "Yesterday" for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const result = getRelativeTime(yesterday);
      expect(result).toBe('Yesterday');
    });

    it('should return days ago for recent dates', () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      const result = getRelativeTime(threeDaysAgo);
      expect(result).toBe('3 days ago');
    });
  });
});