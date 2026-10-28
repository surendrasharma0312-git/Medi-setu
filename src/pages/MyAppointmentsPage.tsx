import { useState } from 'react';
import { AppointmentCard } from '../components/appointment/AppointmentCard';
import { Button, ButtonLink } from '../components/ui/Button';
import { SelectField } from '../components/ui/Fields';
import { Modal } from '../components/ui/Modal';
import { Notice } from '../components/ui/Notice';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState, ErrorState, LoadingState } from '../components/ui/States';
import { useAsync } from '../hooks/useAsync';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useI18n } from '../i18n';
import { paths } from '../routes/paths';
import { cancelAppointment, listMyAppointments } from '../services';
import type { AppointmentRequest, AppointmentStatus } from '../types';

type Filter = 'all' | 'active' | 'closed';

/** Statuses that can still change. Everything else is history. */
const ACTIVE_STATUSES: AppointmentStatus[] = ['prototype_draft', 'requested', 'confirmed', 'rescheduled'];

const FILTERS: Filter[] = ['all', 'active', 'closed'];

export default function MyAppointmentsPage() {
  const { t } = useI18n();
  useDocumentTitle(t('myappt.docTitle'));
  const list = useAsync(() => listMyAppointments(), []);
  const [filter, setFilter] = useState<Filter>('all');
  const [toCancel, setToCancel] = useState<AppointmentRequest | null>(null);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const confirmCancel = async () => {
    if (!toCancel) return;
    setBusy(true);
    setFailed(false);
    try {
      await cancelAppointment(toCancel.id);
      setToCancel(null);
      list.reload();
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  };

  const closeModal = () => {
    setToCancel(null);
    setFailed(false);
  };

  const visible =
    list.status === 'success'
      ? list.data.filter((item) => {
          if (filter === 'all') return true;
          const active = ACTIVE_STATUSES.includes(item.status);
          return filter === 'active' ? active : !active;
        })
      : [];

  return (
    <div className="container page">
      <PageHeader
        title={t('myappt.title')}
        description={t('myappt.subtitle')}
        actions={<ButtonLink to={paths.hospitals}>{t('myappt.findHospital')}</ButtonLink>}
      />
      <Notice tone="warning">{t('myappt.demoNotice')}</Notice>

      <div className="toolbar">
        <SelectField
          name="statusFilter"
          label={t('myappt.filterLabel')}
          value={filter}
          onChange={(event) => setFilter(event.target.value as Filter)}
        >
          {FILTERS.map((option) => (
            <option key={option} value={option}>
              {t(`myappt.filter.${option}`)}
            </option>
          ))}
        </SelectField>
      </div>

      <div className="results">
        {list.status === 'loading' && <LoadingState />}
        {list.status === 'error' && <ErrorState onRetry={list.reload} />}
        {list.status === 'success' &&
          (visible.length === 0 ? (
            <EmptyState
              icon="calendar"
              title={t('myappt.empty.title')}
              description={t('myappt.empty.body')}
              action={<ButtonLink to={paths.hospitals}>{t('myappt.findHospital')}</ButtonLink>}
            />
          ) : (
            <div className="grid grid--2">
              {visible.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  actions={
                    ACTIVE_STATUSES.includes(appointment.status) ? (
                      <Button variant="danger" size="sm" onClick={() => setToCancel(appointment)}>
                        {t('myappt.cancel')}
                      </Button>
                    ) : undefined
                  }
                />
              ))}
            </div>
          ))}
      </div>

      <Modal
        open={toCancel !== null}
        title={t('myappt.cancelTitle')}
        onClose={closeModal}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>
              {t('myappt.keep')}
            </Button>
            <Button variant="danger" onClick={confirmCancel} disabled={busy}>
              {t('myappt.cancelConfirm')}
            </Button>
          </>
        }
      >
        <p>{t('myappt.cancelBody', { hospital: toCancel ? toCancel.hospitalName : '' })}</p>
        <p className="muted">{t('myappt.cancelPrototype')}</p>
        {failed && <Notice tone="danger">{t('error.generic')}</Notice>}
      </Modal>
    </div>
  );
}
