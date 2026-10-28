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

const INDIAN_PHONE_PREFIX_REGEX = /^(?:\+91|91(?=\d{10}$)|0(?=\d{10}$))/;

/** Removes spaces/dashes and an Indian country or trunk prefix: "+91 98765-43210" -> "9876543210". */
function toNationalNumber(value: string): string {
  const cleaned = value.replace(/[\s()-]/g, '');
  return cleaned.replace(INDIAN_PHONE_PREFIX_REGEX, '');
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
  return value.length >= 8 ? null : 'error.passwordShort';
}

export function validatePasswordMatch(value: string, password: string): FieldError {
  if (!value) return 'error.required';
  return value === password ? null : 'error.passwordMismatch';
}

export function validateFutureDate(value: string): FieldError {
  if (!value) return 'error.required';
  return value >= todayISO() ? null : 'error.datePast';
}
