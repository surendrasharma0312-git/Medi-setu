import { useState } from 'react';
import { compactErrors, useForm } from '../../hooks/useForm';
import type { FormErrors } from '../../hooks/useForm';
import { useI18n } from '../../i18n';
import { respondToRequest } from '../../services';
import type { ReplyDecision } from '../../services';
import type { AppointmentRequest } from '../../types';
import { addDaysISO, todayISO } from '../../utils/format';
import { required, validateFutureDate } from '../../utils/validation';
import { Button } from '../ui/Button';
import { SelectField, TextAreaField, TextField } from '../ui/Fields';
import { Modal } from '../ui/Modal';
import { Notice } from '../ui/Notice';

type Values = { decision: ReplyDecision; date: string; time: string; message: string };

const DECISIONS: ReplyDecision[] = ['confirm', 'reschedule', 'decline'];

const validate = (v: Values): FormErrors<Values> =>
  compactErrors({
    decision: required(v.decision),
    date: v.decision === 'decline' ? null : validateFutureDate(v.date),
    time: v.decision === 'decline' ? null : required(v.time),
    message: v.decision === 'decline' ? required(v.message) : null,
  });

interface ReplyFormProps {
  request: AppointmentRequest;
  onClose: () => void;
  onDone: () => void;
}

function ReplyForm({ request, onClose, onDone }: ReplyFormProps) {
  const { t } = useI18n();
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const { values, errors, setValue, handleSubmit } = useForm<Values>(
    {
      decision: 'confirm',
      date: request.preferredDate >= todayISO() ? request.preferredDate : '',
      time: '',
      message: '',
    },
    validate,
  );

  const fieldError = (name: keyof Values): string | undefined => {
    const key = errors[name];
    return key ? t(key) : undefined;
  };

  const onSubmit = handleSubmit(async (v) => {
    setBusy(true);
    setFailed(false);
    try {
      await respondToRequest(request.id, {
        decision: v.decision,
        date: v.date || undefined,
        time: v.time || undefined,
        message: v.message,
      });
      onDone();
    } catch {
      setFailed(true);
      setBusy(false);
    }
  });

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <Notice tone="warning">{t('reply.prototypeNote')}</Notice>
      <p>
        <strong>{request.patientName}</strong> · {request.contact}
      </p>
      <SelectField
        name="decision"
        label={t('reply.decision')}
        value={values.decision}
        onChange={(event) => setValue('decision', event.target.value as ReplyDecision)}
        error={fieldError('decision')}
      >
        {DECISIONS.map((decision) => (
          <option key={decision} value={decision}>
            {t(`reply.decision.${decision}`)}
          </option>
        ))}
      </SelectField>
      {values.decision !== 'decline' && (
        <div className="form__row">
          <TextField
            name="date"
            type="date"
            label={t('reply.date')}
            required
            min={todayISO()}
            max={addDaysISO(90)}
            value={values.date}
            onChange={(event) => setValue('date', event.target.value)}
            error={fieldError('date')}
          />
          <TextField
            name="time"
            type="time"
            label={t('reply.time')}
            required
            value={values.time}
            onChange={(event) => setValue('time', event.target.value)}
            error={fieldError('time')}
          />
        </div>
      )}
      <TextAreaField
        name="message"
        label={t('reply.message')}
        hint={values.decision === 'decline' ? t('reply.reasonHint') : t('reply.messageHint')}
        required={values.decision === 'decline'}
        rows={3}
        maxLength={200}
        value={values.message}
        onChange={(event) => setValue('message', event.target.value)}
        error={fieldError('message')}
      />
      {failed && <Notice tone="danger">{t('error.generic')}</Notice>}
      <div className="modal__actions">
        <Button variant="secondary" onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" disabled={busy}>
          {t('reply.submit')}
        </Button>
      </div>
    </form>
  );
}

interface ReplyModalProps {
  /** The request being answered, or null when the dialog is closed */
  request: AppointmentRequest | null;
  onClose: () => void;
  /** Called after a successful reply so the caller can reload its list */
  onDone: () => void;
}

export function ReplyModal({ request, onClose, onDone }: ReplyModalProps) {
  const { t } = useI18n();
  return (
    <Modal open={request !== null} title={t('reply.title')} onClose={onClose}>
      {request && <ReplyForm request={request} onClose={onClose} onDone={onDone} />}
    </Modal>
  );
}
