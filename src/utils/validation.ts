/**
 * Basic frontend validation. Each validator returns a translation key for the
 * error message, or null when the value is valid. This is user-experience
 * validation only; the future backend must validate again on the server.
 */
import type { TranslationKey } from '../i18n';
import { todayISO } from './format';

export type FieldError = TranslationKey | null;

export function required(value: string): FieldError {
  return value.trim() ? null : 'error.required';
}

export function requiredTrue(value: boolean): FieldError {
  return value ? null : 'error.consent';
}

export function validateEmail(value: string): FieldError {
  if (!value.trim()) return 'error.required';
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()) ? null : 'error.email';
}

/** Removes spaces/dashes and an Indian country or trunk prefix: "+91 98765-43210" -> "9876543210". */
function toNationalNumber(value: string): string {
  const cleaned = value.replace(/[\s()-]/g, '');
  if (cleaned.startsWith('+91')) return cleaned.slice(3);
  if (cleaned.length === 12 && cleaned.startsWith('91')) return cleaned.slice(2);
  if (cleaned.length === 11 && cleaned.startsWith('0')) return cleaned.slice(1);
  return cleaned;
}

/** Indian mobile number: 10 digits starting with 6-9. */
export function validateMobile(value: string): FieldError {
  if (!value.trim()) return 'error.required';
  return /^[6-9]\d{9}$/.test(toNationalNumber(value)) ? null : 'error.phone';
}

export function validatePhoneOrEmail(value: string): FieldError {
  if (!value.trim()) return 'error.required';
  const problem = value.includes('@') ? validateEmail(value) : validateMobile(value);
  return problem ? 'error.phoneOrEmail' : null;
}

export function validatePassword(value: string): FieldError {
  if (!value) return 'error.required';
  if (value.length < 8) return 'error.passwordShort';

  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumbers = /\d/.test(value);

  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    return 'error.passwordWeak';
  }

  return null;
}

export function validatePasswordMatch(value: string, password: string): FieldError {
  if (!value) return 'error.required';
  return value === password ? null : 'error.passwordMismatch';
}

export function validateFutureDate(value: string): FieldError {
  if (!value) return 'error.required';
  return value >= todayISO() ? null : 'error.datePast';
}
