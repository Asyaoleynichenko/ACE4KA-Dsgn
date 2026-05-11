import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '../i18n/constants.js';

/** Валидирует `:locale`, нормализует регистр URL, иначе — на главную выбранной локали. */
export default function LocaleGate() {
  const { locale } = useParams();
  const { pathname, search, hash } = useLocation();
  const low = locale?.toLowerCase() ?? '';

  if (!SUPPORTED_LOCALES.includes(low)) {
    return <Navigate to={`/${DEFAULT_LOCALE}`} replace />;
  }

  if (locale !== low) {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length) parts[0] = low;
    const next = parts.length ? `/${parts.join('/')}` : `/${low}`;
    return <Navigate to={`${next}${search}${hash}`} replace />;
  }

  return <Outlet />;
}
