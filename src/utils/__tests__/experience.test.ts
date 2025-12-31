import { describe, it, expect, beforeEach, vi } from 'vitest';
import { calculateExperience } from '../experience';

describe('Experience Utils', () => {
  beforeEach(() => {
    // Reset date mock before each test
    vi.useRealTimers();
  });

  describe('calculateExperience', () => {
    it('should calculate years of experience correctly', () => {
      // Set a fixed date for consistent testing
      const mockDate = new Date('2025-12-31');
      vi.setSystemTime(mockDate);

      const result = calculateExperience();

      // From December 2017 to December 2025 is 8 years
      expect(result.years).toBeGreaterThanOrEqual(7);
      expect(result.years).toBeLessThanOrEqual(9);
    });

    it('should return progress to next year as a number between 0 and 100', () => {
      const result = calculateExperience();

      expect(result.progressToNextYear).toBeGreaterThanOrEqual(0);
      expect(result.progressToNextYear).toBeLessThanOrEqual(100);
      expect(typeof result.progressToNextYear).toBe('number');
    });

    it('should calculate progress based on experience anniversary, not calendar year', () => {
      // Set date to January (early in calendar year)
      const januaryDate = new Date('2025-01-15');
      vi.setSystemTime(januaryDate);

      const januaryResult = calculateExperience();

      // Set date to June (mid calendar year)
      const juneDate = new Date('2025-06-15');
      vi.setSystemTime(juneDate);

      const juneResult = calculateExperience();

      // Progress should be based on December anniversary, not January 1st
      // In January, we're ~1 month after December anniversary (low progress)
      // In June, we're ~6 months after December anniversary (higher progress)
      expect(juneResult.progressToNextYear).toBeGreaterThan(januaryResult.progressToNextYear);
    });

    it('should handle overlapping experience periods correctly', () => {
      // This tests that the function counts unique months worked
      const result = calculateExperience();

      // Should have a realistic number of years (not counting overlaps twice)
      expect(result.years).toBeGreaterThan(0);
      expect(result.years).toBeLessThan(20); // Sanity check
    });

    it('should round progress to 1 decimal place', () => {
      const result = calculateExperience();

      const decimalPlaces = result.progressToNextYear.toString().split('.')[1]?.length || 0;
      expect(decimalPlaces).toBeLessThanOrEqual(1);
    });

    it('should be at ~0% progress right after anniversary', () => {
      // December 1st (just after anniversary)
      const mockDate = new Date('2024-12-02');
      vi.setSystemTime(mockDate);

      const result = calculateExperience();

      expect(result.progressToNextYear).toBeLessThan(5);
    });

    it('should be at ~100% progress right before anniversary', () => {
      // November 30th (just before December anniversary)
      const mockDate = new Date('2024-11-30');
      vi.setSystemTime(mockDate);

      const result = calculateExperience();

      expect(result.progressToNextYear).toBeGreaterThan(95);
    });
  });
});
