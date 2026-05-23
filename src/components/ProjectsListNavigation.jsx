import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { tWithFallback } from '../i18n/tWithFallback.js';
import { publicUrl } from '../utils/publicUrl.js';
import { projects } from '../data/projects';
import { getScrollY } from '../utils/scrollRoot.js';

/**
 * Side-panel со списком других проектов; виден только когда пользователь докрутил
 * страницу кейса до последнего экрана (последние 100vh документа).
 */
export default function ProjectsListNavigation({ currentSlug }) {
  const { t, localizedPath } = useI18n();
  const items = projects.filter((p) => p.slug && p.slug !== currentSlug && p.image);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const check = () => {
      const y = getScrollY();
      const docH = document.documentElement.scrollHeight;
      const vh = window.innerHeight || 1;
      /* Видим, когда низ viewport приблизился к низу документа на расстояние ≤ 1.0 viewport. */
      const fromBottom = docH - (y + vh);
      setVisible(fromBottom <= vh);
    };
    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check, { passive: true });
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, []);

  if (!items.length) return null;

  return (
    <section
      className={`projects-list-nav${visible ? ' is-visible' : ''}`}
      aria-label={tWithFallback(t, 'projectDetail.otherProjectsAria', 'Другие проекты')}
      aria-hidden={!visible}
    >
      <h3 className="projects-list-nav__heading">
        <span className="text-condensed">
          {tWithFallback(t, 'projectDetail.otherProjectsHeading', 'Другие проекты')}
        </span>
      </h3>
      <ul className="projects-list-nav__list">
        {items.map((project) => {
          const title = tWithFallback(t, `projects.cards.${project.slug}.title`, project.title);
          return (
            <li key={project.slug} className="projects-list-nav__item">
              <Link
                to={localizedPath(`/project/${project.slug}`)}
                className="projects-list-nav__row"
                style={{ backgroundImage: `url(${publicUrl(project.image)})` }}
              >
                <span className="projects-list-nav__row-overlay" aria-hidden="true" />
                <span className="projects-list-nav__title">{title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
