import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import { Navigation } from './Navigation';

/** Шапка — Figma: имя | навигация | язык, mix-blend-mode: difference. */
export default function Header() {
  const { localizedPath, t } = useI18n();

  return (
    <header className="header" data-name="Header">
      <nav className="nav">
        <Link to={localizedPath('/')} className="logo">
          <span>{t('common.brandName')}</span>
        </Link>
        <Navigation />
        <span className="lang-switch">
          <LanguageSwitcher />
        </span>
      </nav>
    </header>
  );
}
