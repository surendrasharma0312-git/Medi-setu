import { describe, it, expect } from 'vitest';
import { validateMobile } from './validation';

describe('validateMobile', () => {
  it('returns error.required for empty or whitespace strings', () => {
    expect(validateMobile('')).toBe('error.required');
    expect(validateMobile('   ')).toBe('error.required');
  });

  describe('valid national numbers', () => {
    it('accepts standard 10-digit numbers starting with 6-9', () => {
      expect(validateMobile('9876543210')).toBeNull();
      expect(validateMobile('6876543210')).toBeNull();
      expect(validateMobile('7876543210')).toBeNull();
      expect(validateMobile('8876543210')).toBeNull();
    });

    it('removes spaces and dashes', () => {
      expect(validateMobile('987 654-3210')).toBeNull();
      expect(validateMobile('987-654-3210')).toBeNull();
      expect(validateMobile(' 987 654 3210 ')).toBeNull();
    });

    it('handles trunk prefix 0', () => {
      expect(validateMobile('09876543210')).toBeNull();
      expect(validateMobile('0 98765 43210')).toBeNull();
    });

    it('handles country code 91', () => {
      expect(validateMobile('919876543210')).toBeNull();
      expect(validateMobile('91 98765 43210')).toBeNull();
    });

    it('handles country code +91', () => {
      expect(validateMobile('+919876543210')).toBeNull();
      expect(validateMobile('+91 98765-43210')).toBeNull();
      expect(validateMobile('+91 (987) 654-3210')).toBeNull();
    });
  });

  describe('invalid national numbers', () => {
    it('returns error.phone for numbers starting with < 6', () => {
      expect(validateMobile('5876543210')).toBe('error.phone');
      expect(validateMobile('1876543210')).toBe('error.phone');
    });

    it('returns error.phone for incorrect lengths', () => {
      expect(validateMobile('987654321')).toBe('error.phone'); // 9 digits
      expect(validateMobile('98765432101')).toBe('error.phone'); // 11 digits without valid prefix
    });

    it('returns error.phone for non-numeric characters', () => {
      expect(validateMobile('987654321a')).toBe('error.phone');
      expect(validateMobile('98765 4321@')).toBe('error.phone');
    });

    it('returns error.phone for invalid prefix combinations', () => {
      expect(validateMobile('+929876543210')).toBe('error.phone'); // Not +91
      expect(validateMobile('009876543210')).toBe('error.phone'); // Not 0 or 91 or +91
    });
  });
});
