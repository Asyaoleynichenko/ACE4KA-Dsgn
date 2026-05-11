import { Link, useLocation } from 'react-router-dom';
import { stripLocaleFromPathname } from '../i18n/localePath.js';
import { useI18n } from '../i18n/I18nProvider.jsx';
import SeamlessProjectsLink from './SeamlessProjectsLink.jsx';

export const NAV_ROUTE_KEYS = [
  { path: '/', labelKey: 'header.nav.home' },
  { path: '/projects', labelKey: 'header.nav.projects' },
  { path: '/about', labelKey: 'header.about' },
];

function itemIsActive(pathname, targetPath) {
  const base = stripLocaleFromPathname(pathname);
  if (targetPath === '/projects') {
    return base === '/projects' || base.startsWith('/project/');
  }
  return base === targetPath;
}

/** Навигация: пилюля 1:230 / 300:107467 (стекло + активная капсула). */
export function Navigation({ menuOpen, onItemClick }) {
  const { pathname } = useLocation();
  const { t, localizedPath } = useI18n();

  return (
    <ul
      className={`nav-list${menuOpen ? ' open' : ''}`}
      data-node-id="I300:107467;10:1530"
      aria-label="Основное меню"
    >
      {NAV_ROUTE_KEYS.map(({ path, labelKey }) => {
        const label = t(labelKey);
        const active = itemIsActive(pathname, path);
        const to = localizedPath(path);
        const NavItem = path === '/projects' ? SeamlessProjectsLink : Link;
        return (
          <li key={path}>
            <NavItem
              to={to}
              className={`nav-link${active ? ' active' : ''}`}
              onClick={onItemClick}
            >
              <span className="blend-text">{label}</span>
            </NavItem>
          </li>
        );
      })}
    </ul>
  );
}
