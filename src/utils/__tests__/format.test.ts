import { describe, it, expect } from 'vitest';
import { joinPlace } from '../format';

describe('joinPlace', () => {
  it('joins distinct place parts with commas', () => {
    expect(joinPlace(['Court side', 'Siwan', 'Bihar'])).toBe('Court side, Siwan, Bihar');
  });

  it('drops empty or undefined parts', () => {
    expect(joinPlace(['Court side', undefined, '', 'Bihar', null as unknown as string])).toBe('Court side, Bihar');
  });

  it('drops repeated parts', () => {
    expect(joinPlace(['Court side', 'Siwan', 'Siwan', 'Bihar', 'Bihar'])).toBe('Court side, Siwan, Bihar');
  });

  it('returns empty string for empty list', () => {
    expect(joinPlace([])).toBe('');
  });

  it('returns empty string for list of empty or undefined parts', () => {
    expect(joinPlace([undefined, '', null as unknown as string])).toBe('');
  });
});
