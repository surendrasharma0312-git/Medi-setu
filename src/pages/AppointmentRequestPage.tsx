import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { StatusBadge } from '../components/ui/Badge';
import { Button, ButtonLink } from '../components/ui/Button';
import { CheckboxField, SelectField, TextAreaField, TextField } from '../components/ui/Fields';
import { Notice } from '../components/ui/Notice';
import { PageHeader } from '../components/ui/PageHeader';
import { ErrorState, LoadingState } from '../components/ui/States';
import { SITE } from '../config/site';
import { useAsync } from '../hooks/useAsync';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { compactErrors, useForm } from '../hooks/useForm';
import type { FormErrors } from '../hooks/useForm';
import { useI18n } from '../i18n';
import { paths } from '../routes/paths';
import { createAppointmentRequest, getDoctorsByHospital, listHospitalOptions } from '../services';
import type { AppointmentRequest, DoctorWithHospitals, TimePreference } from '../types';
import { addDaysISO, todayISO } from '../utils/format';
import { required, requiredTrue, validateFutureDate, validatePhoneOrEmail } from '../utils/validation';

type Values = {
  patientName: string;
  contact: string;
  hospitalId: string;
  doctorId: string;
  preferredDate: string;
  preferredTime: TimePreference;
  note: string;
  consent: boolean;
};

// List fields in on-screen order: the first invalid field receives focus.
const validate = (v: Values): FormErrors<Values> =>
  compactErrors({
    patientName: required(v.patientName),
    contact: validatePhoneOrEmail(v.contact),
    hospitalId: required(v.hospitalId),
    preferredDate: validateFutureDate(v.preferredDate),
    consent: requiredTrue(v.consent),
  });

const TIME_OPTIONS: TimePreference[] = ['any', 'morning', 'afternoon', 'evening'];

/**
 * Appointment request form. PROTOTYPE: submitting creates an in-memory record
 * with the status "prototype_draft". Nothing is sent to a hospital and nothing
 * is stored. The result screen says so explicitly.
 */
