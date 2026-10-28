import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useI18n } from '../../i18n';
import type { TranslationKey } from '../../i18n';
import { paths } from '../../routes/paths';
import { ButtonLink } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { BrandMark } from './BrandMark';
import { LanguageToggle } from './LanguageToggle';

interface NavItem {
  to: string;
  label: TranslationKey;
  end?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: paths.hospitals, label: 'nav.hospitals' },
  { to: paths.doctors, label: 'nav.doctors' },
  { to: paths.myAppointments, label: 'nav.myAppointments', end: true },
  { to: paths.hospitalLogin, label: 'nav.forHospitals' },
  { to: paths.about, label: 'nav.about' },
];

const linkClass = ({ isActive }: { isActive: boolean }): string => (isActive ? 'nav__link is-active' : 'nav__link');

export function Header() {
  const { t } = useI18n();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu after navigating.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Escape closes the mobile menu.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to={paths.home} className="brand">
          <BrandMark />
          <span className="brand__name">MediSetu</span>
        </Link>

        <nav className="nav nav--desktop" aria-label={t('nav.main')}>
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              {t(item.label)}
            </NavLink>
          ))}
        </nav>

        <div className="site-header__actions">
          <LanguageToggle />
          <span className="show-desktop">
            <ButtonLink to={paths.patientLogin} variant="secondary" size="sm">
              {t('nav.login')}
            </ButtonLink>
          </span>
          <button
            type="button"
            className="icon-btn nav-toggle"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} />
          </button>
        </div>
      </div>

      <nav id="mobile-nav" className="mobile-nav" aria-label={t('nav.main')} hidden={!menuOpen}>
        <div className="container">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              {t(item.label)}
            </NavLink>
          ))}
          <div className="mobile-nav__actions">
            <ButtonLink to={paths.patientLogin} block>
              {t('nav.patientLogin')}
            </ButtonLink>
            <ButtonLink to={paths.hospitalLogin} variant="secondary" block>
              {t('nav.hospitalLogin')}
            </ButtonLink>
          </div>
        </div>
      </nav>
    </header>
  );
}
