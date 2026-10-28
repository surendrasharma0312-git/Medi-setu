import type { ReactNode } from 'react';
import { Icon } from './Icon';
import type { IconName } from './Icon';

export type NoticeTone = 'info' | 'warning' | 'success' | 'danger';

interface NoticeProps {
  tone?: NoticeTone;
  title?: string;
  children: ReactNode;
}

const ICON_BY_TONE: Record<NoticeTone, IconName> = {
  info: 'info',
  warning: 'alert',
  success: 'check',
  danger: 'alert',
};

/** Inline message box used for prototype labels, safety notes and form results. */
export function Notice({ tone = 'info', title, children }: NoticeProps) {
  return (
    <div className={`notice notice--${tone}`} role={tone === 'danger' ? 'alert' : 'note'}>
      <Icon name={ICON_BY_TONE[tone]} className="notice__icon" />
      <div className="notice__body">
        {title && <p className="notice__title">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
}
