import { Link } from 'react-router-dom';
import { getFacilityType, getSpecialty, getStateInfo } from '../../data/reference';
import { useI18n } from '../../i18n';
import { paths } from '../../routes/paths';
import type { Hospital } from '../../types';
import { joinPlace } from '../../utils/format';
import { Badge, DemoBadge } from '../ui/Badge';
import { ButtonLink } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { VerificationBadge } from './VerificationBadge';

const MAX_CHIPS = 3;

export function HospitalCard({ hospital }: { hospital: Hospital }) {
  const { t, pick, place } = useI18n();
  const facility = getFacilityType(hospital.facilityType);
  const state = getStateInfo(hospital.state);
  const specialtyNames = hospital.specialtyIds.flatMap((id) => {
    const specialty = getSpecialty(id);
    return specialty ? [pick(specialty.name)] : [];
  });
  const shown = specialtyNames.slice(0, MAX_CHIPS);
  const hiddenCount = specialtyNames.length - shown.length;

  return (
    <article className="card hospital-card">
      <div className="badge-row">
        {facility && <Badge tone="info">{pick(facility.name)}</Badge>}
        <DemoBadge />
        <VerificationBadge status={hospital.verification} />
      </div>
      <h3 className="card__title">
        <Link to={paths.hospital(hospital.id)}>{hospital.name}</Link>
      </h3>
      <p className="meta">
        <Icon name="map-pin" size={16} />
        <span>
          {joinPlace([hospital.locality, place(hospital.city), place(hospital.district), state ? pick(state.name) : undefined])}
        </span>
      </p>
      <ul className="chips" aria-label={t('hospital.specialties')}>
        {shown.map((name) => (
          <li key={name} className="chip chip--static">
            {name}
          </li>
        ))}
        {hiddenCount > 0 && <li className="chip chip--static">{t('hospital.moreCount', { count: hiddenCount })}</li>}
        {specialtyNames.length === 0 && <li className="muted">{t('hospital.noSpecialties')}</li>}
      </ul>
      <div className="card__actions row">
        <ButtonLink to={paths.hospital(hospital.id)} variant="secondary" size="sm">
          {t('common.viewDetails')}
        </ButtonLink>
        <ButtonLink to={paths.newAppointment({ hospitalId: hospital.id })} size="sm">
          {t('common.requestAppointment')}
        </ButtonLink>
      </div>
    </article>
  );
}
