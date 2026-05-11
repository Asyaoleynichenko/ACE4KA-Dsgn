import { useI18n } from '../i18n/I18nProvider.jsx';

/**
 * Переключатель EN / RU (стили в css/style.css — без Tailwind, чтобы не зависеть от purge).
 */
export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <span className="lang-switch__toggle-row">
      <button
        type="button"
        className={`lang-switch__btn${locale === 'en' ? ' is-active' : ''}`}
        aria-pressed={locale === 'en'}
        aria-label="English"
        onClick={() => setLocale('en')}
      >
        <span className="blend-text">EN</span>
      </button>
      <span className="lang-switch__split" aria-hidden>
        /
      </span>
      <button
        type="button"
        className={`lang-switch__btn${locale === 'ru' ? ' is-active' : ''}`}
        aria-pressed={locale === 'ru'}
        aria-label="Русский"
        onClick={() => setLocale('ru')}
      >
        <span className="blend-text">RU</span>
      </button>
    </span>
  );
}
