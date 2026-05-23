import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import { Navigation } from './Navigation';

/**
 * Шапка — Figma 573:18422: имя | навигация | язык.
 * Всегда видна сверху (fixed), без hide-on-scroll.
 */
export default function Header() {
  const { localizedPath, t } = useI18n();

  return (
    <header
      className="header"
      data-name="Header"
      data-node-id="573-18422"
      data-figma-node="573-18422"
    >
      <nav className="nav" aria-label={t('header.navListAria')}>
        <Link to={localizedPath('/')} className="logo" data-node-id="573-20950">
          <span className="text-condensed--single-line">{t('common.brandName')}</span>
        </Link>
        <Navigation />
        <span className="lang-switch" data-node-id="573-20952">
          <LanguageSwitcher />
        </span>
      </nav>
    </header>
  );
}
