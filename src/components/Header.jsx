import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useI18n } from '../i18n/I18nProvider.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import { Navigation } from './Navigation';

export default function Header({ mode = 'default' }) {
  const { localizedPath, t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const headerClass =
    mode === 'in-hero' ? 'header header--in-hero' : 'header';

  return (
    <header
      className={headerClass}
      data-node-id="300:104227"
      data-name="Header"
    >
      <nav className="nav">
        <Link to={localizedPath('/')} className="logo" data-node-id="300:107467-logo">
          <span className="blend-text">{t('common.brandName')}</span>
        </Link>
        <span className="lang-switch" data-node-id="300:107467-lang">
          <LanguageSwitcher />
        </span>
        <Navigation menuOpen={menuOpen} onItemClick={closeMenu} />
        <button
          type="button"
          className={`nav-toggle${menuOpen ? ' active' : ''}`}
          aria-label={t('header.menuAria')}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>
    </header>
  );
}
