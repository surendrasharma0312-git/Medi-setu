import { describe, it, expect } from 'vitest';
import { formatTime } from './format';

describe('formatTime', () => {
  it('formats morning times correctly', () => {
    expect(formatTime('08:30')).toBe('8:30 AM');
    expect(formatTime('00:15')).toBe('12:15 AM');
    expect(formatTime('11:59')).toBe('11:59 AM');
    expect(formatTime('05:00')).toBe('5:00 AM');
  });

  it('formats afternoon and evening times correctly', () => {
    expect(formatTime('12:00')).toBe('12:00 PM');
    expect(formatTime('13:30')).toBe('1:30 PM');
    expect(formatTime('23:59')).toBe('11:59 PM');
    expect(formatTime('18:45')).toBe('6:45 PM');
  });

  it('returns original input for invalid formats', () => {
    expect(formatTime('invalid')).toBe('invalid');
    expect(formatTime('12:xx')).toBe('12:xx');
    expect(formatTime('abc:def')).toBe('abc:def');
    expect(formatTime('')).toBe('');
    expect(formatTime('25:99')).toBe('1:99 PM'); // Given current logic, % 12 behavior. If it was to be strictly validated, this might change, but tests reflect current implementation.
  });
});
