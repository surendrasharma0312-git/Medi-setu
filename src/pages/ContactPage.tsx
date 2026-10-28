import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { Notice } from '../components/ui/Notice';
import { PageHeader } from '../components/ui/PageHeader';
import { TextAreaField, TextField } from '../components/ui/Fields';
import { SITE } from '../config/site';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { compactErrors, useForm } from '../hooks/useForm';
import type { FormErrors } from '../hooks/useForm';
import { useI18n } from '../i18n';
import { sendContactMessage } from '../services';
import { required, validatePhoneOrEmail } from '../utils/validation';

type Values = { name: string; contact: string; message: string };
type Status = 'idle' | 'sending' | 'notConnected' | 'error';

const validate = (v: Values): FormErrors<Values> =>
  compactErrors({
    name: required(v.name),
    contact: validatePhoneOrEmail(v.contact),
    message: required(v.message),
  });

/** Contact page. PROTOTYPE: the message is not sent anywhere. */
export default function ContactPage() {
  const { t } = useI18n();
  useDocumentTitle(t('contact.title'));
  const [status, setStatus] = useState<Status>('idle');
  const { values, errors, setValue, handleSubmit } = useForm<Values>({ name: '', contact: '', message: '' }, validate);

  const fieldError = (name: keyof Values): string | undefined => {
    const key = errors[name];
    return key ? t(key) : undefined;
  };

  const onSubmit = handleSubmit(async () => {
    setStatus('sending');
    try {
      await sendContactMessage();
      setStatus('notConnected');
    } catch {
      setStatus('error');
    }
  });

  return (
    <div className="container page">
      <PageHeader title={t('contact.title')} description={t('contact.subtitle')} />
      <div className="detail-layout">
        <form className="card form" onSubmit={onSubmit} noValidate>
          <Notice tone="warning">{t('contact.prototype')}</Notice>
          <TextField
            name="name"
            label={t('contact.name')}
            required
            autoComplete="name"
            value={values.name}
            onChange={(event) => setValue('name', event.target.value)}
            error={fieldError('name')}
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
          <TextAreaField
            name="message"
            label={t('contact.message')}
            hint={t('contact.messageHint')}
            required
            rows={5}
            maxLength={1000}
            value={values.message}
            onChange={(event) => setValue('message', event.target.value)}
            error={fieldError('message')}
          />
          {status === 'notConnected' && (
            <Notice tone="warning" title={t('contact.notConnectedTitle')}>
              {t('contact.notConnectedBody')}
            </Notice>
          )}
          {status === 'error' && <Notice tone="danger">{t('error.generic')}</Notice>}
          <Button type="submit" disabled={status === 'sending'} block>
            {t('contact.submit')}
          </Button>
        </form>

        <aside className="card">
          <h2 className="card__heading">{t('contact.detailsTitle')}</h2>
          <ul className="plain-list contact-list">
            <li className="meta">
              <Icon name="mail" size={16} />
              <span>
                {SITE.contactEmail} <span className="muted">({t('contact.placeholder')})</span>
              </span>
            </li>
            <li className="meta">
              <Icon name="map-pin" size={16} />
              <span>{t('contact.address')}</span>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
