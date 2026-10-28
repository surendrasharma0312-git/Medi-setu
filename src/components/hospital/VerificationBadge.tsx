import { useI18n } from '../../i18n';
import type { VerificationStatus } from '../../types';
import { Badge } from '../ui/Badge';
import type { BadgeTone } from '../ui/Badge';

const TONE: Record<VerificationStatus, BadgeTone> = {
  unverified: 'neutral',
  pending: 'warning',
  verified: 'success',
  rejected: 'danger',
};

/**
 * Shows the verification state stored on the record. Every demo hospital is
 * "unverified", so this prototype never displays a verified badge.
 */
export function VerificationBadge({ status }: { status: VerificationStatus }) {
  const { t } = useI18n();
  return <Badge tone={TONE[status]}>{t(`verification.${status}`)}</Badge>;
}
