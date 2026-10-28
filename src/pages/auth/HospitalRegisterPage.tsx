import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { CheckboxField, SelectField, TextAreaField, TextField } from '../../components/ui/Fields';
import { Notice } from '../../components/ui/Notice';
import { PageHeader } from '../../components/ui/PageHeader';
import { FACILITY_TYPES, SPECIALTIES, STATES } from '../../data/reference';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { compactErrors, useForm } from '../../hooks/useForm';
import type { FormErrors } from '../../hooks/useForm';
import { useI18n } from '../../i18n';
import { paths } from '../../routes/paths';
import { registerHospital } from '../../services';
import {
  required,
  requiredTrue,
  validateEmail,
  validateMobile,
  validatePassword,
  validatePasswordMatch,
} from '../../utils/validation';

type Values = {
  hospitalName: string;
  facilityType: string;
  contactPerson: string;
  phone: string;
  email: string;
  state: string;
  district: string;
  city: string;
  address: string;
  specialtyIds: string[];
  registrationNumber: string;
  password: string;
  confirmPassword: string;
  consent: boolean;
};
type Status = 'idle' | 'sending' | 'notConnected' | 'error';

const INITIAL: Values = {
  hospitalName: '',
  facilityType: '',
  contactPerson: '',
  phone: '',
  email: '',
  state: '',
  district: '',
  city: '',
  address: '',
  specialtyIds: [],
  registrationNumber: '',
  password: '',
  confirmPassword: '',
  consent: false,
};

const validate = (v: Values): FormErrors<Values> =>
  compactErrors({
    hospitalName: required(v.hospitalName),
    facilityType: required(v.facilityType),
    contactPerson: required(v.contactPerson),
    phone: validateMobile(v.phone),
    email: v.email.trim() ? validateEmail(v.email) : null,
    state: required(v.state),
    district: required(v.district),
    city: required(v.city),
    address: required(v.address),
    password: validatePassword(v.password),
    confirmPassword: validatePasswordMatch(v.confirmPassword, v.password),
    consent: requiredTrue(v.consent),
  });

/**
 * Hospital registration. PROTOTYPE: nothing is sent or stored. In the live
 * version a new listing stays "pending" until an admin verifies it.
 */
