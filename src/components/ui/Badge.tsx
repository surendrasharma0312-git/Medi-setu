import type { ReactNode } from 'react';
import { useI18n } from '../../i18n';
import type { AppointmentStatus } from '../../types';

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'demo';

export function Badge({ tone = 'neutral', children }: { tone?: BadgeTone; children: ReactNode }) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

/** Marks fictional records. Shown on every demo hospital, doctor and appointment. */
export function DemoBadge() {
  const { t } = useI18n();
  return <Badge tone="demo">{t('common.demo')}</Badge>;
}

const STATUS_TONE: Record<AppointmentStatus, BadgeTone> = {
  prototype_draft: 'demo',
  requested: 'warning',
  confirmed: 'success',
  rescheduled: 'info',
  declined: 'danger',
  cancelled: 'neutral',
  completed: 'neutral',
};

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  const { t } = useI18n();
  return <Badge tone={STATUS_TONE[status]}>{t(`status.${status}`)}</Badge>;
}
