import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, ButtonLink } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import type { IconName } from '../components/ui/Icon';
import { Notice } from '../components/ui/Notice';
import { SITE } from '../config/site';
import { SPECIALTIES } from '../data/reference';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useI18n } from '../i18n';
import type { TranslationKey } from '../i18n';
import { paths, withQuery } from '../routes/paths';

const QUICK_SEARCHES: TranslationKey[] = [
  'home.chip.pain',
  'home.chip.fever',
  'home.chip.teeth',
  'home.chip.eyes',
  'home.chip.pregnancy',
  'home.chip.child',
];

const STEPS: { title: TranslationKey; body: TranslationKey; icon: IconName }[] = [
  { title: 'home.step1.title', body: 'home.step1.body', icon: 'search' },
  { title: 'home.step2.title', body: 'home.step2.body', icon: 'building' },
  { title: 'home.step3.title', body: 'home.step3.body', icon: 'calendar' },
];

export default function HomePage() {
  const { t, pick } = useI18n();
  useDocumentTitle(t('home.docTitle'));
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(withQuery(paths.hospitals, { q: query.trim() }));
  };

  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="hero__eyebrow">{t('home.eyebrow')}</p>
          <h1>{t('home.title')}</h1>
          <p className="hero__lead">{t('home.lead')}</p>
          <form className="hero__search" onSubmit={onSubmit} role="search">
            <label htmlFor="home-search" className="sr-only">
              {t('home.searchLabel')}
            </label>
            <input
              id="home-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('home.searchPlaceholder')}
              autoComplete="off"
            />
            <Button type="submit">
              <Icon name="search" />
              {t('common.search')}
            </Button>
          </form>
          <p className="hero__hint">{t('home.searchHint')}</p>
          <ul className="chips" aria-label={t('home.quickSearches')}>
            {QUICK_SEARCHES.map((key) => (
              <li key={key}>
                <Link className="chip" to={withQuery(paths.hospitals, { q: t(key).toLowerCase() })}>
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--subtle">
        <div className="container launch">
          <div>
            <h2>{t('home.launch.title')}</h2>
            <p>{t('home.launch.body')}</p>
          </div>
          <ButtonLink
            to={withQuery(paths.hospitals, { state: SITE.launch.stateCode, district: SITE.launch.district })}
            variant="secondary"
          >
            {t('home.launch.cta')}
          </ButtonLink>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>{t('home.how.title')}</h2>
          <ol className="grid grid--3 steps">
            {STEPS.map((step, index) => (
              <li key={step.title} className="card step">
                <span className="step__icon" aria-hidden="true">
                  <Icon name={step.icon} size={22} />
                </span>
                <h3>
                  <span className="step__number">{index + 1}.</span> {t(step.title)}
                </h3>
                <p>{t(step.body)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--subtle">
        <div className="container">
          <h2>{t('home.specialties.title')}</h2>
          <ul className="spec-grid">
            {SPECIALTIES.map((specialty) => (
              <li key={specialty.id}>
                <Link className="spec-link" to={withQuery(paths.hospitals, { specialty: specialty.id })}>
                  {pick(specialty.name)}
                  <Icon name="arrow-right" size={16} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid--2">
          <div className="card card--accent">
            <h2>{t('home.forHospitals.title')}</h2>
            <p>{t('home.forHospitals.body')}</p>
            <div className="row">
              <ButtonLink to={paths.hospitalRegister}>{t('footer.listHospital')}</ButtonLink>
              <ButtonLink to={paths.hospitalLogin} variant="secondary">
                {t('nav.hospitalLogin')}
              </ButtonLink>
            </div>
          </div>
          <Notice tone="info" title={t('home.safety.title')}>
            {t('home.safety.body', { number: SITE.emergencyNumber })}
          </Notice>
        </div>
      </section>
    </>
  );
}
