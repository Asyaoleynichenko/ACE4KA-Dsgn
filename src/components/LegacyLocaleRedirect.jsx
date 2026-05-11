import { Navigate, useLocation } from 'react-router-dom';
import {
  readLocaleFromPathOrStorage,
  readStoredLocale,
} from '../i18n/localePath.js';

/** `/` → `/{locale}` (из URL при наличии, иначе из localStorage). */
export function RootLocaleRedirect() {
  const loc = readLocaleFromPathOrStorage();
  return <Navigate to={`/${loc}`} replace />;
}

/** Старые пути без префикса (`/projects`, `/project/:slug`, …) → `/{locale}/...`. */
export function LegacyLocaleRedirect() {
  const { pathname, search, hash } = useLocation();
  const loc = readStoredLocale();
  return <Navigate to={`/${loc}${pathname}${search}${hash}`} replace />;
}
