import { NavLink, Outlet } from 'react-router-dom';
import { Notice } from '../components/ui/Notice';
import { useI18n } from '../i18n';
import type { TranslationKey } from '../i18n';
import { paths } from '../routes/paths';

const TABS: { to: string; label: TranslationKey }[] = [
  { to: paths.patientDashboard, label: 'dash.tab.patient' },
  { to: paths.hospitalDashboard, label: 'dash.tab.hospital' },
  { to: paths.adminDashboard, label: 'dash.tab.admin' },
];

/**
 * Shared frame for the three dashboards. There is no login in the prototype, so
 * the tabs let reviewers switch between roles. Remove the tabs when real
 * role-based access is added: each user then only sees their own dashboard.
 */
export function DashboardLayout() {
  const { t } = useI18n();
  return (
    <div className="container dashboard">
      <Notice tone="warning" title={t('dash.prototypeTitle')}>
        {t('dash.prototypeBody')}
      </Notice>
      <nav className="tabs" aria-label={t('dash.tabsLabel')}>
        {TABS.map((tab) => (
          <NavLink key={tab.to} to={tab.to} className={({ isActive }) => (isActive ? 'tab is-active' : 'tab')}>
            {t(tab.label)}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  );
}
