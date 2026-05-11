import { useI18n } from '../i18n/I18nProvider.jsx';

/** Оглавление кейса: подсветка активного раздела при скролле (spy scroll). */
export default function ProjectCaseStudySpyNav({ sections, activeId }) {
  const { t } = useI18n();
  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!sections?.length) return null;

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <nav className="project-spy" aria-label={t('projectDetail.spyNavAria')}>
      <ol className="project-spy__list">
        {sections.map((entry, index) => {
          if (entry.chapterTitle) {
            return (
              <li key={`spy-ch-${index}`} className="project-spy__chapter-row">
                <span className="project-spy__chapter">{entry.chapterTitle}</span>
              </li>
            );
          }

          const { id, label, keyword, caption } = entry;
          const isRich = Boolean(keyword && caption);
          const titleAttr = isRich ? `${keyword} — ${caption}` : label;
          const labelNode = isRich ? (
            <span className="project-spy__label project-spy__label--rich">
              <span className="project-spy__keyword">{keyword}</span>
              <span className="project-spy__emdash"> — </span>
              <span className="project-spy__caption">{caption}</span>
            </span>
          ) : (
            <span className="project-spy__label">{label}</span>
          );

          return (
            <li key={id} className="project-spy__item">
              <a
                href={`#${id}`}
                className={`project-spy__link${activeId === id ? ' project-spy__link--active' : ''}`}
                aria-current={activeId === id ? 'location' : undefined}
                title={titleAttr}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId(id);
                }}
              >
                <span className="project-spy__dot" aria-hidden="true" />
                {labelNode}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