export default function HospitalRegisterPage() {
  const { t, pick } = useI18n();
  useDocumentTitle(t('register.hospital.title'));
  const [status, setStatus] = useState<Status>('idle');
  const { values, errors, setValue, handleSubmit } = useForm<Values>(INITIAL, validate);

  const fieldError = (name: keyof Values): string | undefined => {
    const key = errors[name];
    return key ? t(key) : undefined;
  };

  const states = [...STATES].sort((a, b) => pick(a.name).localeCompare(pick(b.name)));

  const toggleSpecialty = (id: string, checked: boolean) => {
    setValue('specialtyIds', checked ? [...values.specialtyIds, id] : values.specialtyIds.filter((item) => item !== id));
  };

  const onSubmit = handleSubmit(async (v) => {
    setStatus('sending');
    try {
      await registerHospital({
        hospitalName: v.hospitalName,
        facilityType: v.facilityType,
        contactPerson: v.contactPerson,
        phone: v.phone,
        email: v.email,
        state: v.state,
        district: v.district,
        city: v.city,
        address: v.address,
        specialtyIds: v.specialtyIds,
        registrationNumber: v.registrationNumber,
        password: v.password,
      });
      setValue('password', '');
      setValue('confirmPassword', '');
      setStatus('notConnected');
    } catch {
      setStatus('error');
    }
  });

  return (
    <div className="auth-card auth-card--wide stack">
      <PageHeader title={t('register.hospital.title')} description={t('register.hospital.subtitle')} />
      <Notice tone="warning">{t('auth.prototype')}</Notice>
      <Notice tone="info">{t('register.verifyNote')}</Notice>

      <form className="card form" onSubmit={onSubmit} noValidate>
        <fieldset className="fieldset">
          <legend>{t('register.section.facility')}</legend>
          <TextField
            name="hospitalName"
            label={t('register.hospitalName')}
            required
            autoComplete="organization"
            value={values.hospitalName}
            onChange={(event) => setValue('hospitalName', event.target.value)}
            error={fieldError('hospitalName')}
          />
          <SelectField
            name="facilityType"
            label={t('register.facilityType')}
            required
            value={values.facilityType}
            onChange={(event) => setValue('facilityType', event.target.value)}
            error={fieldError('facilityType')}
          >
            <option value="">{t('register.chooseType')}</option>
            {FACILITY_TYPES.map((facility) => (
              <option key={facility.id} value={facility.id}>
                {pick(facility.name)}
              </option>
            ))}
          </SelectField>
          <TextField
            name="contactPerson"
            label={t('register.contactPerson')}
            required
            autoComplete="name"
            value={values.contactPerson}
            onChange={(event) => setValue('contactPerson', event.target.value)}
            error={fieldError('contactPerson')}
          />
          <div className="form__row">
            <TextField
              name="phone"
              type="tel"
              label={t('register.phone')}
              required
              autoComplete="tel"
              value={values.phone}
              onChange={(event) => setValue('phone', event.target.value)}
              error={fieldError('phone')}
            />
            <TextField
              name="email"
              type="email"
              label={t('register.email')}
              autoComplete="email"
              value={values.email}
              onChange={(event) => setValue('email', event.target.value)}
              error={fieldError('email')}
            />
          </div>
        </fieldset>

        <fieldset className="fieldset">
          <legend>{t('register.section.location')}</legend>
          <div className="form__row">
            <SelectField
              name="state"
              label={t('hospitals.state')}
              required
              value={values.state}
              onChange={(event) => setValue('state', event.target.value)}
              error={fieldError('state')}
            >
              <option value="">{t('register.chooseState')}</option>
              {states.map((state) => (
                <option key={state.code} value={state.code}>
                  {pick(state.name)}
                </option>
              ))}
            </SelectField>
            <TextField
              name="district"
              label={t('hospitals.district')}
              required
              value={values.district}
              onChange={(event) => setValue('district', event.target.value)}
              error={fieldError('district')}
            />
          </div>
          <TextField
            name="city"
            label={t('register.city')}
            required
            value={values.city}
            onChange={(event) => setValue('city', event.target.value)}
            error={fieldError('city')}
          />
          <TextAreaField
            name="address"
            label={t('register.address')}
            required
            rows={3}
            autoComplete="street-address"
            value={values.address}
            onChange={(event) => setValue('address', event.target.value)}
            error={fieldError('address')}
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend>{t('register.section.services')}</legend>
          <p className="field__hint">{t('register.specialtiesHint')}</p>
          <div className="check-grid">
            {SPECIALTIES.map((specialty) => (
              <CheckboxField
                key={specialty.id}
                name={`specialty-${specialty.id}`}
                label={pick(specialty.name)}
                checked={values.specialtyIds.includes(specialty.id)}
                onChange={(event) => toggleSpecialty(specialty.id, event.target.checked)}
              />
            ))}
          </div>
          <TextField
            name="registrationNumber"
            label={t('register.regNumber')}
            hint={t('register.regNumberHint')}
            value={values.registrationNumber}
            onChange={(event) => setValue('registrationNumber', event.target.value)}
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend>{t('register.section.account')}</legend>
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
        </fieldset>

        {status === 'notConnected' && (
          <Notice tone="warning" title={t('register.notConnectedTitle')}>
            {t('register.notConnectedBody')}
          </Notice>
        )}
        {status === 'error' && <Notice tone="danger">{t('error.generic')}</Notice>}

        <Button type="submit" block disabled={status === 'sending'}>
          {t('register.hospital.submit')}
        </Button>
      </form>

      <p className="auth-switch">
        {t('register.haveAccount')} <Link to={paths.hospitalLogin}>{t('auth.signIn')}</Link>
      </p>
    </div>
  );
}
