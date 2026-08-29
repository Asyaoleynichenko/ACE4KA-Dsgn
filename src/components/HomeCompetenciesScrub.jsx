import { useCallback, useEffect, useRef, useState } from 'react';
import { COMPETENCIES_HEADING_ORDER } from '../data/competenciesHeadingOrder.js';
import { HOME_PROJECT_SLUGS, homeProjectsCatalog } from '../data/homeProjectsCatalog.js';
import { useScrollTriggerCompetenciesScrub } from '../hooks/useScrollTriggerCompetenciesScrub.js';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { tWithFallback } from '../i18n/tWithFallback.js';
import { prefersReducedMotion } from '../motion/motionSystem.js';
import { asArray } from '../utils/asArray.js';
import ProjectCard from './ProjectCard.jsx';

function chunkSlugsForLines(lineCount, homeSlugs) {
  if (!lineCount || !homeSlugs?.length) return [];
  const out = [];
  for (let i = 0; i < lineCount; i += 1) {
    const a = homeSlugs[(i * 2) % homeSlugs.length];
    const b = homeSlugs[(i * 2 + 1) % homeSlugs.length];
    out.push([a, b].filter(Boolean));
  }
  return out;
}

function lineIndexFromProgress(progress, count) {
  if (count <= 1) return 0;
  const p = Math.max(0, Math.min(0.9999, Number(progress) || 0));
  return Math.min(count - 1, Math.floor(p * count));
}

/**
 * Главная — превью проектов по категориям (Figma 592:38775).
 * Sticky + scrub: одна сцена, пока не пролистаны все строки и пары карточек.
 */
export default function HomeCompetenciesScrub({
  lines: linesProp,
  lineProjectSlugs,
  homeProjectSlugs = HOME_PROJECT_SLUGS,
  ariaLabel,
  children,
}) {
  const { t } = useI18n();
  const lines = asArray(linesProp);
  const slugRows =
    Array.isArray(lineProjectSlugs) && lineProjectSlugs.length === lines.length
      ? lineProjectSlugs
      : chunkSlugsForLines(lines.length, homeProjectSlugs);

  const [activeIndex, setActiveIndex] = useState(0);
  const [pinEnabled, setPinEnabled] = useState(() =>
    typeof window === 'undefined' ? false : !prefersReducedMotion(),
  );

  const runwayRef = useRef(null);
  const stickyRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setPinEnabled(!reduce.matches);
    sync();
    reduce.addEventListener('change', sync);
    return () => reduce.removeEventListener('change', sync);
  }, []);

  const resolveProject = useCallback(
    (slug) => homeProjectsCatalog.find((p) => p.slug === slug) || null,
    [],
  );

  const onScrub = useCallback(
    (progress) => {
      setActiveIndex(lineIndexFromProgress(progress, lines.length));
    },
    [lines.length],
  );

  useScrollTriggerCompetenciesScrub({
    enabled: pinEnabled && lines.length > 0,
    runwayRef,
    stickyRef,
    scrollTravelPx: 0,
    lineCount: lines.length,
    onScrub,
  });

  const activeProjects = (slugRows[activeIndex] ?? []).map(resolveProject).filter(Boolean);
  const rootClass = [
    'home-competencies-scrub',
    'home-competencies-scrub--static-block',
    pinEnabled ? 'home-competencies-scrub--pinned' : 'home-competencies-scrub--static',
    pinEnabled ? '' : 'home-competencies-scrub--reduced-motion',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="home-competencies-scrub__runway" ref={runwayRef}>
      <div className={`${rootClass} home-competencies-scrub__sticky`} ref={stickyRef}>
        <div className="home-competencies__panel">
          <div className="home-competencies__inner home-competencies__inner--scrub">
            <div className="home-competencies-scrub__content">
              <div className="home-competencies-scrub__stack" role="region" aria-label={ariaLabel}>
                <div className="home-competencies-scrub__stage">
                  <div
                    className="home-competencies-scrub__floats"
                    aria-hidden={activeProjects.length === 0}
                  >
                    {activeProjects.map((item, idx) => (
                      <div
                        key={`${activeIndex}-${item.slug}`}
                        className={`home-competencies-scrub__float${idx === 0 ? ' home-competencies-scrub__float--tl' : ' home-competencies-scrub__float--br'}`}
                      >
                        <div className="home-competencies-scrub__card-wrap">
                          <ProjectCard
                            slug={item.slug}
                            title={tWithFallback(t, `projects.cards.${item.slug}.title`, item.title)}
                            meta={tWithFallback(t, `projects.cards.${item.slug}.meta`, item.meta)}
                            desc={tWithFallback(t, `projects.cards.${item.slug}.desc`, item.desc)}
                            image={item.image}
                            isDemo={false}
                            variant="overlay"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="home-competencies-scrub__center">
                    <div className="home-competencies-scrub__lines">
                      {lines.map((line, i) => (
                        <div
                          key={line}
                          className={`home-competencies-scrub__line-wrap${i === activeIndex ? ' is-active' : ''}`}
                          data-heading={COMPETENCIES_HEADING_ORDER[i] ?? 3}
                        >
                          <p className="home-competencies__line home-competencies-scrub__line">{line}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
