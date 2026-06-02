import { useCallback, useEffect, useRef, useState } from 'react';
import { useScrollTriggerCompetenciesScrub } from '../hooks/useScrollTriggerCompetenciesScrub.js';
import { COMPETENCIES_HEADING_ORDER } from '../data/competenciesHeadingOrder.js';
import { HOME_PROJECT_SLUGS, homeProjectsCatalog } from '../data/homeProjectsCatalog.js';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { tWithFallback } from '../i18n/tWithFallback.js';
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

/** Прогресс scrub t∈[0,1] → активная строка + «резина» (scaleX/scaleY инверсны по чётности). */
function activeLineStretchFromScroll(n, t) {
  if (n < 1) return { idx: 0, scaleX: 1, scaleY: 1 };
  const clampedT = Math.min(1, Math.max(0, t));
  const segment = 1 / n;
  const idx = Math.min(n - 1, Math.floor(clampedT * n));
  const localT = segment > 0 ? Math.min(1, Math.max(0, (clampedT - idx * segment) / segment)) : 0;
  const wave = Math.sin(Math.PI * localT);
  const stretchX = idx % 2 === 0;
  return {
    idx,
    scaleX: stretchX ? 1 + 0.09 * wave : 1 - 0.065 * wave,
    scaleY: stretchX ? 1 - 0.065 * wave : 1 + 0.09 * wave,
  };
}

/**
 * Главная — блок компетенций (Figma 592:38775 / 592:38776): стопка из пяти строк,
 * плавающие карточки TL/BR; при скролле активная строка растягивается, карточки меняются.
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
  const runwayRef = useRef(null);
  const stickyRef = useRef(null);
  const stageRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  const n = lines.length;
  const slugRows =
    Array.isArray(lineProjectSlugs) && lineProjectSlugs.length === n
      ? lineProjectSlugs
      : chunkSlugsForLines(n, homeProjectSlugs);

  const resolveProject = useCallback(
    (slug) => homeProjectsCatalog.find((p) => p.slug === slug) || null,
    [],
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const onScrub = useCallback(
    (progress) => {
      if (n < 1) return;
      const { idx, scaleX, scaleY } = activeLineStretchFromScroll(n, progress);
      setActiveIdx((prev) => (prev === idx ? prev : idx));
      const stage = stageRef.current;
      if (stage) {
        stage.style.setProperty('--comp-active-scale-x', scaleX.toFixed(4));
        stage.style.setProperty('--comp-active-scale-y', scaleY.toFixed(4));
      }
    },
    [n],
  );

  useScrollTriggerCompetenciesScrub({
    enabled: !reducedMotion && n > 0,
    runwayRef,
    stickyRef,
    lineCount: n,
    onScrub,
  });

  const activeSlugs = slugRows[activeIdx] ?? [];
  const activeProjects = activeSlugs.map(resolveProject).filter(Boolean);
  const leftProject = activeProjects[0] ?? null;
  const rightProject = activeProjects[1] ?? null;

  const projectCard = (item) =>
    item ? (
      <div key={item.slug} className="home-competencies-scrub__card-wrap">
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
    ) : null;

  const floatCards = (
    <div className="home-competencies-scrub__floats" aria-hidden={!leftProject && !rightProject}>
      <div key={`tl-${activeIdx}`} className="home-competencies-scrub__float home-competencies-scrub__float--tl">
        {leftProject ? projectCard(leftProject) : null}
      </div>
      <div key={`br-${activeIdx}`} className="home-competencies-scrub__float home-competencies-scrub__float--br">
        {rightProject ? projectCard(rightProject) : null}
      </div>
    </div>
  );

  const linesStack = (activeIndex) => (
    <div className="home-competencies-scrub__lines" aria-live={reducedMotion ? undefined : 'polite'}>
      {lines.map((line, i) => (
        <div
          key={line}
          className={`home-competencies-scrub__line-wrap${i === activeIndex ? ' is-active' : ''}`}
          data-heading={COMPETENCIES_HEADING_ORDER[i] ?? 3}
          aria-current={i === activeIndex ? 'true' : undefined}
        >
          <p className="home-competencies__line home-competencies-scrub__line">{line}</p>
        </div>
      ))}
    </div>
  );

  if (reducedMotion) {
    return (
      <div className="home-competencies-scrub home-competencies-scrub--reduced-motion">
        <div className="home-competencies__panel">
          <div className="home-competencies__inner home-competencies__inner--scrub">
            <div className="home-competencies-scrub__stack" role="region" aria-label={ariaLabel}>
              <div className="home-competencies-scrub__stage">
                {floatCards}
                <div className="home-competencies-scrub__center">{linesStack(0)}</div>
              </div>
            </div>
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={runwayRef} className="home-competencies-scrub home-competencies-scrub__runway">
      <div ref={stickyRef} className="home-competencies-scrub__sticky">
        <div className="home-competencies__panel">
          <div className="home-competencies__inner home-competencies__inner--scrub">
            <div className="home-competencies-scrub__stack" role="region" aria-label={ariaLabel}>
              <div ref={stageRef} className="home-competencies-scrub__stage">
                {floatCards}
                <div className="home-competencies-scrub__center">{linesStack(activeIdx)}</div>
              </div>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
