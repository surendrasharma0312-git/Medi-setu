import { useI18n } from '../../i18n';

/** Two-button toggle. Labels carry their own lang attribute so screen readers pronounce them correctly. */
export function LanguageToggle() {
  const { lang, setLang, t } = useI18n();
  return (
    <div className="lang-toggle" role="group" aria-label={t('nav.language')}>
      <button
        type="button"
        lang="en"
        aria-pressed={lang === 'en'}
        aria-label="English"
        onClick={() => setLang('en')}
      >
        EN
      </button>
      <button
        type="button"
        lang="hi"
        aria-pressed={lang === 'hi'}
        aria-label="हिन्दी"
        onClick={() => setLang('hi')}
      >
        हिं
      </button>
    </div>
  );
}
