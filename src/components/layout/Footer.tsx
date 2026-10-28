import { Link } from 'react-router-dom';
import { SITE } from '../../config/site';
import { useI18n } from '../../i18n';
import { paths } from '../../routes/paths';
import { BrandMark } from './BrandMark';

interface FooterLink {
  to: string;
  label: string;
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h2 className="site-footer__title">{title}</h2>
      <ul className="site-footer__list">
        {links.map((link) => (
          <li key={link.to}>
            <Link to={link.to}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div>
            <p className="site-footer__brand">
              <BrandMark size={28} />
              <span>MediSetu</span>
            </p>
            <p className="site-footer__tagline">{t('footer.tagline')}</p>
          </div>
          <FooterColumn
            title={t('footer.explore')}
            links={[
              { to: paths.hospitals, label: t('nav.hospitals') },
              { to: paths.doctors, label: t('nav.doctors') },
              { to: paths.myAppointments, label: t('nav.myAppointments') },
              { to: paths.about, label: t('nav.about') },
              { to: paths.contact, label: t('nav.contact') },
            ]}
          />
          <FooterColumn
            title={t('footer.hospitals')}
            links={[
              { to: paths.hospitalLogin, label: t('nav.hospitalLogin') },
              { to: paths.hospitalRegister, label: t('footer.listHospital') },
              { to: paths.patientLogin, label: t('nav.patientLogin') },
              { to: paths.patientRegister, label: t('footer.createPatient') },
            ]}
          />
          <FooterColumn
            title={t('footer.prototypeScreens')}
            links={[
              { to: paths.patientDashboard, label: t('dash.tab.patient') },
              { to: paths.hospitalDashboard, label: t('dash.tab.hospital') },
              { to: paths.adminDashboard, label: t('dash.tab.admin') },
            ]}
          />
        </div>
        <ul className="site-footer__legal" aria-label={t('footer.legal')}>
          <li>
            <Link to={paths.privacy}>{t('nav.privacy')}</Link>
          </li>
          <li>
            <Link to={paths.terms}>{t('nav.terms')}</Link>
          </li>
        </ul>
        <p className="site-footer__safety">{t('footer.safety', { number: SITE.emergencyNumber })}</p>
        <p className="site-footer__copy">{t('footer.copyright', { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}
