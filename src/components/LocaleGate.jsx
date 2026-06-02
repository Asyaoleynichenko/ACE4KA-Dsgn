import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '../i18n/constants.js';
import { withLocalePrefix } from '../i18n/localePath.js';

/**
 * Валидирует `:locale`, нормализует регистр URL.
 * Невалидный первый сегмент трактуется как путь без локали:
 * `/foo/bar?x#h` → `/{default}/foo/bar?x#h` (путь, query и hash сохраняются).
 */
export default function LocaleGate() {
  const { locale } = useParams();
  const { pathname, search, hash } = useLocation();
  const low = locale?.toLowerCase() ?? '';

  if (!SUPPORTED_LOCALES.includes(low)) {
    return (
      <Navigate to={`${withLocalePrefix(DEFAULT_LOCALE, pathname)}${search}${hash}`} replace />
    );
  }

  if (locale !== low) {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length) parts[0] = low;
    const next = parts.length ? `/${parts.join('/')}` : `/${low}`;
    return <Navigate to={`${next}${search}${hash}`} replace />;
  }

  return <Outlet />;
}
