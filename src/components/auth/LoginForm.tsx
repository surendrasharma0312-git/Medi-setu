import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm, compactErrors } from '../../hooks/useForm';
import type { FormErrors } from '../../hooks/useForm';
import { useI18n } from '../../i18n';
import { paths } from '../../routes/paths';
import { signIn } from '../../services';
import { required, validatePhoneOrEmail } from '../../utils/validation';
import { Button } from '../ui/Button';
import { TextField } from '../ui/Fields';
import { Notice } from '../ui/Notice';

type Values = { identifier: string; password: string };
type Status = 'idle' | 'sending' | 'notConnected' | 'error';

const validate = (v: Values): FormErrors<Values> =>
  compactErrors({
    identifier: validatePhoneOrEmail(v.identifier),
    password: required(v.password),
  });

/**
 * Login form for patients and hospitals. PROTOTYPE: no account is checked.
 * After a valid submit the form explains that sign-in is not connected yet.
 * Replace the signIn() service (src/services/authService.ts) to make it real.
 */
export function LoginForm({ role }: { role: 'patient' | 'hospital' }) {
  const { t } = useI18n();
  const [status, setStatus] = useState<Status>('idle');
  const { values, errors, setValue, handleSubmit } = useForm<Values>({ identifier: '', password: '' }, validate);

  const fieldError = (name: keyof Values): string | undefined => {
    const key = errors[name];
    return key ? t(key) : undefined;
  };

  const onSubmit = handleSubmit(async (v) => {
    setStatus('sending');
    try {
      await signIn({ role, identifier: v.identifier, password: v.password });
      setValue('password', '');
      setStatus('notConnected');
    } catch {
      setStatus('error');
    }
  });

  return (
    <form className="card form" onSubmit={onSubmit} noValidate>
      <TextField
        name="identifier"
        label={t('auth.identifier')}
        hint={t('auth.identifierHint')}
        required
        autoComplete="username"
        value={values.identifier}
        onChange={(event) => setValue('identifier', event.target.value)}
        error={fieldError('identifier')}
      />
      <TextField
        name="password"
        type="password"
        label={t('auth.password')}
        required
        autoComplete="current-password"
        value={values.password}
        onChange={(event) => setValue('password', event.target.value)}
        error={fieldError('password')}
      />

      {status === 'notConnected' && (
        <Notice tone="warning" title={t('auth.notConnectedTitle')}>
          <p>{t('auth.notConnectedBody')}</p>
          <p>
            <Link to={role === 'patient' ? paths.patientDashboard : paths.hospitalDashboard}>
              {t('auth.openDemoDashboard')}
            </Link>
          </p>
        </Notice>
      )}
      {status === 'error' && <Notice tone="danger">{t('error.generic')}</Notice>}

      <Button type="submit" block disabled={status === 'sending'}>
        {t('auth.signIn')}
      </Button>
    </form>
  );
}
