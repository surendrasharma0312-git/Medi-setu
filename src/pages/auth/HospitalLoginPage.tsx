import { Link } from 'react-router-dom';
import { LoginForm } from '../../components/auth/LoginForm';
import { Notice } from '../../components/ui/Notice';
import { PageHeader } from '../../components/ui/PageHeader';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useI18n } from '../../i18n';
import { paths } from '../../routes/paths';

export default function HospitalLoginPage() {
  const { t } = useI18n();
  useDocumentTitle(t('auth.hospitalLogin.title'));

  return (
    <div className="auth-card stack">
      <PageHeader title={t('auth.hospitalLogin.title')} description={t('auth.hospitalLogin.subtitle')} />
      <Notice tone="warning">{t('auth.prototype')}</Notice>
      <LoginForm role="hospital" />
      <p className="auth-switch">
        {t('auth.hospitalNoAccount')} <Link to={paths.hospitalRegister}>{t('auth.registerHospital')}</Link>
      </p>
      <p className="auth-switch">
        <Link to={paths.patientLogin}>{t('auth.arePatient')}</Link>
      </p>
    </div>
  );
}