export default function AppointmentRequestPage() {
  const { t, formatDate } = useI18n();
  useDocumentTitle(t('appt.docTitle'));
  const [searchParams] = useSearchParams();
  const [created, setCreated] = useState<AppointmentRequest | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);

  const { values, errors, setValue, handleSubmit } = useForm<Values>(
    {
      patientName: '',
      contact: '',
      hospitalId: searchParams.get('hospital') ?? '',
      doctorId: searchParams.get('doctor') ?? '',
      preferredDate: '',
      preferredTime: 'any',
      note: '',
      consent: false,
    },
    validate,
  );

  const hospitals = useAsync(() => listHospitalOptions(), []);
  const doctors = useAsync(
    () => (values.hospitalId ? getDoctorsByHospital(values.hospitalId) : Promise.resolve<DoctorWithHospitals[]>([])),
    [values.hospitalId],
  );

  // Drop a preselected doctor who does not work at the chosen hospital.
  useEffect(() => {
    if (doctors.status === 'success' && values.doctorId && !doctors.data.some((d) => d.id === values.doctorId)) {
      setValue('doctorId', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctors.status]);

  const fieldError = (name: keyof Values): string | undefined => {
    const key = errors[name];
    return key ? t(key) : undefined;
  };

  const onSubmit = handleSubmit(async (v) => {
    setSubmitting(true);
    setSubmitFailed(false);
    try {
      const request = await createAppointmentRequest({
        hospitalId: v.hospitalId,
        doctorId: v.doctorId || undefined,
        patientName: v.patientName,
        contact: v.contact,
        preferredDate: v.preferredDate,
        preferredTime: v.preferredTime,
        note: v.note,
      });
      setCreated(request);
    } catch {
      setSubmitFailed(true);
    } finally {
      setSubmitting(false);
    }
  });

  if (created) {
    return (
      <div className="container page narrow">
        <PageHeader title={t('appt.result.title')} />
        <Notice tone="warning" title={t('appt.result.noticeTitle')}>
          {t('appt.result.noticeBody')}
        </Notice>
        <div className="card">
          <div className="row row--between">
            <h2 className="card__heading">{created.hospitalName}</h2>
            <StatusBadge status={created.status} />
          </div>
          <dl className="dl">
            <div>
              <dt>{t('myappt.doctor')}</dt>
              <dd>{created.doctorName ?? t('appt.anyDoctor')}</dd>
            </div>
            <div>
              <dt>{t('myappt.preferred')}</dt>
              <dd>
                {formatDate(created.preferredDate)} · {t(`time.${created.preferredTime}`)}
              </dd>
            </div>
            <div>
              <dt>{t('appt.contact')}</dt>
              <dd>{created.contact}</dd>
            </div>
          </dl>
        </div>
        <div className="row">
          <ButtonLink to={paths.myAppointments}>{t('appt.result.viewMy')}</ButtonLink>
          <ButtonLink to={paths.hospitals} variant="secondary">
            {t('appt.result.findMore')}
          </ButtonLink>
        </div>
      </div>
    );
  }

  if (hospitals.status === 'loading') {
    return (
      <div className="container page narrow">
        <LoadingState />
      </div>
    );
  }
  if (hospitals.status === 'error') {
    return (
      <div className="container page narrow">
        <ErrorState onRetry={hospitals.reload} />
      </div>
    );
  }

  const doctorOptions = doctors.status === 'success' ? doctors.data : [];

  return (
    <div className="container page narrow">
      <PageHeader title={t('appt.title')} description={t('appt.subtitle')} />
      <Notice tone="warning" title={t('appt.prototypeTitle')}>
        {t('appt.prototypeBody')}
      </Notice>
      <Notice tone="info">{t('appt.safety', { number: SITE.emergencyNumber })}</Notice>

      <form className="card form" onSubmit={onSubmit} noValidate>
        <TextField
          name="patientName"
          label={t('appt.name')}
          hint={t('appt.nameHint')}
          required
          autoComplete="name"
          value={values.patientName}
          onChange={(event) => setValue('patientName', event.target.value)}
          error={fieldError('patientName')}
        />
        <TextField
          name="contact"
          label={t('appt.contact')}
          hint={t('appt.contactHint')}
          required
          autoComplete="off"
          value={values.contact}
          onChange={(event) => setValue('contact', event.target.value)}
          error={fieldError('contact')}
        />
        <SelectField
          name="hospitalId"
          label={t('appt.hospital')}
          required
          value={values.hospitalId}
          onChange={(event) => {
            setValue('hospitalId', event.target.value);
            setValue('doctorId', '');
          }}
          error={fieldError('hospitalId')}
        >
          <option value="">{t('appt.chooseHospital')}</option>
          {hospitals.data.map((hospital) => (
            <option key={hospital.id} value={hospital.id}>
              {hospital.name}
            </option>
          ))}
        </SelectField>
        <SelectField
          name="doctorId"
          label={t('appt.doctor')}
          hint={t('appt.doctorHint')}
          value={values.doctorId}
          disabled={!values.hospitalId}
          onChange={(event) => setValue('doctorId', event.target.value)}
        >
          <option value="">{t('appt.anyDoctor')}</option>
          {doctorOptions.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name}
            </option>
          ))}
        </SelectField>
        <div className="form__row">
          <TextField
            name="preferredDate"
            type="date"
            label={t('appt.date')}
            required
            min={todayISO()}
            max={addDaysISO(90)}
            value={values.preferredDate}
            onChange={(event) => setValue('preferredDate', event.target.value)}
            error={fieldError('preferredDate')}
          />
          <SelectField
            name="preferredTime"
            label={t('appt.time')}
            value={values.preferredTime}
            onChange={(event) => setValue('preferredTime', event.target.value as TimePreference)}
          >
            {TIME_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {t(`time.${option}`)}
              </option>
            ))}
          </SelectField>
        </div>
        <TextAreaField
          name="note"
          label={t('appt.note')}
          hint={t('appt.noteHint')}
          rows={3}
          maxLength={200}
          value={values.note}
          onChange={(event) => setValue('note', event.target.value)}
        />

        <div className="field field--disabled">
          <label htmlFor="field-attachment">{t('appt.attachment')}</label>
          <p id="field-attachment-hint" className="field__hint">
            {t('appt.attachmentHint')}
          </p>
          <input id="field-attachment" type="file" disabled aria-describedby="field-attachment-hint" />
        </div>

        <CheckboxField
          name="consent"
          label={t('appt.consent')}
          checked={values.consent}
          onChange={(event) => setValue('consent', event.target.checked)}
          error={fieldError('consent')}
        />

        {submitFailed && <Notice tone="danger">{t('error.generic')}</Notice>}
        <Button type="submit" disabled={submitting} block>
          {submitting ? t('common.loading') : t('appt.submit')}
        </Button>
      </form>
    </div>
  );
}
