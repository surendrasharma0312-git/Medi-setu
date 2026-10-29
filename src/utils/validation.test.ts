import { describe, it, expect } from 'vitest';
import { validateMobile } from './validation';

describe('validateMobile', () => {
  it('returns "error.required" for empty or whitespace values', () => {
    expect(validateMobile('')).toBe('error.required');
    expect(validateMobile('   ')).toBe('error.required');
  });

  describe('valid mobile numbers', () => {
    it('accepts normal 10-digit numbers starting with 6-9', () => {
      expect(validateMobile('9876543210')).toBeNull();
      expect(validateMobile('6789012345')).toBeNull();
    });

    it('accepts numbers with spaces, hyphens, and parentheses', () => {
      expect(validateMobile('98765-43210')).toBeNull();
      expect(validateMobile('987 654 3210')).toBeNull();
      expect(validateMobile('(987) 654-3210')).toBeNull();
      expect(validateMobile('98 76 54 32 10')).toBeNull();
    });

    it('accepts numbers with +91 country code', () => {
      expect(validateMobile('+919876543210')).toBeNull();
      expect(validateMobile('+91 98765-43210')).toBeNull();
      expect(validateMobile('+91 (987) 654 3210')).toBeNull();
    });

    it('accepts numbers with 91 country code without +', () => {
      expect(validateMobile('919876543210')).toBeNull();
      expect(validateMobile('91 98765-43210')).toBeNull();
    });

    it('accepts numbers with 0 trunk prefix', () => {
      expect(validateMobile('09876543210')).toBeNull();
      expect(validateMobile('0 98765-43210')).toBeNull();
    });
  });

  describe('invalid mobile numbers', () => {
    it('returns "error.phone" for numbers starting with 0-5', () => {
      expect(validateMobile('5876543210')).toBe('error.phone');
      expect(validateMobile('1234567890')).toBe('error.phone');
    });

    it('returns "error.phone" for numbers that are too short', () => {
      expect(validateMobile('987654321')).toBe('error.phone');
      expect(validateMobile('+91 98765')).toBe('error.phone');
    });

    it('returns "error.phone" for numbers that are too long', () => {
      expect(validateMobile('98765432101')).toBe('error.phone');
      expect(validateMobile('+91 98765432101')).toBe('error.phone');
    });

    it('returns "error.phone" for strings containing letters or invalid characters', () => {
      expect(validateMobile('987654321a')).toBe('error.phone');
      expect(validateMobile('98765@43210')).toBe('error.phone');
      expect(validateMobile('number is 9876543210')).toBe('error.phone');
    });
  });
});
