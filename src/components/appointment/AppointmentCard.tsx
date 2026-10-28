import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n';
import { paths } from '../../routes/paths';
import type { AppointmentRequest } from '../../types';
import { formatTime } from '../../utils/format';
import { StatusBadge } from '../ui/Badge';
import { Notice } from '../ui/Notice';
import type { ReactNode } from 'react';

interface AppointmentCardProps {
  appointment: AppointmentRequest;
  /** Buttons shown at the bottom of the card */
  actions?: ReactNode;
}

export function AppointmentCard({ appointment, actions }: AppointmentCardProps) {
  const { t, formatDate } = useI18n();
  const { response } = appointment;

  return (
    <article className="card appt-card">
      <div className="appt-card__head">
        <h3 className="card__title">
          <Link to={paths.hospital(appointment.hospitalId)}>{appointment.hospitalName}</Link>
        </h3>
        <StatusBadge status={appointment.status} />
      </div>

      <dl className="dl">
        <div>
          <dt>{t('myappt.doctor')}</dt>
          <dd>{appointment.doctorName ?? t('appt.anyDoctor')}</dd>
        </div>
        <div>
          <dt>{t('myappt.preferred')}</dt>
          <dd>
            {formatDate(appointment.preferredDate)} · {t(`time.${appointment.preferredTime}`)}
          </dd>
        </div>
        <div>
          <dt>{t('myappt.requestedOn')}</dt>
          <dd>{formatDate(appointment.createdAt)}</dd>
        </div>
      </dl>

      {appointment.status === 'prototype_draft' && <Notice tone="warning">{t('myappt.draftNotice')}</Notice>}

      {response && (
        <div className="appt-card__response">
          <p className="appt-card__response-title">{t('myappt.hospitalReply')}</p>
          {response.date && (
            <p>
              <strong>
                {formatDate(response.date)}
                {response.time ? ` · ${formatTime(response.time)}` : ''}
              </strong>
            </p>
          )}
          <p>{response.message}</p>
        </div>
      )}

      {actions && <div className="card__actions row">{actions}</div>}
    </article>
  );
}
