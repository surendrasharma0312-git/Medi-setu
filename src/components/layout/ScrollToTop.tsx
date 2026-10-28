import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Scrolls to the top when the page changes (not when only the query string changes, e.g. filters). */
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
