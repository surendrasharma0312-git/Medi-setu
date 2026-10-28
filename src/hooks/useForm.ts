import { useState } from 'react';
import type { FormEvent } from 'react';
import type { TranslationKey } from '../i18n';

export type FormErrors<V> = Partial<Record<keyof V, TranslationKey>>;

/**
 * Drops null entries from a { field: error | null } object while keeping key
 * order. The first key left is focused after a failed submit, so list fields
 * in the order they appear on screen.
 */
export function compactErrors<K extends string>(
  input: Record<K, TranslationKey | null>,
): Partial<Record<K, TranslationKey>> {
  const out: Partial<Record<K, TranslationKey>> = {};
  (Object.keys(input) as K[]).forEach((key) => {
    const error = input[key];
    if (error) out[key] = error;
  });
  return out;
}

/**
 * Minimal form helper: keeps values, runs a validate function on submit, shows
 * errors and moves focus to the first invalid field. Field inputs must use the
 * id "field-<name>" (the shared field components do this automatically).
 */
export function useForm<V extends object>(initial: V, validate: (values: V) => FormErrors<V>) {
  const [values, setValues] = useState<V>(initial);
  const [errors, setErrors] = useState<FormErrors<V>>({});

  function setValue<K extends keyof V>(name: K, value: V[K]) {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  }

  function handleSubmit(onValid: (values: V) => void | Promise<void>) {
    return (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const found = validate(values);
      setErrors(found);
      const firstInvalid = Object.keys(found)[0];
      if (firstInvalid) {
        document.getElementById(`field-${firstInvalid}`)?.focus();
        return;
      }
      void onValid(values);
    };
  }

  function reset() {
    setValues(initial);
    setErrors({});
  }

  return { values, errors, setValue, handleSubmit, reset };
}
