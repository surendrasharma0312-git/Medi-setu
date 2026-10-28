import { Link } from 'react-router-dom';
import { LoginForm } from '../../components/auth/LoginForm';
import { Notice } from '../../components/ui/Notice';
import { PageHeader } from '../../components/ui/PageHeader';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useI18n } from '../../i18n';
import { paths } from '../../routes/paths';

export default function PatientLoginPage() {
  const { t } = useI18n();
  useDocumentTitle(t('auth.patientLogin.title'));

  return (
    <div className="auth-card stack">
      <PageHeader title={t('auth.patientLogin.title')} description={t('auth.patientLogin.subtitle')} />
      <Notice tone="warning">{t('auth.prototype')}</Notice>
      <LoginForm role="patient" />
      <p className="auth-switch">
        {t('auth.noAccount')} <Link to={paths.patientRegister}>{t('auth.createAccount')}</Link>
      </p>
      <p className="auth-switch">
        <Link to={paths.hospitalLogin}>{t('auth.areHospital')}</Link>
      </p>
    </div>
  );
}
