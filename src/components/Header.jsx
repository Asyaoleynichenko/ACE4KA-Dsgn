import { Link, useLocation, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { stripLocaleFromPathname } from '../i18n/localePath.js';
import { tWithFallback } from '../i18n/tWithFallback.js';
import { getCaseStudyNeighbors, projects } from '../data/projects.js';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import { Navigation } from './Navigation';

/** Шапка с двумя состояниями — Figma 432:30376 (Default / Variant2 для кейсов). */
export default function Header({ mode = 'default' }) {
  const location = useLocation();
  const { slug } = useParams();
  const { localizedPath, t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const basePath = stripLocaleFromPathname(location.pathname);
  const project =
    basePath.startsWith('/project/') && slug ? projects.find((p) => p.slug === slug) : null;
  const isCaseStudyHeader = project?.layout === 'case-study';

  const caseStudyNav =
    isCaseStudyHeader && slug
      ? {
          displayTitle: tWithFallback(t, `projects.cards.${slug}.title`, project.title),
          neighbors: getCaseStudyNeighbors(slug),
        }
      : null;

  const headerClass =
    mode === 'in-hero' ? 'header header--in-hero' : 'header';

  return (
    <header className={headerClass} data-node-id="432:30376" data-name="Header">
      <nav className="nav">
        <Link to={localizedPath('/')} className="logo" data-node-id="432:30377">
          <span className="blend-text">{t('common.brandName')}</span>
        </Link>
        <div className="nav__trail">
          <span className="lang-switch" data-node-id="432:30380">
            <LanguageSwitcher />
          </span>
          <Navigation
            variant={isCaseStudyHeader ? 'case-study' : 'routes'}
            caseStudy={caseStudyNav}
            menuOpen={menuOpen}
            onItemClick={closeMenu}
          />
        </div>
        <button
          type="button"
          className={`nav-toggle${menuOpen ? ' active' : ''}`}
          aria-label={t('header.menuAria')}
          aria-expanded={menuOpen}
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
