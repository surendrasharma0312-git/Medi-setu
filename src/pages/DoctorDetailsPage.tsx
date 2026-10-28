import { Link, useParams } from 'react-router-dom';
import { Badge, DemoBadge } from '../components/ui/Badge';
import { ButtonLink } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { Notice } from '../components/ui/Notice';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState, ErrorState, LoadingState } from '../components/ui/States';
import { getSpecialty } from '../data/reference';
import { useAsync } from '../hooks/useAsync';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useI18n } from '../i18n';
import { paths } from '../routes/paths';
import { getDoctor } from '../services';
import type { Weekday } from '../types';
import { formatTime, joinPlace } from '../utils/format';
import { formatDays } from '../utils/schedule';

export default function DoctorDetailsPage() {
  const { t, pick, place } = useI18n();
  const { doctorId = '' } = useParams();
  const doctor = useAsync(() => getDoctor(doctorId), [doctorId]);
  useDocumentTitle(doctor.status === 'success' && doctor.data ? doctor.data.name : t('doctor.docTitle'));

  if (doctor.status === 'loading') {
    return (
      <div className="container page">
        <LoadingState />
      </div>
    );
  }
  if (doctor.status === 'error') {
    return (
      <div className="container page">
        <ErrorState onRetry={doctor.reload} />
      </div>
    );
  }

  const data = doctor.data;
  if (!data) {
    return (
      <div className="container page">
        <EmptyState
          icon="users"
          title={t('doctor.notFound.title')}
          description={t('doctor.notFound.body')}
          action={<ButtonLink to={paths.doctors}>{t('doctor.backToList')}</ButtonLink>}
        />
      </div>
    );
  }

  const specialty = getSpecialty(data.specialtyId);
  const dayLabel = (day: Weekday): string => t(`day.${day}`);

  return (
    <div className="container page">
      <p>
        <Link to={paths.doctors}>← {t('doctor.backToList')}</Link>
      </p>
      <PageHeader
        eyebrow={
          <div className="badge-row">
            {specialty && <Badge tone="info">{pick(specialty.name)}</Badge>}
            <DemoBadge />
          </div>
        }
        title={data.name}
        description={t('doctor.subtitle')}
        actions={
          <ButtonLink to={paths.newAppointment({ hospitalId: data.hospitalIds[0], doctorId: data.id })}>
            {t('common.requestAppointment')}
          </ButtonLink>
        }
      />
      <Notice tone="warning">{t('doctor.demoNotice')}</Notice>

      <div className="detail-layout">
        <section className="stack">
          <h2>{t('doctor.practicesAt')}</h2>
          <ul className="doctor-list">
            {data.hospitals.map((hospital) => {
              const slots = data.availability.filter((slot) => slot.hospitalId === hospital.id);
              return (
                <li key={hospital.id} className="card doctor-row">
                  <div>
                    <p className="doctor-row__name">
                      <Link to={paths.hospital(hospital.id)}>{hospital.name}</Link>
                    </p>
                    <p className="muted">{joinPlace([place(hospital.city), place(hospital.district)])}</p>
                    {slots.map((slot) => (
                      <p key={`${slot.days.join('')}-${slot.from}`} className="meta">
                        <Icon name="clock" size={16} />
                        <span>
                          {formatDays(slot.days, dayLabel)} {formatTime(slot.from)} – {formatTime(slot.to)}
                        </span>
                      </p>
                    ))}
                  </div>
                  <ButtonLink
                    to={paths.newAppointment({ hospitalId: hospital.id, doctorId: data.id })}
                    variant="secondary"
                    size="sm"
                  >
                    {t('common.requestAppointment')}
                  </ButtonLink>
                </li>
              );
            })}
          </ul>
        </section>

        <aside className="stack">
          <div className="card">
            <h2 className="card__heading">{t('doctor.credentials')}</h2>
            <p className="muted">{t('doctor.credentialsBody')}</p>
          </div>
          <Notice tone="info">{t('hospital.confirmNote')}</Notice>
        </aside>
      </div>
    </div>
  );
}
