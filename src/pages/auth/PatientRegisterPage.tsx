import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { CheckboxField, TextField } from '../../components/ui/Fields';
import { Notice } from '../../components/ui/Notice';
import { PageHeader } from '../../components/ui/PageHeader';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { compactErrors, useForm } from '../../hooks/useForm';
import type { FormErrors } from '../../hooks/useForm';
import { useI18n } from '../../i18n';
import { paths } from '../../routes/paths';
import { registerPatient } from '../../services';
import { required, requiredTrue, validatePassword, validatePasswordMatch, validatePhoneOrEmail } from '../../utils/validation';

type Values = {
  fullName: string;
  contact: string;
  password: string;
  confirmPassword: string;
  consent: boolean;
};
type Status = 'idle' | 'sending' | 'notConnected' | 'error';

const validate = (v: Values): FormErrors<Values> =>
  compactErrors({
    fullName: required(v.fullName),
    contact: validatePhoneOrEmail(v.contact),
    password: validatePassword(v.password),
    confirmPassword: validatePasswordMatch(v.confirmPassword, v.password),
    consent: requiredTrue(v.consent),
  });

/** Patient registration. PROTOTYPE: no account is created and nothing is stored or sent. */
export default function PatientRegisterPage() {
  const { t } = useI18n();
  useDocumentTitle(t('register.patient.title'));
  const [status, setStatus] = useState<Status>('idle');
  const { values, errors, setValue, handleSubmit } = useForm<Values>(
    { fullName: '', contact: '', password: '', confirmPassword: '', consent: false },
    validate,
  );

  const fieldError = (name: keyof Values): string | undefined => {
    const key = errors[name];
    return key ? t(key) : undefined;
  };

  const onSubmit = handleSubmit(async () => {
    setStatus('sending');
    try {
      await registerPatient();
      setValue('password', '');
      setValue('confirmPassword', '');
      setStatus('notConnected');
    } catch {
      setStatus('error');
    }
  });

  return (
    <div className="auth-card stack">
      <PageHeader title={t('register.patient.title')} description={t('register.patient.subtitle')} />
      <Notice tone="warning">{t('auth.prototype')}</Notice>

      <form className="card form" onSubmit={onSubmit} noValidate>
        <TextField
          name="fullName"
          label={t('register.fullName')}
          required
          autoComplete="name"
          value={values.fullName}
          onChange={(event) => setValue('fullName', event.target.value)}
          error={fieldError('fullName')}
        />
        <TextField
          name="contact"
          label={t('auth.identifier')}
          hint={t('auth.identifierHint')}
          required
          autoComplete="off"
          value={values.contact}
          onChange={(event) => setValue('contact', event.target.value)}
          error={fieldError('contact')}
        />
        <TextField
          name="password"
          type="password"
          label={t('auth.password')}
          hint={t('register.passwordHint')}
          required
          autoComplete="new-password"
          value={values.password}
          onChange={(event) => setValue('password', event.target.value)}
          error={fieldError('password')}
        />
        <TextField
          name="confirmPassword"
          type="password"
          label={t('register.confirmPassword')}
          required
          autoComplete="new-password"
          value={values.confirmPassword}
          onChange={(event) => setValue('confirmPassword', event.target.value)}
          error={fieldError('confirmPassword')}
        />
        <CheckboxField
          name="consent"
          label={
            <>
              {t('register.agreePrefix')} <Link to={paths.terms}>{t('nav.terms')}</Link> {t('register.agreeAnd')}{' '}
              <Link to={paths.privacy}>{t('nav.privacy')}</Link> {t('register.agreeDraft')}
            </>
          }
          checked={values.consent}
          onChange={(event) => setValue('consent', event.target.checked)}
          error={fieldError('consent')}
        />

        {status === 'notConnected' && (
          <Notice tone="warning" title={t('register.notConnectedTitle')}>
            {t('register.notConnectedBody')}
          </Notice>
        )}
        {status === 'error' && <Notice tone="danger">{t('error.generic')}</Notice>}

        <Button type="submit" block disabled={status === 'sending'}>
          {t('register.patient.submit')}
        </Button>
      </form>

      <p className="auth-switch">
        {t('register.haveAccount')} <Link to={paths.patientLogin}>{t('auth.signIn')}</Link>
      </p>
    </div>
  );
}
