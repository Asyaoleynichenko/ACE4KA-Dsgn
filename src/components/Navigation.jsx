import { Link, useLocation } from 'react-router-dom';
import { stripLocaleFromPathname } from '../i18n/localePath.js';
import { useI18n } from '../i18n/I18nProvider.jsx';
import SeamlessProjectsLink from './SeamlessProjectsLink.jsx';
import { publicUrl } from '../utils/publicUrl.js';

/** Маршруты основной шапки (Figma 432:30376, свойство Default). */
export const NAV_ROUTE_KEYS = [
  { path: '/', labelKey: 'header.nav.home' },
  { path: '/projects', labelKey: 'header.nav.projects' },
  { path: '/about', labelKey: 'header.about' },
];

/** Декоративная звезда как в макете (433:31043 / совпадает с nav-icon-430-29004.svg). */
const HEADER_SNOW_ICON = publicUrl('/images/icons/nav-icon-430-29004.svg');

function itemIsActive(pathname, targetPath) {
  const base = stripLocaleFromPathname(pathname);
  if (targetPath === '/projects') {
    return base === '/projects' || base.startsWith('/project/');
  }
  return base === targetPath;
}

/** Навигация: Figma 432:30376 — Default (маркетинг) | Variant2 (кейс: Назад | заголовок | Следующий). */
export function Navigation({ variant = 'routes', caseStudy = null, menuOpen, onItemClick }) {
  const { pathname } = useLocation();
  const { t, localizedPath } = useI18n();
  const listClass =
    `${menuOpen ? 'nav-list open' : 'nav-list'}${variant === 'case-study' ? ' nav-list--case-study' : ''}`.trim();

  if (variant === 'case-study' && caseStudy) {
    const { displayTitle, neighbors } = caseStudy;
    const projectsListingTo = localizedPath('/projects');
    const backTo = neighbors?.prev ? localizedPath(`/project/${neighbors.prev.slug}`) : projectsListingTo;

    const backLink = neighbors?.prev ? (
      <Link to={backTo} className="nav-link nav-link--case-aux" onClick={onItemClick}>
        <img className="nav-link__snow" src={HEADER_SNOW_ICON} alt="" aria-hidden width={18} height={18} decoding="async" />
        <span className="blend-text">{t('header.caseStudyBack')}</span>
      </Link>
    ) : (
      <SeamlessProjectsLink to={backTo} className="nav-link nav-link--case-aux" onClick={onItemClick}>
        <img className="nav-link__snow" src={HEADER_SNOW_ICON} alt="" aria-hidden width={18} height={18} decoding="async" />
        <span className="blend-text">{t('header.caseStudyBack')}</span>
      </SeamlessProjectsLink>
    );

    return (
      <ul className={listClass} data-node-id="433:30466" data-variant="Variant2" aria-label={t('projectDetail.caseStudyNavAria')}>
        <li>{backLink}</li>
        <li>
          <span className="nav-link nav-link--case-title active blend-text" aria-current="page">
            {displayTitle}
          </span>
        </li>
        {neighbors?.next ? (
          <li>
            <Link
              to={localizedPath(`/project/${neighbors.next.slug}`)}
              className="nav-link nav-link--case-aux nav-link--case-next"
              onClick={onItemClick}
            >
              <span className="blend-text">{t('header.caseStudyNext')}</span>
              <img
                className="nav-link__snow nav-link__snow--flip"
                src={HEADER_SNOW_ICON}
                alt=""
                aria-hidden
                width={18}
                height={18}
                decoding="async"
              />
            </Link>
          </li>
        ) : null}
      </ul>
    );
  }

  return (
    <ul
      className={listClass}
      data-node-id="I433:30466"
      data-variant="Default"
      aria-label={t('header.navListAria')}
    >
      {NAV_ROUTE_KEYS.map(({ path, labelKey }) => {
        const label = t(labelKey);
        const active = itemIsActive(pathname, path);
        const to = localizedPath(path);
        const NavItem = path === '/projects' ? SeamlessProjectsLink : Link;
        return (
          <li key={path}>
            <NavItem to={to} className={`nav-link${active ? ' active' : ''}`} onClick={onItemClick}>
              <span className="blend-text">{label}</span>
            </NavItem>
          </li>
        );
      })}
    </ul>
  );
}
