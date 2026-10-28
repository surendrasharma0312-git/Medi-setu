import { Link } from 'react-router-dom';
import { AppointmentCard } from '../../components/appointment/AppointmentCard';
import { DemoBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import type { IconName } from '../../components/ui/Icon';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { EmptyState, ErrorState, LoadingState } from '../../components/ui/States';
import { useAsync } from '../../hooks/useAsync';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useI18n } from '../../i18n';
import type { TranslationKey } from '../../i18n';
import { paths } from '../../routes/paths';
import { listMyAppointments } from '../../services';

const ACTIONS: { to: string; icon: IconName; title: TranslationKey; body: TranslationKey }[] = [
  { to: paths.hospitals, icon: 'search', title: 'dash.patient.findTitle', body: 'dash.patient.findBody' },
  { to: paths.newAppointment(), icon: 'calendar', title: 'dash.patient.newTitle', body: 'dash.patient.newBody' },
  { to: paths.myAppointments, icon: 'clipboard', title: 'dash.patient.myTitle', body: 'dash.patient.myBody' },
];

/** Patient dashboard. PROTOTYPE: shows the demo patient. No login is required or checked. */
export default function PatientDashboardPage() {
  const { t } = useI18n();
  useDocumentTitle(t('dash.patient.title'));
  const appointments = useAsync(() => listMyAppointments(), []);

  const count = (statuses: string[]): number =>
    appointments.status === 'success' ? appointments.data.filter((a) => statuses.includes(a.status)).length : 0;

  return (
    <div className="stack-lg">
      <PageHeader
        eyebrow={<DemoBadge />}
        title={t('dash.patient.title')}
        description={t('dash.patient.subtitle')}
      />

      <div className="grid grid--3">
        <StatCard label={t('dash.patient.statOpen')} value={count(['requested', 'rescheduled', 'prototype_draft'])} />
        <StatCard label={t('dash.patient.statConfirmed')} value={count(['confirmed'])} />
        <StatCard label={t('dash.patient.statDone')} value={count(['completed'])} />
      </div>

      <div className="grid grid--3">
        {ACTIONS.map((action) => (
          <Link key={action.to} to={action.to} className="card card--interactive action-card">
            <Icon name={action.icon} size={24} />
            <h3>{t(action.title)}</h3>
            <p className="muted">{t(action.body)}</p>
          </Link>
        ))}
      </div>

      <section>
        <div className="row row--between">
          <h2>{t('dash.patient.recent')}</h2>
          <Link to={paths.myAppointments}>{t('dash.viewAll')}</Link>
        </div>
        {appointments.status === 'loading' && <LoadingState />}
        {appointments.status === 'error' && <ErrorState onRetry={appointments.reload} />}
        {appointments.status === 'success' &&
          (appointments.data.length === 0 ? (
            <EmptyState icon="calendar" title={t('myappt.empty.title')} description={t('myappt.empty.body')} />
          ) : (
            <div className="grid grid--2">
              {appointments.data.slice(0, 2).map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          ))}
      </section>

      <div className="card">
        <h2 className="card__heading">{t('dash.patient.profile')}</h2>
        <p className="muted">{t('dash.patient.profileBody')}</p>
        <Button variant="secondary" disabled>
          {t('common.comingSoon')}
        </Button>
      </div>
    </div>
  );
}
