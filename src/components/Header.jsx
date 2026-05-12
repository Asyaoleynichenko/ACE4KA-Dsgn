import { Link, useLocation, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { stripLocaleFromPathname } from '../i18n/localePath.js';
import { tWithFallback } from '../i18n/tWithFallback.js';
import { getCaseStudyNeighbors, projects } from '../data/projects.js';
import { projectCaseStudyNavLabel } from '../utils/projectCaseStudyNavLabel.js';
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
      ? (() => {
          const neighbors = getCaseStudyNeighbors(slug);
          const projectsListingTo = localizedPath('/projects');
          const prevTo = neighbors.prev
            ? localizedPath(`/project/${neighbors.prev.slug}`)
            : projectsListingTo;
          const nextTo = neighbors.next ? localizedPath(`/project/${neighbors.next.slug}`) : null;
          return {
            currentShortTitle: projectCaseStudyNavLabel(t, slug),
            currentFullTitle: tWithFallback(t, `projects.cards.${slug}.title`, project.title),
            prevTo,
            prevLabel: neighbors.prev
              ? projectCaseStudyNavLabel(t, neighbors.prev.slug)
              : t('header.nav.projects'),
            prevFullTitle: neighbors.prev
              ? tWithFallback(t, `projects.cards.${neighbors.prev.slug}.title`, neighbors.prev.title)
              : t('header.nav.projects'),
            prevIsProject: !!neighbors.prev,
            nextTo,
            nextLabel: neighbors.next ? projectCaseStudyNavLabel(t, neighbors.next.slug) : null,
            nextFullTitle: neighbors.next
              ? tWithFallback(t, `projects.cards.${neighbors.next.slug}.title`, neighbors.next.title)
              : null,
          };
        })()
      : null;

  const headerClass =
    mode === 'in-hero' ? 'header header--in-hero' : 'header';

  return (
    <header className={headerClass} data-node-id="432:30376" data-name="Header">
      <nav className="nav">
        <Link to={localizedPath('/')} className="logo" data-node-id="432:30377">
          <span className="blend-text">{t('common.brandName')}</span>
        </Link>
        <Navigation
          variant={isCaseStudyHeader ? 'case-study' : 'routes'}
          caseStudy={caseStudyNav}
          menuOpen={menuOpen}
          onItemClick={closeMenu}
          showRouteIcons={mode !== 'in-hero'}
        />
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
          <span />
          <span />
          <span />
        </button>
      </nav>
    </header>
  );
}
