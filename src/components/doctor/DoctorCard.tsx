import { Link } from 'react-router-dom';
import { getSpecialty } from '../../data/reference';
import { useI18n } from '../../i18n';
import { paths } from '../../routes/paths';
import type { DoctorWithHospitals } from '../../types';
import { DemoBadge } from '../ui/Badge';
import { ButtonLink } from '../ui/Button';
import { Icon } from '../ui/Icon';

export function DoctorCard({ doctor }: { doctor: DoctorWithHospitals }) {
  const { t, pick, place } = useI18n();
  const specialty = getSpecialty(doctor.specialtyId);

  return (
    <article className="card doctor-card">
      <div className="doctor-card__head">
        <span className="avatar" aria-hidden="true">
          <Icon name="stethoscope" size={22} />
        </span>
        <div>
          <h3 className="card__title">
            <Link to={paths.doctor(doctor.id)}>{doctor.name}</Link>
          </h3>
          <p className="muted">{specialty ? pick(specialty.name) : ''}</p>
        </div>
        <DemoBadge />
      </div>
      <ul className="plain-list">
        {doctor.hospitals.map((hospital) => (
          <li key={hospital.id} className="meta">
            <Icon name="building" size={16} />
            <span>
              <Link to={paths.hospital(hospital.id)}>{hospital.name}</Link> · {place(hospital.city)}
            </span>
          </li>
        ))}
      </ul>
      <div className="card__actions row">
        <ButtonLink to={paths.doctor(doctor.id)} variant="secondary" size="sm">
          {t('doctors.viewProfile')}
        </ButtonLink>
        <ButtonLink to={paths.newAppointment({ hospitalId: doctor.hospitalIds[0], doctorId: doctor.id })} size="sm">
          {t('common.requestAppointment')}
        </ButtonLink>
      </div>
    </article>
  );
}
