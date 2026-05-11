import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import en from '../dictionaries/en.json';
import ruBase from '../dictionaries/ru.json';
import { mergeProjectCardsIntoRu } from './mergeProjectCardsIntoRu.js';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from './constants.js';
import {
  getLocaleFromPathname,
  readLocaleFromPathOrStorage,
  stripLocaleFromPathname,
  withLocalePrefix,
  writeStoredLocale,
} from './localePath.js';
import { resolveMessage } from './resolveMessage.js';

const ru = mergeProjectCardsIntoRu(ruBase);
const dictionaries = { ru, en };

function normalizeLocale(value) {
  const v = typeof value === 'string' ? value.trim().toLowerCase() : '';
  return SUPPORTED_LOCALES.includes(v) ? v : DEFAULT_LOCALE;
}

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [locale, setLocaleState] = useState(readLocaleFromPathOrStorage);

  useEffect(() => {
    const fromPath = getLocaleFromPathname(location.pathname);
    if (!fromPath) return;
    setLocaleState((prev) => {
      if (prev === fromPath) return prev;
      writeStoredLocale(fromPath);
      return fromPath;
    });
  }, [location.pathname]);

  const setLocale = useCallback(
    (next) => {
      const normalized = normalizeLocale(next);
      const stripped = stripLocaleFromPathname(location.pathname);
      const nextPath =
        withLocalePrefix(normalized, stripped) + location.search + location.hash;
      navigate(nextPath, { replace: true });
      setLocaleState(normalized);
      writeStoredLocale(normalized);
    },
    [navigate, location.pathname, location.search, location.hash],
  );

  useEffect(() => {
    document.documentElement.lang = locale === 'en' ? 'en' : 'ru';
  }, [locale]);

  const localizedPath = useCallback(
    (appPath) => withLocalePrefix(locale, appPath),
    [locale],
  );

  const t = useCallback(
    (key, vars) => {
      const dict = dictionaries[locale];
      const raw = resolveMessage(dict, key);
      if (typeof raw !== 'string') return key;
      if (!vars) return raw;
      return raw.replace(/\{\{(\w+)\}\}/g, (_, name) =>
        Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : '',
      );
    },
    [locale],
  );

  const messages = useMemo(() => dictionaries[locale], [locale]);

  const value = useMemo(
    () => ({ locale, setLocale, t, localizedPath, messages }),
    [locale, setLocale, t, localizedPath, messages],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return ctx;
}
