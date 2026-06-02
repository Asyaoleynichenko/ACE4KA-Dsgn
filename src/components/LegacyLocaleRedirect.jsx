import { Navigate, useLocation } from 'react-router-dom';
import { readLocaleFromPathOrStorage } from '../i18n/localePath.js';

/** `/` → `/{locale}` (из URL при наличии, иначе из localStorage); query/hash сохраняются. */
export function RootLocaleRedirect() {
  const { search, hash } = useLocation();
  const loc = readLocaleFromPathOrStorage();
  return <Navigate to={`/${loc}${search}${hash}`} replace />;
}

/** Старые пути без префикса (`/projects`, `/project/:slug`, …) → `/{locale}/...`. */
export function LegacyLocaleRedirect() {
  const { pathname, search, hash } = useLocation();
  const loc = readLocaleFromPathOrStorage();
  return <Navigate to={`/${loc}${pathname}${search}${hash}`} replace />;
}
