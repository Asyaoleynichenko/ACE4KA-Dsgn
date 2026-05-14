import { createPortal } from 'react-dom';
import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider.jsx';

/** Сидробар-кейса: вертикальная колонка точек на правом краю.
 *  Активная точка пульсирует var(--accent); остальные приглушены.
 *  При hover на точку — выезжает подпись секции.
 */
export default function ProjectCaseStudySpyNav({ sections, activeId }) {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const items = useMemo(() => sections?.filter((s) => s.id) ?? [], [sections]);
  if (!items.length) return null;

  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const onClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  };

  const nav = (
    <nav className="cs-dotnav" aria-label={t('projectDetail.spyNavAria')}>
      <ol className="cs-dotnav__list">
        {items.map((entry) => {
          const isActive = activeId === entry.id;
          const label = entry.keyword
            ? entry.caption
              ? `${entry.keyword} — ${entry.caption}`
              : entry.keyword
            : entry.label;
          return (
            <li key={entry.id} className="cs-dotnav__item">
              <a
                href={`#${entry.id}`}
                className={`cs-dotnav__link${isActive ? ' is-active' : ''}`}
                aria-current={isActive ? 'location' : undefined}
                onClick={(e) => onClick(e, entry.id)}
              >
                <span className="cs-dotnav__dot" aria-hidden="true" />
                <span className="cs-dotnav__label">{label}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );

  if (!mounted) return null;
  return createPortal(nav, document.body);
}
