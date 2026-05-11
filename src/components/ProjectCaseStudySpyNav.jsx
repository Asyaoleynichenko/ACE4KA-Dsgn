/** Оглавление кейса: подсветка активного раздела при скролле (spy scroll). */
export default function ProjectCaseStudySpyNav({ sections, activeId }) {
  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!sections?.length) return null;

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <nav className="project-spy" aria-label="Разделы кейса">
      <ol className="project-spy__list">
        {sections.map(({ id, label }) => (
          <li key={id} className="project-spy__item">
            <a
              href={`#${id}`}
              className={`project-spy__link${activeId === id ? ' project-spy__link--active' : ''}`}
              aria-current={activeId === id ? 'location' : undefined}
              title={label}
              onClick={(e) => {
                e.preventDefault();
                scrollToId(id);
              }}
            >
              <span className="project-spy__dot" aria-hidden="true" />
              <span className="project-spy__label">{label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
