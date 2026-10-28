import { ButtonLink } from '../components/ui/Button';
import { ContentPage } from '../components/ui/ContentPage';
import type { ContentSection } from '../components/ui/ContentPage';
import { Notice } from '../components/ui/Notice';
import { useI18n } from '../i18n';
import { paths } from '../routes/paths';

const SECTIONS: ContentSection[] = [
  { title: 'about.what.title', paragraphs: ['about.what.p1', 'about.what.p2'] },
  { title: 'about.why.title', paragraphs: ['about.why.p1'] },
  { title: 'about.launch.title', paragraphs: ['about.launch.p1'] },
  { title: 'about.status.title', paragraphs: ['about.status.p1', 'about.status.p2', 'about.status.p3'] },
  { title: 'about.safety.title', paragraphs: ['about.safety.p1'] },
];

export default function AboutPage() {
  const { t } = useI18n();
  return (
    <ContentPage
      title="about.title"
      intro="about.intro"
      notice={<Notice tone="warning">{t('about.notice')}</Notice>}
      sections={SECTIONS}
    >
      <div className="row">
        <ButtonLink to={paths.hospitals}>{t('nav.hospitals')}</ButtonLink>
        <ButtonLink to={paths.contact} variant="secondary">
          {t('nav.contact')}
        </ButtonLink>
      </div>
    </ContentPage>
  );
}
