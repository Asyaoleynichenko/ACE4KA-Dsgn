import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useScrollTriggerCompetenciesScrub } from '../hooks/useScrollTriggerCompetenciesScrub.js';
import { COMPETENCIES_HEADING_ORDER } from '../data/competenciesHeadingOrder.js';
import { HOME_PROJECT_SLUGS, homeProjectsCatalog } from '../data/homeProjectsCatalog.js';
import {
  competenciesRunwayTravelPx,
  competenciesScrollTravelPx,
  competenciesViewportHeightPx,
} from '../utils/competenciesScrubMetrics.js';
import { rem } from '../utils/cssRem.js';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { tWithFallback } from '../i18n/tWithFallback.js';
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
  if (n === 1) {
    const wave = Math.sin(Math.PI * clampedT);
    return {
      idx: 0,
      scaleX: 1 + 0.08 * wave,
      scaleY: 1 - 0.06 * wave,
    };
  }
  const denom = n - 1;
  const raw = clampedT * denom;
  const idx = Math.min(n - 1, Math.max(0, Math.floor(raw + 1e-9)));
  const localT =
    idx >= n - 1
      ? Math.min(1, Math.max(0, raw - (n - 2)))
      : Math.min(1, Math.max(0, raw - idx));
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
  lines,
  lineProjectSlugs,
  homeProjectSlugs = HOME_PROJECT_SLUGS,
  ariaLabel,
  children,
}) {
  const { t } = useI18n();
  const runwayRef = useRef(null);
  const stickyRef = useRef(null);
  const stageRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [travelPx, setTravelPx] = useState(0);
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

  const measureTravel = useCallback(() => {
    if (reducedMotion || n < 1) return;
    const vh = competenciesViewportHeightPx();
    setTravelPx((prev) => {
      const next = competenciesRunwayTravelPx(n, vh);
      return prev === next ? prev : next;
    });
  }, [n, reducedMotion]);

  useLayoutEffect(() => {
    measureTravel();
  }, [measureTravel, n]);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const runway = runwayRef.current;
    const sticky = stickyRef.current;
    if (!runway || !sticky) return undefined;
    const ro = new ResizeObserver(() => measureTravel());
    ro.observe(runway);
    ro.observe(sticky);
    window.addEventListener('resize', measureTravel, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measureTravel);
    };
  }, [measureTravel, reducedMotion]);

  const scrollTravelPx = competenciesScrollTravelPx(n, competenciesViewportHeightPx());

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
    scrollTravelPx,
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
        />
      </div>
    ) : null;

  const floatCards = (
    <div className="home-competencies-scrub__floats" aria-hidden={!leftProject && !rightProject}>
      <div className="home-competencies-scrub__float home-competencies-scrub__float--tl">
        {leftProject ? projectCard(leftProject) : null}
      </div>
      <div className="home-competencies-scrub__float home-competencies-scrub__float--br">
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
      {travelPx > 0 ? (
        <div
          className="home-competencies-scrub__travel"
          style={{ height: rem(travelPx) }}
          aria-hidden="true"
        />
      ) : null}
    </div>
  );
}
