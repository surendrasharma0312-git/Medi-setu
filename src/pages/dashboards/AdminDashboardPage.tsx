import { useState } from 'react';
import { Badge, DemoBadge } from '../../components/ui/Badge';
import type { BadgeTone } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Notice } from '../../components/ui/Notice';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { EmptyState, ErrorState, LoadingState } from '../../components/ui/States';
import { getFacilityType, getStateInfo } from '../../data/reference';
import { useAsync } from '../../hooks/useAsync';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useI18n } from '../../i18n';
import { decideVerification, getAdminStats, listVerificationQueue } from '../../services';
import type { VerificationDecision } from '../../types';

const DECISION_TONE: Record<VerificationDecision, BadgeTone> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
};

/**
 * Admin dashboard. PROTOTYPE: approving or rejecting only changes in-memory demo
 * data. It does not verify anything and never produces a public verified badge.
 */
export default function AdminDashboardPage() {
  const { t, pick, place, formatDate } = useI18n();
  useDocumentTitle(t('dash.admin.title'));
  const stats = useAsync(() => getAdminStats(), []);
  const queue = useAsync(() => listVerificationQueue(), []);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  const decide = async (id: string, decision: 'approved' | 'rejected') => {
    setBusyId(id);
    setFailed(false);
    try {
      await decideVerification(id, decision);
      queue.reload();
      stats.reload();
    } catch {
      setFailed(true);
    } finally {
      setBusyId(null);
    }
  };

  const loadedStats = stats.status === 'success' ? stats.data : null;

  return (
    <div className="stack-lg">
      <PageHeader eyebrow={<DemoBadge />} title={t('dash.admin.title')} description={t('dash.admin.subtitle')} />
      <Notice tone="warning">{t('dash.admin.notice')}</Notice>

      <div className="grid grid--4">
        <StatCard label={t('dash.admin.statHospitals')} value={loadedStats ? loadedStats.hospitals : '–'} />
        <StatCard label={t('dash.admin.statDoctors')} value={loadedStats ? loadedStats.doctors : '–'} />
        <StatCard label={t('dash.admin.statPending')} value={loadedStats ? loadedStats.pendingVerifications : '–'} />
        <StatCard label={t('dash.admin.statRequests')} value={loadedStats ? loadedStats.appointmentRequests : '–'} />
      </div>

      <section>
        <h2>{t('dash.admin.queue')}</h2>
        {failed && <Notice tone="danger">{t('error.generic')}</Notice>}
        {queue.status === 'loading' && <LoadingState />}
        {queue.status === 'error' && <ErrorState onRetry={queue.reload} />}
        {queue.status === 'success' &&
          (queue.data.length === 0 ? (
            <EmptyState icon="shield" title={t('dash.admin.queueEmpty')} />
          ) : (
            <div className="table-wrap">
              <table className="table">
                <caption className="sr-only">{t('dash.admin.queue')}</caption>
                <thead>
                  <tr>
                    <th scope="col">{t('dash.admin.colHospital')}</th>
                    <th scope="col">{t('dash.admin.colLocation')}</th>
                    <th scope="col">{t('dash.admin.colSubmitted')}</th>
                    <th scope="col">{t('dash.admin.colDecision')}</th>
                    <th scope="col">
                      <span className="sr-only">{t('dash.hospital.colAction')}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {queue.data.map((item) => {
                    const facility = getFacilityType(item.facilityType);
                    const state = getStateInfo(item.state);
                    return (
                      <tr key={item.id}>
                        <td>
                          <strong>{item.hospitalName}</strong>
                          <br />
                          <span className="muted">{facility ? pick(facility.name) : ''}</span>
                        </td>
                        <td>
                          {place(item.district)}
                          {state ? `, ${pick(state.name)}` : ''}
                        </td>
                        <td>{formatDate(item.submittedAt)}</td>
                        <td>
                          <Badge tone={DECISION_TONE[item.decision]}>{t(`admin.decision.${item.decision}`)}</Badge>
                        </td>
                        <td>
                          {item.decision === 'pending' && (
                            <div className="row">
                              <Button size="sm" disabled={busyId === item.id} onClick={() => decide(item.id, 'approved')}>
                                {t('dash.admin.approve')}
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                disabled={busyId === item.id}
                                onClick={() => decide(item.id, 'rejected')}
                              >
                                {t('dash.admin.reject')}
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
      </section>

      <section>
        <h2>{t('dash.admin.more')}</h2>
        <div className="grid grid--2">
          <div className="card">
            <h3 className="card__heading">{t('dash.admin.listingsCard')}</h3>
            <p className="muted">{t('dash.admin.listingsBody')}</p>
            <Button variant="secondary" disabled>
              {t('common.comingSoon')}
            </Button>
          </div>
          <div className="card">
            <h3 className="card__heading">{t('dash.admin.reportsCard')}</h3>
            <p className="muted">{t('dash.admin.reportsBody')}</p>
            <Button variant="secondary" disabled>
              {t('common.comingSoon')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
