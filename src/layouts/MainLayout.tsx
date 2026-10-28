import { Outlet } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { Header } from '../components/layout/Header';
import { PrototypeBanner } from '../components/layout/PrototypeBanner';
import { ScrollToTop } from '../components/layout/ScrollToTop';
import { useI18n } from '../i18n';

/** Wraps every page: skip link, prototype banner, header, main content and footer. */
export function MainLayout() {
  const { t } = useI18n();
  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">
        {t('common.skipToContent')}
      </a>
      <PrototypeBanner />
      <Header />
      <main id="main" tabIndex={-1} className="site-main">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
