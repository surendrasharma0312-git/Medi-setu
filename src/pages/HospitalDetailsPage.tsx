import { Link, useParams } from 'react-router-dom';
import { HoursList } from '../components/hospital/HoursList';
import { VerificationBadge } from '../components/hospital/VerificationBadge';
import { Badge, DemoBadge } from '../components/ui/Badge';
import { ButtonLink, buttonClass } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { Notice } from '../components/ui/Notice';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState, ErrorState, LoadingState } from '../components/ui/States';
import { getFacilityType, getService, getSpecialty, getStateInfo } from '../data/reference';
import { useAsync } from '../hooks/useAsync';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useI18n } from '../i18n';
import { paths, withQuery } from '../routes/paths';
import { getDoctorsByHospital, getHospital } from '../services';
import type { Weekday } from '../types';
import { formatTime, joinPlace, mapsSearchUrl } from '../utils/format';
import { formatDays } from '../utils/schedule';

export default function HospitalDetailsPage() {
  const { t, pick, place } = useI18n();
  const { hospitalId = '' } = useParams();
  const hospital = useAsync(() => getHospital(hospitalId), [hospitalId]);
  const doctors = useAsync(() => getDoctorsByHospital(hospitalId), [hospitalId]);
  useDocumentTitle(hospital.status === 'success' && hospital.data ? hospital.data.name : t('hospital.docTitle'));

  if (hospital.status === 'loading') {
    return (
      <div className="container page">
        <LoadingState />
      </div>
    );
  }
  if (hospital.status === 'error') {
    return (
      <div className="container page">
        <ErrorState onRetry={hospital.reload} />
      </div>
    );
  }

  const data = hospital.data;
  if (!data) {
    return (
      <div className="container page">
        <EmptyState
          icon="building"
          title={t('hospital.notFound.title')}
          description={t('hospital.notFound.body')}
          action={<ButtonLink to={paths.hospitals}>{t('hospital.backToList')}</ButtonLink>}
        />
      </div>
    );
  }

  const facility = getFacilityType(data.facilityType);
  const state = getStateInfo(data.state);
  const dayLabel = (day: Weekday): string => t(`day.${day}`);
  // The map link searches the AREA only. The street address in demo data is fictional.
  const mapQuery = `${data.locality}, ${data.city}, ${data.district}, ${state ? state.name.en : data.state}, India`;
  const specialties = data.specialtyIds.flatMap((id) => {
    const specialty = getSpecialty(id);
    return specialty ? [specialty] : [];
  });
  const services = data.serviceIds.flatMap((id) => {
    const service = getService(id);
    return service ? [service] : [];
  });

  return (
    <div className="container page">
      <p>
        <Link to={paths.hospitals}>← {t('hospital.backToList')}</Link>
      </p>
      <PageHeader
        eyebrow={
          <div className="badge-row">
            {facility && <Badge tone="info">{pick(facility.name)}</Badge>}
            <DemoBadge />
            <VerificationBadge status={data.verification} />
          </div>
        }
        title={data.name}
        description={joinPlace([data.locality, place(data.city), place(data.district), state ? pick(state.name) : data.state])}
        actions={<ButtonLink to={paths.newAppointment({ hospitalId: data.id })}>{t('common.requestAppointment')}</ButtonLink>}
      />
      <Notice tone="warning">{t('hospital.demoNotice')}</Notice>

      <div className="detail-layout">
        <div className="stack-lg">
          <section>
            <h2>{t('hospital.specialties')}</h2>
            {specialties.length === 0 ? (
              <p className="muted">{t('hospital.noSpecialties')}</p>
            ) : (
              <ul className="chips">
                {specialties.map((specialty) => (
                  <li key={specialty.id}>
                    <Link className="chip" to={withQuery(paths.hospitals, { specialty: specialty.id })}>
                      {pick(specialty.name)}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2>{t('hospital.services')}</h2>
            <ul className="chips">
              {services.map((service) => (
                <li key={service.id} className="chip chip--static">
                  {pick(service.name)}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2>{t('hospital.doctors')}</h2>
            {doctors.status === 'loading' && <LoadingState />}
            {doctors.status === 'error' && <ErrorState onRetry={doctors.reload} />}
            {doctors.status === 'success' &&
              (doctors.data.length === 0 ? (
                <EmptyState icon="users" title={t('hospital.noDoctors')} />
              ) : (
                <ul className="doctor-list">
                  {doctors.data.map((doctor) => {
                    const specialty = getSpecialty(doctor.specialtyId);
                    const slots = doctor.availability.filter((slot) => slot.hospitalId === data.id);
                    return (
                      <li key={doctor.id} className="card doctor-row">
                        <div>
                          <p className="doctor-row__name">
                            <Link to={paths.doctor(doctor.id)}>{doctor.name}</Link> <DemoBadge />
                          </p>
                          <p className="muted">{specialty ? pick(specialty.name) : ''}</p>
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
                          to={paths.newAppointment({ hospitalId: data.id, doctorId: doctor.id })}
                          variant="secondary"
                          size="sm"
                        >
                          {t('common.requestAppointment')}
                        </ButtonLink>
                      </li>
                    );
                  })}
                </ul>
              ))}
          </section>
        </div>

        <aside className="stack">
          <div className="card">
            <h2 className="card__heading">{t('hospital.contact')}</h2>
            <ul className="plain-list contact-list">
              <li className="meta">
                <Icon name="map-pin" size={16} />
                <span>
                  {data.addressLine}
                  <br />
                  {joinPlace([place(data.city), place(data.district)])}
                </span>
              </li>
              <li className="meta">
                <Icon name="phone" size={16} />
                <span>
                  {data.phone} <span className="muted">({t('hospital.demoNumber')})</span>
                </span>
              </li>
              {data.email && (
                <li className="meta">
                  <Icon name="mail" size={16} />
                  <span>{data.email}</span>
                </li>
              )}
            </ul>
            <a
              className={buttonClass('secondary', 'sm')}
              href={mapsSearchUrl(mapQuery)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('hospital.openMap')}
            </a>
            <p className="muted small">{t('hospital.mapNote')}</p>
          </div>

          <div className="card">
            <h2 className="card__heading">{t('hospital.hours')}</h2>
            <HoursList hours={data.openingHours} />
          </div>

          <Notice tone="info">{t('hospital.confirmNote')}</Notice>
        </aside>
      </div>
    </div>
  );
}
