import { useState } from 'react';
import { ReplyModal } from '../../components/appointment/ReplyModal';
import { VerificationBadge } from '../../components/hospital/VerificationBadge';
import { DemoBadge, StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { EmptyState, ErrorState, LoadingState } from '../../components/ui/States';
import { DEMO_HOSPITAL_ID } from '../../config/site';
import { useAsync } from '../../hooks/useAsync';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useI18n } from '../../i18n';
import { getHospital, listHospitalRequests } from '../../services';
import type { AppointmentRequest, AppointmentStatus } from '../../types';

/**
 * Hospital dashboard. PROTOTYPE: shows one fictional hospital and its fictional
 * requests. "Reply" changes demo data in memory only; nobody is notified.
 */
export default function HospitalDashboardPage() {
  const { t, formatDate } = useI18n();
  useDocumentTitle(t('dash.hospital.title'));
  const hospital = useAsync(() => getHospital(DEMO_HOSPITAL_ID), []);
  const requests = useAsync(() => listHospitalRequests(DEMO_HOSPITAL_ID), []);
  const [replyTo, setReplyTo] = useState<AppointmentRequest | null>(null);

  const countStatus = (status: AppointmentStatus): number =>
    requests.status === 'success' ? requests.data.filter((r) => r.status === status).length : 0;
  const total = requests.status === 'success' ? requests.data.length : 0;
  const loadedHospital = hospital.status === 'success' ? hospital.data : null;

  return (
    <div className="stack-lg">
      <PageHeader
        eyebrow={<DemoBadge />}
        title={t('dash.hospital.title')}
        description={t('dash.hospital.subtitle', { name: loadedHospital ? loadedHospital.name : '…' })}
      />

      <div className="grid grid--3">
        <StatCard label={t('dash.hospital.statNew')} value={countStatus('requested')} />
        <StatCard label={t('dash.hospital.statConfirmed')} value={countStatus('confirmed')} />
        <StatCard label={t('dash.hospital.statTotal')} value={total} />
      </div>

      <section>
        <h2>{t('dash.hospital.requests')}</h2>
        {requests.status === 'loading' && <LoadingState />}
        {requests.status === 'error' && <ErrorState onRetry={requests.reload} />}
        {requests.status === 'success' &&
          (requests.data.length === 0 ? (
            <EmptyState icon="calendar" title={t('dash.hospital.noRequests')} />
          ) : (
            <div className="table-wrap">
              <table className="table">
                <caption className="sr-only">{t('dash.hospital.requests')}</caption>
                <thead>
                  <tr>
                    <th scope="col">{t('dash.hospital.colPatient')}</th>
                    <th scope="col">{t('dash.hospital.colWhen')}</th>
                    <th scope="col">{t('myappt.doctor')}</th>
                    <th scope="col">{t('dash.hospital.colStatus')}</th>
                    <th scope="col">
                      <span className="sr-only">{t('dash.hospital.colAction')}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {requests.data.map((request) => (
                    <tr key={request.id}>
                      <td>
                        <strong>{request.patientName}</strong>
                        <br />
                        <span className="muted">{request.contact}</span>
                      </td>
                      <td>
                        {formatDate(request.preferredDate)}
                        <br />
                        <span className="muted">{t(`time.${request.preferredTime}`)}</span>
                      </td>
                      <td>{request.doctorName ?? t('appt.anyDoctor')}</td>
                      <td>
                        <StatusBadge status={request.status} />
                      </td>
                      <td>
                        {request.status === 'requested' ? (
                          <Button size="sm" onClick={() => setReplyTo(request)}>
                            {t('dash.hospital.reply')}
                          </Button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
      </section>

      <section>
        <h2>{t('dash.hospital.manage')}</h2>
        <div className="grid grid--3">
          <div className="card">
            <h3 className="card__heading">{t('dash.hospital.doctorsCard')}</h3>
            <p className="muted">{t('dash.hospital.doctorsBody')}</p>
            <Button variant="secondary" disabled>
              {t('common.comingSoon')}
            </Button>
          </div>
          <div className="card">
            <h3 className="card__heading">{t('dash.hospital.profileCard')}</h3>
            <p className="muted">{t('dash.hospital.profileBody')}</p>
            <Button variant="secondary" disabled>
              {t('common.comingSoon')}
            </Button>
          </div>
          <div className="card">
            <h3 className="card__heading">{t('dash.hospital.verifyCard')}</h3>
            <p className="muted">{t('dash.hospital.verifyBody')}</p>
            {loadedHospital && <VerificationBadge status={loadedHospital.verification} />}
          </div>
        </div>
      </section>

      <ReplyModal
        request={replyTo}
        onClose={() => setReplyTo(null)}
        onDone={() => {
          setReplyTo(null);
          requests.reload();
        }}
      />
    </div>
  );
}
