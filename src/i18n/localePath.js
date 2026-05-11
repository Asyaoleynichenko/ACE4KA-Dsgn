import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, SUPPORTED_LOCALES } from './constants.js';

/** Pathname без префикса Vite `base` (для сравнения с тем, что отдаёт react-router). */
export function getPathnameWithoutViteBase(fullPathname) {
  const raw = import.meta.env.BASE_URL ?? '/';
  if (raw === '/') return fullPathname || '/';
  const b = String(raw).replace(/\/$/, '');
  const p = fullPathname || '/';
  if (p === b || p.startsWith(`${b}/`)) {
    const rest = p.slice(b.length) || '/';
    return rest.startsWith('/') ? rest : `/${rest}`;
  }
  return p.startsWith('/') ? p : `/${p}`;
}

export function getLocaleFromPathname(pathname) {
  const seg = pathname.split('/').filter(Boolean)[0]?.toLowerCase();
  return SUPPORTED_LOCALES.includes(seg) ? seg : null;
}

/**
 * Убирает ведущий сегмент `/ru` или `/en` из pathname роутера (без basename).
 * @param {string} pathname
 * @returns {string} путь вида `/`, `/about`, `/project/foo`
 */
export function stripLocaleFromPathname(pathname) {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length && SUPPORTED_LOCALES.includes(parts[0].toLowerCase())) {
    const rest = parts.slice(1).join('/');
    return rest ? `/${rest}` : '/';
  }
  return pathname || '/';
}

/**
 * @param {string} locale
 * @param {string} appPath путь приложения: `/`, `/about`, `/project/x`, `/about#id` (query — в appPath после `?`)
 */
export function withLocalePrefix(locale, appPath) {
  const loc = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  const raw = appPath || '/';
  const [pathPart, hashPart] = raw.split('#');
  const [pathOnly, queryPart] = pathPart.split('?');
  const clean = pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`;
  const base = clean === '/' ? `/${loc}` : `/${loc}${clean}`;
  const withQuery = queryPart != null && queryPart !== '' ? `${base}?${queryPart}` : base;
  return hashPart != null && hashPart !== '' ? `${withQuery}#${hashPart}` : withQuery;
}

export function readStoredLocale() {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  try {
    const v = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    const s = typeof v === 'string' ? v.trim().toLowerCase() : '';
    return SUPPORTED_LOCALES.includes(s) ? s : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

export function writeStoredLocale(locale) {
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    /* ignore */
  }
}

/** Локаль из URL или из storage (для первого paint и редиректа с `/`). */
export function readLocaleFromPathOrStorage() {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  const withoutBase = getPathnameWithoutViteBase(window.location.pathname);
  const fromPath = getLocaleFromPathname(withoutBase);
  if (fromPath) return fromPath;
  return readStoredLocale();
}
