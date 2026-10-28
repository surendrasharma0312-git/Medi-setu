import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DoctorCard } from '../components/doctor/DoctorCard';
import { Button } from '../components/ui/Button';
import { SelectField, TextField } from '../components/ui/Fields';
import { Icon } from '../components/ui/Icon';
import { Notice } from '../components/ui/Notice';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState, ErrorState, LoadingState } from '../components/ui/States';
import { SPECIALTIES } from '../data/reference';
import { useAsync } from '../hooks/useAsync';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useI18n } from '../i18n';
import { getHospitalFilterOptions, searchDoctors } from '../services';
import type { DoctorSearchParams } from '../services';

/** Doctor directory. Filters live in the URL: /doctors?q=asha&specialty=paediatrics&district=Siwan */
export default function DoctorsPage() {
  const { t, pick, place } = useI18n();
  useDocumentTitle(t('doctors.docTitle'));
  const [searchParams, setSearchParams] = useSearchParams();

  const params: DoctorSearchParams = {
    query: searchParams.get('q') ?? '',
    specialtyId: searchParams.get('specialty') ?? '',
    district: searchParams.get('district') ?? '',
  };
  const hasFilters = Object.values(params).some(Boolean);
  const [queryDraft, setQueryDraft] = useState(params.query ?? '');

  useEffect(() => {
    setQueryDraft(searchParams.get('q') ?? '');
  }, [searchParams]);

  const options = useAsync(() => getHospitalFilterOptions(), []);
  const results = useAsync(() => searchDoctors(params), [searchParams.toString()]);

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
    update({ q: queryDraft.trim() });
  };

  const clearAll = () => {
    setQueryDraft('');
    setSearchParams({}, { replace: true });
  };

  const districtOptions =
    options.status === 'success' ? Array.from(new Set(options.data.districts.map((item) => item.district))).sort() : [];

  return (
    <div className="container page">
      <PageHeader title={t('doctors.title')} description={t('doctors.subtitle')} />
      <Notice tone="warning">{t('doctors.demoNotice')}</Notice>

      <form className="card filters" onSubmit={onSubmit} role="search" noValidate>
        <div className="filters__main">
          <TextField
            name="q"
            type="search"
            label={t('doctors.searchLabel')}
            placeholder={t('doctors.searchPlaceholder')}
            value={queryDraft}
            onChange={(event) => setQueryDraft(event.target.value)}
            autoComplete="off"
          />
          <Button type="submit" className="filters__submit">
            <Icon name="search" />
            {t('common.search')}
          </Button>
        </div>
        <div className="filters__extra is-open">
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
              icon="users"
              title={t('doctors.noResults.title')}
              description={t('doctors.noResults.body')}
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
                {t('doctors.resultCount', { count: results.data.length })}
              </p>
              <div className="grid grid--2">
                {results.data.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
            </>
          ))}
      </div>
    </div>
  );
}
