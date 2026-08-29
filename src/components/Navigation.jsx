import { useLocation } from 'react-router-dom';
import { stripLocaleFromPathname } from '../i18n/localePath.js';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { tWithFallback } from '../i18n/tWithFallback.js';
import { HOME_PROJECT_SLUGS, homeProjectsCatalog } from '../data/homeProjectsCatalog.js';
import SeamlessProjectsLink from './SeamlessProjectsLink.jsx';

/** Маршруты основной шапки (Figma: Проекты | Главная | О себе). */
export const NAV_ROUTE_KEYS = [
  { path: '/projects', labelKey: 'header.nav.projects' },
  { path: '/', labelKey: 'header.nav.home' },
  { path: '/about', labelKey: 'header.about' },
];

function itemIsActive(pathname, targetPath) {
  const base = stripLocaleFromPathname(pathname);
  if (targetPath === '/projects') {
    return base === '/projects' || base.startsWith('/project/');
  }
  return base === targetPath;
}

/** Извлекаем slug текущего проекта из pathname (вне React Router context хука useParams не сработает). */
function projectSlugFromPathname(pathname) {
  const base = stripLocaleFromPathname(pathname);
  const m = base.match(/^\/project\/([^/]+)/);
  return m ? m[1] : null;
}

function projectTitleBySlug(slug, t) {
  const entry = homeProjectsCatalog.find((p) => p.slug === slug);
  const fallback = entry?.title ?? slug;
  return tWithFallback(t, `projects.cards.${slug}.navShortTitle`, tWithFallback(t, `projects.cards.${slug}.title`, fallback));
}

/** Навигация: на странице проекта — «Ко всем проектам | <текущий> | <следующий>», иначе стандартные пункты. */
export function Navigation({ menuOpen = false, onNavigate }) {
  const { pathname } = useLocation();
  const { t, localizedPath } = useI18n();

  const currentSlug = projectSlugFromPathname(pathname);
  const isProjectsListing = stripLocaleFromPathname(pathname) === '/projects';
  /* Figma 1:400 на «Все проекты»: Главная | Проекты | О себе */
  const routeKeys = isProjectsListing
    ? [
        { path: '/', labelKey: 'header.nav.home' },
        { path: '/projects', labelKey: 'header.nav.projects' },
        { path: '/about', labelKey: 'header.about' },
      ]
    : NAV_ROUTE_KEYS;

  if (currentSlug) {
    const idx = HOME_PROJECT_SLUGS.indexOf(currentSlug);
    const nextSlug = idx >= 0 ? HOME_PROJECT_SLUGS[(idx + 1) % HOME_PROJECT_SLUGS.length] : HOME_PROJECT_SLUGS[0];
    const currentTitle = projectTitleBySlug(currentSlug, t);
    const nextTitle = projectTitleBySlug(nextSlug, t);
    const allProjectsLabel = tWithFallback(t, 'header.nav.allProjects', 'Ко всем проектам');

    return (
      <ul
        id="site-nav-list"
        className={`nav-list nav-list--case-study${menuOpen ? ' open' : ''}`}
        data-node-id="573-19068"
      >
        <li>
          <SeamlessProjectsLink to={localizedPath('/projects')} className="nav-link nav-link--case-all" onClick={onNavigate}>
            <span className="text-condensed text-condensed--single-line">{allProjectsLabel}</span>
          </SeamlessProjectsLink>
        </li>
        <li>
          <SeamlessProjectsLink
            to={localizedPath(`/project/${currentSlug}`)}
            className="nav-link nav-link--case-title active"
            aria-current="page"
            onClick={onNavigate}
          >
            <span className="text-condensed text-condensed--single-line">{currentTitle}</span>
          </SeamlessProjectsLink>
        </li>
        <li>
          <SeamlessProjectsLink to={localizedPath(`/project/${nextSlug}`)} className="nav-link nav-link--case-next" onClick={onNavigate}>
            <span className="text-condensed text-condensed--single-line">{nextTitle}</span>
          </SeamlessProjectsLink>
        </li>
      </ul>
    );
  }

  return (
    <ul
      id="site-nav-list"
      className={`nav-list${menuOpen ? ' open' : ''}`}
      data-node-id="573-19068"
    >
      {routeKeys.map(({ path, labelKey }) => {
        const label = t(labelKey);
        const active = itemIsActive(pathname, path);
        const to = localizedPath(path);
        return (
          <li key={path}>
            <SeamlessProjectsLink
              to={to}
              className={`nav-link${active ? ' active' : ''}`}
              data-node-id={path === '/projects' ? '573-20954' : path === '/' ? '573-20958' : '573-20956'}
              onClick={onNavigate}
            >
              <span className="text-condensed text-condensed--single-line">{label}</span>
            </SeamlessProjectsLink>
          </li>
        );
      })}
    </ul>
  );
}
