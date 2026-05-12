import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { tWithFallback } from '../i18n/tWithFallback.js';
import { getCaseStudyNeighbors } from '../data/projects.js';
import SeamlessProjectsLink from './SeamlessProjectsLink.jsx';

/** Короткая подпись в полоске навигации кейса (словарь `navShortTitle` или первый сегмент длинного title). */
function caseStudyStripShortLabel(t, slug, project) {
  if (!slug || !project) return '';
  const beforeDash = (project.title || slug).split(/[—–:]/)[0]?.trim() || slug;
  return tWithFallback(t, `projects.cards.${slug}.navShortTitle`, beforeDash);
}

function caseStudyStripFullTitle(t, slug, project) {
  if (!slug || !project) return '';
  return tWithFallback(t, `projects.cards.${slug}.title`, project.title);
}

/**
 * Шапка кейса (Figma 89-156 / стили `.nav-list--case-study`): предыдущий проект | название | следующий.
 * Вместо обычного «Главная / Проекты / О себе», где «Проекты» ошибочно подсвечивался на любой странице проекта.
 */
export default function CaseStudyHeaderNav({ project, menuOpen, onItemClick }) {
  const { t, localizedPath } = useI18n();
  const { prev, next } = getCaseStudyNeighbors(project.slug);
  const fullTitle = caseStudyStripFullTitle(t, project.slug, project);
  const centerLabel = caseStudyStripShortLabel(t, project.slug, project);
  const prevLabel = prev ? caseStudyStripShortLabel(t, prev.slug, prev) : t('header.nav.projects');
  const nextLabel = next ? caseStudyStripShortLabel(t, next.slug, next) : null;
  const prevFullTitle = prev ? caseStudyStripFullTitle(t, prev.slug, prev) : null;
  const nextFullTitle = next ? caseStudyStripFullTitle(t, next.slug, next) : null;

  const listClass = `${menuOpen ? 'nav-list nav-list--case-study open' : 'nav-list nav-list--case-study'}`.trim();

  const prevTo = prev ? localizedPath(`/project/${prev.slug}`) : localizedPath('/projects');
  const PrevLink = prev ? Link : SeamlessProjectsLink;

  return (
    <ul className={listClass} data-variant="CaseStudy" aria-label={t('header.caseStudyStripAria')}>
      <li>
        <PrevLink
          to={prevTo}
          className="nav-link nav-link--case-with-chevron"
          onClick={onItemClick}
          title={prevFullTitle || undefined}
          aria-label={prev ? `${t('header.caseStudyBack')}: ${prevFullTitle}` : prevLabel}
        >
          <span className="nav-link__case-chevron" aria-hidden>
            <span className="nav-link__chevron nav-link__chevron--left" />
          </span>
          <span className="blend-text">{prevLabel}</span>
        </PrevLink>
      </li>
      <li>
        <span
          className="nav-link nav-link--case-title active"
          aria-current="page"
          aria-label={fullTitle}
          title={fullTitle}
        >
          <span className="blend-text">{centerLabel}</span>
        </span>
      </li>
      <li>
        {next ? (
          <Link
            to={localizedPath(`/project/${next.slug}`)}
            className="nav-link nav-link--case-with-chevron nav-link--case-next"
            onClick={onItemClick}
            title={nextFullTitle || undefined}
            aria-label={`${t('header.caseStudyNext')}: ${nextFullTitle}`}
          >
            <span className="blend-text">{nextLabel}</span>
            <span className="nav-link__case-chevron" aria-hidden>
              <span className="nav-link__chevron nav-link__chevron--right" />
            </span>
          </Link>
        ) : (
          <span className="nav-link nav-link--case-with-chevron nav-link--case-next nav-link--case-placeholder" aria-hidden>
            <span className="blend-text">{'\u00a0'}</span>
          </span>
        )}
      </li>
    </ul>
  );
}
