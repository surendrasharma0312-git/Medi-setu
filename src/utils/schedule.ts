import { WEEKDAYS } from '../data/reference';
import type { Weekday } from '../types';

/**
 * Formats weekdays compactly: ['mon','tue','wed','thu','fri','sat'] -> "Mon–Sat",
 * ['mon','wed','fri'] -> "Mon, Wed, Fri". `label` returns the translated day name.
 */
export function formatDays(days: Weekday[], label: (day: Weekday) => string): string {
  const ordered = WEEKDAYS.filter((day) => days.includes(day));
  const positions = ordered.map((day) => WEEKDAYS.indexOf(day));
  const isRange = positions.every((position, index) => index === 0 || position === positions[index - 1] + 1);
  if (ordered.length >= 3 && isRange) {
    return `${label(ordered[0])}–${label(ordered[ordered.length - 1])}`;
  }
  return ordered.map(label).join(', ');
}
