import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { stripLocaleFromPathname } from '../i18n/localePath.js';
import { getProjectBySlug } from '../data/projects.js';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import { Navigation } from './Navigation';
import CaseStudyHeaderNav from './CaseStudyHeaderNav.jsx';
import DotIcon from './DotIcon.jsx';

/** Шапка — Figma 432:30376 (единая строка: логотип | навигация | язык | бургер). */
export default function Header() {
  const location = useLocation();
  const { localizedPath, t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const basePath = stripLocaleFromPathname(location.pathname);

  const projectSlugMatch = basePath.match(/^\/project\/([^/]+)\/?$/);
  const projectForHeader = projectSlugMatch ? getProjectBySlug(projectSlugMatch[1]) : null;
  const useCaseStudyStrip = projectForHeader?.layout === 'case-study';

  /** Главная, список проектов, «О себе» — только подписи в пилюлях, без иконок (как in-hero). */
  const showRouteIcons =
    basePath !== '/' && basePath !== '/projects' && basePath !== '/about';

  return (
    <header className="header" data-node-id="432:30376" data-name="Header">
      {menuOpen ? (
        <button
          type="button"
          className="nav-scrim"
          aria-label={t('header.closeMenu')}
          onClick={closeMenu}
        />
      ) : null}
      <nav className="nav">
        <Link to={localizedPath('/')} className="logo" data-node-id="432:30377">
          <span className="blend-text">{t('common.brandName')}</span>
        </Link>
        {useCaseStudyStrip && projectForHeader ? (
          <CaseStudyHeaderNav project={projectForHeader} menuOpen={menuOpen} onItemClick={closeMenu} />
        ) : (
          <Navigation menuOpen={menuOpen} onItemClick={closeMenu} showRouteIcons={showRouteIcons} />
        )}
        <span className="lang-switch" data-node-id="432:30380">
          <LanguageSwitcher />
        </span>
        <button
          type="button"
          className={`nav-toggle${menuOpen ? ' active' : ''}`}
          aria-label={t('header.menuAria')}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <DotIcon name={menuOpen ? 'dot-close' : 'dot-burger'} size={22} animated={false} />
        </button>
      </nav>
    </header>
  );
}
