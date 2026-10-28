import { describe, it, expect } from 'vitest';
import { validatePhoneOrEmail } from './validation';

describe('validatePhoneOrEmail', () => {
  it('should return "error.required" for empty or whitespace values', () => {
    expect(validatePhoneOrEmail('')).toBe('error.required');
    expect(validatePhoneOrEmail('   ')).toBe('error.required');
    expect(validatePhoneOrEmail('\n\t')).toBe('error.required');
  });

  it('should return null for valid email addresses', () => {
    expect(validatePhoneOrEmail('test@example.com')).toBeNull();
    expect(validatePhoneOrEmail('user.name+tag@domain.co.in')).toBeNull();
    expect(validatePhoneOrEmail('  test@example.com  ')).toBeNull(); // Should handle padding
  });

  it('should return "error.phoneOrEmail" for invalid email addresses (containing @)', () => {
    expect(validatePhoneOrEmail('test@')).toBe('error.phoneOrEmail');
    expect(validatePhoneOrEmail('@example.com')).toBe('error.phoneOrEmail');
    expect(validatePhoneOrEmail('test@example')).toBe('error.phoneOrEmail'); // Missing dot
    expect(validatePhoneOrEmail('test @example.com')).toBe('error.phoneOrEmail'); // Spaces
  });

  it('should return null for valid Indian mobile numbers', () => {
    expect(validatePhoneOrEmail('9876543210')).toBeNull();
    expect(validatePhoneOrEmail('6876543210')).toBeNull();
    expect(validatePhoneOrEmail('+91 9876543210')).toBeNull();
    expect(validatePhoneOrEmail('09876543210')).toBeNull();
    expect(validatePhoneOrEmail('+91 98765-43210')).toBeNull();
    expect(validatePhoneOrEmail('(987) 654-3210')).toBeNull(); // Given the current toNationalNumber logic
  });

  it('should return "error.phoneOrEmail" for invalid phone numbers (not containing @)', () => {
    expect(validatePhoneOrEmail('12345')).toBe('error.phoneOrEmail'); // Too short
    expect(validatePhoneOrEmail('98765432101')).toBe('error.phoneOrEmail'); // Too long
    expect(validatePhoneOrEmail('5876543210')).toBe('error.phoneOrEmail'); // Doesn't start with 6-9
    expect(validatePhoneOrEmail('abcde12345')).toBe('error.phoneOrEmail'); // Letters
  });
});
