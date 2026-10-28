import type { ReactNode } from 'react';
import { useI18n } from '../../i18n';
import { Button } from './Button';
import { Icon } from './Icon';
import type { IconName } from './Icon';

export function LoadingState({ label }: { label?: string }) {
  const { t } = useI18n();
  return (
    <div className="state" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <p>{label ?? t('common.loading')}</p>
    </div>
  );
}

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { t } = useI18n();
  return (
    <div className="state state--error" role="alert">
      <Icon name="alert" size={32} />
      <h3>{t('error.title')}</h3>
      <p>{message ?? t('error.generic')}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          {t('common.retry')}
        </Button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: IconName;
  action?: ReactNode;
}

/** Used for "no results" after a search and for empty lists. */
export function EmptyState({ title, description, icon = 'search', action }: EmptyStateProps) {
  return (
    <div className="state">
      <Icon name={icon} size={32} />
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}
