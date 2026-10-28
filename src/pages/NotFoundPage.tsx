import { ButtonLink } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useI18n } from '../i18n';
import { paths } from '../routes/paths';

export default function NotFoundPage() {
  const { t } = useI18n();
  useDocumentTitle(t('notfound.title'));

  return (
    <div className="container page narrow">
      <PageHeader title={t('notfound.title')} description={t('notfound.body')} />
      <div className="row">
        <ButtonLink to={paths.home}>{t('notfound.home')}</ButtonLink>
        <ButtonLink to={paths.hospitals} variant="secondary">
          {t('nav.hospitals')}
        </ButtonLink>
      </div>
    </div>
  );
}
