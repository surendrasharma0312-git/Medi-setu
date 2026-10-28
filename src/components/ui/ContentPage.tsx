import type { ReactNode } from 'react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useI18n } from '../../i18n';
import type { TranslationKey } from '../../i18n';
import { PageHeader } from './PageHeader';

export interface ContentSection {
  title: TranslationKey;
  paragraphs: TranslationKey[];
}

interface ContentPageProps {
  title: TranslationKey;
  intro?: TranslationKey;
  /** Shown under the heading, e.g. the "draft - needs legal review" notice */
  notice?: ReactNode;
  sections: ContentSection[];
  children?: ReactNode;
}

/** Text-only page: heading, optional notice, and titled sections. All copy comes from translations. */
export function ContentPage({ title, intro, notice, sections, children }: ContentPageProps) {
  const { t } = useI18n();
  useDocumentTitle(t(title));

  return (
    <div className="container content-page">
      <PageHeader title={t(title)} description={intro ? t(intro) : undefined} />
      {notice}
      {sections.map((section) => (
        <section key={section.title} className="content-section">
          <h2>{t(section.title)}</h2>
          {section.paragraphs.map((key) => (
            <p key={key}>{t(key)}</p>
          ))}
        </section>
      ))}
      {children}
    </div>
  );
}
