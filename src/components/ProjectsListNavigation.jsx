import { useEffect, useState } from 'react';
import SmartLink from './SeamlessProjectsLink.jsx';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { tWithFallback } from '../i18n/tWithFallback.js';
import { publicUrl } from '../utils/publicUrl.js';
import { projects } from '../data/projects';
import { bindScrollResize, getScrollY } from '../utils/scrollRoot.js';
import { useLenisInstance } from '../context/LenisProvider.jsx';

/**
 * Side-panel со списком других проектов; виден только когда пользователь докрутил
 * страницу кейса до последнего экрана (последние 100vh документа).
 */
const NAV_EDGE_GAP_PX = 16;

export default function ProjectsListNavigation({ currentSlug }) {
  const { t, localizedPath } = useI18n();
  const { lenis } = useLenisInstance();
  const items = projects.filter((p) => p.slug && p.slug !== currentSlug && p.image);
  const [visible, setVisible] = useState(false);
  const [bottomPx, setBottomPx] = useState(NAV_EDGE_GAP_PX);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const check = () => {
      const y = getScrollY();
      const docH = document.documentElement.scrollHeight;
      const vh = window.innerHeight || 1;
      /* Видим, когда низ viewport приблизился к низу документа на расстояние ≤ 1.0 viewport. */
      const fromBottom = docH - (y + vh);
      setVisible(fromBottom <= vh);

      const footer = document.querySelector('.site-footer');
      if (!footer) {
        setBottomPx(NAV_EDGE_GAP_PX);
        return;
      }
      const footerTop = footer.getBoundingClientRect().top;
      if (footerTop < vh) {
        setBottomPx(Math.max(NAV_EDGE_GAP_PX, Math.round(vh - footerTop + NAV_EDGE_GAP_PX)));
      } else {
        setBottomPx(NAV_EDGE_GAP_PX);
      }
    };
    return bindScrollResize(check, { lenis });
  }, [lenis]);

  if (!items.length) return null;

  return (
    <section
      className={`projects-list-nav${visible ? ' is-visible' : ''}`}
      style={{ '--projects-list-nav-bottom': `${bottomPx}px` }}
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
              <SmartLink
                to={localizedPath(`/project/${project.slug}`)}
                className="projects-list-nav__row"
                style={{ backgroundImage: `url(${publicUrl(project.image)})` }}
              >
                <span className="projects-list-nav__row-overlay" aria-hidden="true" />
                <span className="projects-list-nav__title">{title}</span>
              </SmartLink>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
