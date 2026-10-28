/**
 * Shared form fields. Each field renders a visible <label>, optional hint and
 * error text, and wires aria-describedby / aria-invalid. The input id is always
 * "field-<name>" so useForm can focus the first invalid field.
 *
 * Forms use noValidate and our own validation, so these components deliberately
 * do not set the native `required` attribute (aria-required is used instead).
 */
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface FieldBase {
  name: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

function describedBy(id: string, hint?: string, error?: string): string | undefined {
  const ids = [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ');
  return ids || undefined;
}

interface ShellProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

function FieldShell({ id, label, hint, error, required, children }: ShellProps) {
  return (
    <div className={error ? 'field field--error' : 'field'}>
      <label htmlFor={id}>
        {label}
        {required && (
          <span className="field__req" aria-hidden="true">
            {' *'}
          </span>
        )}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="field__hint">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} className="field__error">
          {error}
        </p>
      )}
    </div>
  );
}

type InputProps = FieldBase & Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'id'>;

export function TextField({ name, label, error, hint, required, ...rest }: InputProps) {
  const id = `field-${name}`;
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required}>
      <input
        id={id}
        name={name}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        {...rest}
      />
    </FieldShell>
  );
}

type SelectProps = FieldBase & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'name' | 'id'>;

export function SelectField({ name, label, error, hint, required, children, ...rest }: SelectProps) {
  const id = `field-${name}`;
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required}>
      <select
        id={id}
        name={name}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        {...rest}
      >
        {children}
      </select>
    </FieldShell>
  );
}

type TextAreaProps = FieldBase & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'name' | 'id'>;

export function TextAreaField({ name, label, error, hint, required, ...rest }: TextAreaProps) {
  const id = `field-${name}`;
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} required={required}>
      <textarea
        id={id}
        name={name}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        {...rest}
      />
    </FieldShell>
  );
}

type CheckboxProps = {
  name: string;
  label: ReactNode;
  error?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'id' | 'type'>;

export function CheckboxField({ name, label, error, ...rest }: CheckboxProps) {
  const id = `field-${name}`;
  return (
    <div className={error ? 'field field--error' : 'field'}>
      <div className="check">
        <input
          id={id}
          name={name}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          {...rest}
        />
        <label htmlFor={id}>{label}</label>
      </div>
      {error && (
        <p id={`${id}-error`} className="field__error">
          {error}
        </p>
      )}
    </div>
  );
}
