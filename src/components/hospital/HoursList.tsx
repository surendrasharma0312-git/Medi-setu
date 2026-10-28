import { useI18n } from '../../i18n';
import type { OpeningHours, Weekday } from '../../types';
import { formatTime } from '../../utils/format';
import { formatDays } from '../../utils/schedule';

export function HoursList({ hours }: { hours: OpeningHours[] }) {
  const { t } = useI18n();
  const dayLabel = (day: Weekday): string => t(`day.${day}`);
  return (
    <ul className="plain-list">
      {hours.map((entry) => (
        <li key={`${entry.days.join('')}-${entry.open}`}>
          <strong>{formatDays(entry.days, dayLabel)}</strong> {formatTime(entry.open)} – {formatTime(entry.close)}
        </li>
      ))}
    </ul>
  );
}
