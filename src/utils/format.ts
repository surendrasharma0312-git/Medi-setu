/** Small, dependency-free helpers for dates, times and text. */

/** Local date as ISO "YYYY-MM-DD". */
export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function addDaysISO(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

/** "13:30" -> "1:30 PM" */
export function formatTime(hhmm: string): string {
  if (!hhmm || !hhmm.includes(':')) return hhmm;
  const [hours, minutes] = hhmm.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return hhmm;
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${String(minutes).padStart(2, '0')} ${suffix}`;
}

/** Lower-cases and trims text for case-insensitive search. Does not strip marks, so Hindi text stays intact. */
export function normalizeText(value: string): string {
  return value.toLowerCase().trim();
}

/** Joins place parts with commas and drops empty or repeated parts: ["Court side", "Siwan", "Siwan", "Bihar"] -> "Court side, Siwan, Bihar". */
export function joinPlace(parts: Array<string | undefined>): string {
  return Array.from(new Set(parts.filter((part): part is string => Boolean(part)))).join(', ');
}

export function compactStrings(values: Array<string | undefined>): string[] {
  return values.filter((value): value is string => Boolean(value));
}

/** Google Maps search link for an area. Used for areas only, never for fictional demo addresses. */
export function mapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
