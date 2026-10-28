import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HospitalCard } from '../components/hospital/HospitalCard';
import { Button } from '../components/ui/Button';
import { SelectField, TextField } from '../components/ui/Fields';
import { Icon } from '../components/ui/Icon';
import { Notice } from '../components/ui/Notice';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState, ErrorState, LoadingState } from '../components/ui/States';
import { FACILITY_TYPES, SPECIALTIES, getStateInfo } from '../data/reference';
import { useAsync } from '../hooks/useAsync';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useI18n } from '../i18n';
import { getHospitalFilterOptions, searchHospitals } from '../services';
import type { HospitalSearchParams } from '../services';

/**
 * Hospital search. The URL is the source of truth for all filters, so results
 * can be bookmarked and shared:  /hospitals?q=pain&state=BR&district=Siwan
 */
export default function HospitalsPage() {
  const { t, pick, place } = useI18n();
  useDocumentTitle(t('hospitals.docTitle'));
  const [searchParams, setSearchParams] = useSearchParams();

  const params: HospitalSearchParams = {
    query: searchParams.get('q') ?? '',
    state: searchParams.get('state') ?? '',
    district: searchParams.get('district') ?? '',
    place: searchParams.get('place') ?? '',
    specialtyId: searchParams.get('specialty') ?? '',
    facilityType: searchParams.get('type') ?? '',
  };
  const hasFilters = Object.values(params).some(Boolean);

  const [queryDraft, setQueryDraft] = useState(params.query ?? '');
  const [placeDraft, setPlaceDraft] = useState(params.place ?? '');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Keep the text boxes in sync when the URL changes (back button, quick links).
  useEffect(() => {
    setQueryDraft(searchParams.get('q') ?? '');
    setPlaceDraft(searchParams.get('place') ?? '');
  }, [searchParams]);

  const options = useAsync(() => getHospitalFilterOptions(), []);
  const results = useAsync(() => searchHospitals(params), [searchParams.toString()]);

  const update = (changes: Record<string, string>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    setSearchParams(next, { replace: true });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    update({ q: queryDraft.trim(), place: placeDraft.trim() });
  };

  const clearAll = () => {
    setQueryDraft('');
    setPlaceDraft('');
    setSearchParams({}, { replace: true });
  };

  const stateOptions =
    options.status === 'success'
      ? options.data.states
          .map((code) => ({ code, label: pick(getStateInfo(code)?.name ?? { en: code, hi: code }) }))
          .sort((a, b) => a.label.localeCompare(b.label))
      : [];
  const districtOptions =
    options.status === 'success'
      ? Array.from(
          new Set(
            options.data.districts
              .filter((item) => !params.state || item.state === params.state)
              .map((item) => item.district),
          ),
        ).sort()
      : [];

  return (
    <div className="container page">
      <PageHeader title={t('hospitals.title')} description={t('hospitals.subtitle')} />
      <Notice tone="warning">{t('hospitals.demoNotice')}</Notice>

      <form className="card filters" onSubmit={onSubmit} role="search" noValidate>
        <div className="filters__main">
          <TextField
            name="q"
            type="search"
            label={t('hospitals.searchLabel')}
            placeholder={t('hospitals.searchPlaceholder')}
            value={queryDraft}
            onChange={(event) => setQueryDraft(event.target.value)}
            autoComplete="off"
          />
          <Button type="submit" className="filters__submit">
            <Icon name="search" />
            {t('common.search')}
          </Button>
        </div>

        <button
          type="button"
          className="filters__toggle"
          aria-expanded={filtersOpen}
          aria-controls="filters-extra"
          onClick={() => setFiltersOpen((open) => !open)}
        >
          {t('hospitals.filters')}
          <Icon name="chevron-down" size={16} />
        </button>

        <div id="filters-extra" className={filtersOpen ? 'filters__extra is-open' : 'filters__extra'}>
          <SelectField
            name="state"
            label={t('hospitals.state')}
            value={params.state}
            onChange={(event) => update({ state: event.target.value, district: '' })}
          >
            <option value="">{t('hospitals.allStates')}</option>
            {stateOptions.map((item) => (
              <option key={item.code} value={item.code}>
                {item.label}
              </option>
            ))}
          </SelectField>
          <SelectField
            name="district"
            label={t('hospitals.district')}
            value={params.district}
            onChange={(event) => update({ district: event.target.value })}
          >
            <option value="">{t('hospitals.allDistricts')}</option>
            {districtOptions.map((name) => (
              <option key={name} value={name}>
                {place(name)}
              </option>
            ))}
          </SelectField>
          <TextField
            name="place"
            label={t('hospitals.place')}
            placeholder={t('hospitals.placePlaceholder')}
            value={placeDraft}
            onChange={(event) => setPlaceDraft(event.target.value)}
            autoComplete="off"
          />
          <SelectField
            name="specialty"
            label={t('hospitals.specialty')}
            value={params.specialtyId}
            onChange={(event) => update({ specialty: event.target.value })}
          >
            <option value="">{t('hospitals.allSpecialties')}</option>
            {SPECIALTIES.map((specialty) => (
              <option key={specialty.id} value={specialty.id}>
                {pick(specialty.name)}
              </option>
            ))}
          </SelectField>
          <SelectField
            name="type"
            label={t('hospitals.facilityType')}
            value={params.facilityType}
            onChange={(event) => update({ type: event.target.value })}
          >
            <option value="">{t('hospitals.allTypes')}</option>
            {FACILITY_TYPES.map((facility) => (
              <option key={facility.id} value={facility.id}>
                {pick(facility.name)}
              </option>
            ))}
          </SelectField>
        </div>

        {hasFilters && (
          <div className="filters__footer">
            <Button variant="ghost" size="sm" onClick={clearAll}>
              {t('common.clearFilters')}
            </Button>
          </div>
        )}
      </form>

      <div className="results">
        {results.status === 'loading' && <LoadingState />}
        {results.status === 'error' && <ErrorState onRetry={results.reload} />}
        {results.status === 'success' &&
          (results.data.length === 0 ? (
            <EmptyState
              title={t('hospitals.noResults.title')}
              description={t('hospitals.noResults.body')}
              action={
                hasFilters ? (
                  <Button variant="secondary" onClick={clearAll}>
                    {t('common.clearFilters')}
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <>
              <p className="results__count" role="status">
                {t('hospitals.resultCount', { count: results.data.length })}
              </p>
              <div className="grid grid--2">
                {results.data.map((hospital) => (
                  <HospitalCard key={hospital.id} hospital={hospital} />
                ))}
              </div>
            </>
          ))}
      </div>
    </div>
  );
}
