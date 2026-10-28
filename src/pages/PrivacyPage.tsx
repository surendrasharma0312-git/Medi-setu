import { ContentPage } from '../components/ui/ContentPage';
import type { ContentSection } from '../components/ui/ContentPage';
import { Notice } from '../components/ui/Notice';
import { useI18n } from '../i18n';

const SECTIONS: ContentSection[] = [
  { title: 'privacy.s1.title', paragraphs: ['privacy.s1.p'] },
  { title: 'privacy.s2.title', paragraphs: ['privacy.s2.p'] },
  { title: 'privacy.s3.title', paragraphs: ['privacy.s3.p'] },
  { title: 'privacy.s4.title', paragraphs: ['privacy.s4.p'] },
  { title: 'privacy.s5.title', paragraphs: ['privacy.s5.p'] },
  { title: 'privacy.s6.title', paragraphs: ['privacy.s6.p'] },
];

/** INITIAL DRAFT. Must be reviewed by a qualified lawyer before any real launch. */
export default function PrivacyPage() {
  const { t } = useI18n();
  return (
    <ContentPage
      title="privacy.title"
      notice={
        <Notice tone="warning" title={t('legal.draftTitle')}>
          {t('legal.draftBody')}
        </Notice>
      }
      sections={SECTIONS}
    />
  );
}
