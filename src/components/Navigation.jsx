import { Link, useLocation } from 'react-router-dom';
import { stripLocaleFromPathname } from '../i18n/localePath.js';
import { useI18n } from '../i18n/I18nProvider.jsx';
import SeamlessProjectsLink from './SeamlessProjectsLink.jsx';
import IconAssembleFromDots from './IconAssembleFromDots.jsx';
import { publicUrl } from '../utils/publicUrl.js';

/** Маршруты основной шапки (Figma 432:30376, свойство Default). */
export const NAV_ROUTE_KEYS = [
  { path: '/', labelKey: 'header.nav.home' },
  { path: '/projects', labelKey: 'header.nav.projects' },
  { path: '/about', labelKey: 'header.about' },
];

/** Декоративная звезда как в макете (433:31043 / nav-icon-430-29004.svg) — «Главная» и «О себе». */
const HEADER_SNOW_ICON = publicUrl('/images/icons/nav-icon-430-29004.svg');
const NAV_PROJECTS_ICON = publicUrl('/images/icons/projects.svg');

function routePillIcon(path) {
  if (path === '/projects') return { src: NAV_PROJECTS_ICON, variant: 'symbol' };
  return { src: HEADER_SNOW_ICON, variant: 'led' };
}

function itemIsActive(pathname, targetPath) {
  const base = stripLocaleFromPathname(pathname);
  if (targetPath === '/projects') {
    return base === '/projects' || base.startsWith('/project/');
  }
  return base === targetPath;
}

/** Навигация: Figma 432:30376 — Default (маркетинг) | Variant2 (кейс: Назад | заголовок | Следующий). */
export function Navigation({
  variant = 'routes',
  caseStudy = null,
  menuOpen,
  onItemClick,
  /** Для `variant="routes"`: показывать снежинку/иконку проектов в пилюлях (на главной /projects /about — выкл.). */
  showRouteIcons = true,
}) {
  const { pathname } = useLocation();
  const { t, localizedPath } = useI18n();
  const listClass =
    `${menuOpen ? 'nav-list open' : 'nav-list'}${variant === 'case-study' ? ' nav-list--case-study' : ''}`.trim();

  if (variant === 'case-study' && caseStudy) {
    const {
      currentShortTitle,
      currentFullTitle,
      prevTo,
      prevLabel,
      prevFullTitle,
      prevIsProject,
      nextTo,
      nextLabel,
      nextFullTitle,
    } = caseStudy;

    const prevLink = prevIsProject ? (
      <Link
        to={prevTo}
        className="nav-link nav-link--case-aux nav-link--case-with-chevron"
        onClick={onItemClick}
        aria-label={prevFullTitle}
      >
        <IconAssembleFromDots className="icon-assemble-dots--chevron" ringRadiusPx={11} dotCount={10} dotPx={2.5}>
          <span className="nav-link__chevron nav-link__chevron--left" aria-hidden />
        </IconAssembleFromDots>
        <span className="blend-text">{prevLabel}</span>
      </Link>
    ) : (
      <SeamlessProjectsLink
        to={prevTo}
        className="nav-link nav-link--case-aux nav-link--case-with-chevron"
        onClick={onItemClick}
        aria-label={prevFullTitle}
      >
        <IconAssembleFromDots className="icon-assemble-dots--chevron" ringRadiusPx={11} dotCount={10} dotPx={2.5}>
          <span className="nav-link__chevron nav-link__chevron--left" aria-hidden />
        </IconAssembleFromDots>
        <span className="blend-text">{prevLabel}</span>
      </SeamlessProjectsLink>
    );

    return (
      <ul className={listClass} data-node-id="433:30466" data-variant="Variant2" aria-label={t('projectDetail.caseStudyNavAria')}>
        <li>{prevLink}</li>
        <li>
          <IconAssembleFromDots className="icon-assemble-dots--case-title" ringRadiusPx={38} dotCount={22} dotPx={2.5}>
            <span
              className="nav-link nav-link--case-title active blend-text"
              aria-current="page"
              title={currentFullTitle}
            >
              {currentShortTitle}
            </span>
          </IconAssembleFromDots>
        </li>
        {nextTo && nextLabel ? (
          <li>
            <Link
              to={nextTo}
              className="nav-link nav-link--case-aux nav-link--case-next nav-link--case-with-chevron"
              onClick={onItemClick}
              aria-label={nextFullTitle ?? nextLabel}
            >
              <span className="blend-text">{nextLabel}</span>
              <IconAssembleFromDots className="icon-assemble-dots--chevron" ringRadiusPx={11} dotCount={10} dotPx={2.5}>
                <span className="nav-link__chevron nav-link__chevron--right" aria-hidden />
              </IconAssembleFromDots>
            </Link>
          </li>
        ) : null}
      </ul>
    );
  }

  return (
    <ul
      className={listClass}
      data-node-id="433:30466"
      data-variant="Default"
      aria-label={t('header.navListAria')}
    >
      {NAV_ROUTE_KEYS.map(({ path, labelKey }) => {
        const label = t(labelKey);
        const active = itemIsActive(pathname, path);
        const to = localizedPath(path);
        const NavItem = path === '/projects' ? SeamlessProjectsLink : Link;
        const pill = routePillIcon(path);
        return (
          <li key={path}>
            <NavItem to={to} className={`nav-link${active ? ' active' : ''}`} onClick={onItemClick}>
              {showRouteIcons ? (
                <IconAssembleFromDots
                  className={`icon-assemble-dots--nav${pill.variant === 'led' ? ' icon-assemble-dots--nav-led' : ''}`}
                  ringRadiusPx={pill.variant === 'led' ? 26 : 22}
                  dotCount={pill.variant === 'led' ? 20 : 14}
                  dotPx={2.5}
                >
                  <img
                    className={`nav-link__pill-icon nav-link__pill-icon--${pill.variant}`}
                    src={pill.src}
                    alt=""
                    aria-hidden
                    width={22}
                    height={22}
                    decoding="async"
                  />
                </IconAssembleFromDots>
              ) : null}
              <span className="blend-text">{label}</span>
            </NavItem>
          </li>
        );
      })}
    </ul>
  );
}
