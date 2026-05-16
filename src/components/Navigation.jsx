import { Link, useLocation } from 'react-router-dom';
import { stripLocaleFromPathname } from '../i18n/localePath.js';
import { useI18n } from '../i18n/I18nProvider.jsx';
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

/** Навигация: Frame с gap 120px (Figma). */
export function Navigation() {
  const { pathname } = useLocation();
  const { t, localizedPath } = useI18n();

  return (
    <ul className="nav-list" aria-label={t('header.navListAria')}>
      {NAV_ROUTE_KEYS.map(({ path, labelKey }) => {
        const label = t(labelKey);
        const active = itemIsActive(pathname, path);
        const to = localizedPath(path);
        const NavItem = path === '/projects' ? SeamlessProjectsLink : Link;
        return (
          <li key={path}>
            <NavItem to={to} className={`nav-link${active ? ' active' : ''}`}>
              <span>{label}</span>
            </NavItem>
          </li>
        );
      })}
    </ul>
  );
}
