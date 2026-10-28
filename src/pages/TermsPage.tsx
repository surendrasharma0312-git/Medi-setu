import { ContentPage } from '../components/ui/ContentPage';
import type { ContentSection } from '../components/ui/ContentPage';
import { Notice } from '../components/ui/Notice';
import { useI18n } from '../i18n';

const SECTIONS: ContentSection[] = [
  { title: 'terms.s1.title', paragraphs: ['terms.s1.p'] },
  { title: 'terms.s2.title', paragraphs: ['terms.s2.p'] },
  { title: 'terms.s3.title', paragraphs: ['terms.s3.p'] },
  { title: 'terms.s4.title', paragraphs: ['terms.s4.p'] },
  { title: 'terms.s5.title', paragraphs: ['terms.s5.p'] },
  { title: 'terms.s6.title', paragraphs: ['terms.s6.p'] },
  { title: 'terms.s7.title', paragraphs: ['terms.s7.p'] },
];

/** INITIAL DRAFT. Must be reviewed by a qualified lawyer before any real launch. */
export default function TermsPage() {
  const { t } = useI18n();
  return (
    <ContentPage
      title="terms.title"
      notice={
        <Notice tone="warning" title={t('legal.draftTitle')}>
          {t('legal.draftBody')}
        </Notice>
      }
      sections={SECTIONS}
    />
  );
}
