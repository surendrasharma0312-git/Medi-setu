import { useI18n } from '../../i18n';

/** Always-visible label: this build is a prototype with fictional data. Do not remove before real launch review. */
export function PrototypeBanner() {
  const { t } = useI18n();
  return (
    <div className="proto-banner" role="note">
      <div className="container">{t('banner.prototype')}</div>
    </div>
  );
}
