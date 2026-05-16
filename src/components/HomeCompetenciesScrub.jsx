import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider.jsx';
import { tWithFallback } from '../i18n/tWithFallback.js';
import ProjectCard from './ProjectCard.jsx';

/** Слушаем и window, и #root (snap-pages-root), и capture на document — как ParallaxBackdrop. */
function bindScrollResize(onTick) {
  const passive = { passive: true };
  const capture = { passive: true, capture: true };
  const appRoot = document.getElementById('root');
  onTick();
  window.addEventListener('scroll', onTick, passive);
  document.addEventListener('scroll', onTick, capture);
  appRoot?.addEventListener('scroll', onTick, passive);
  window.addEventListener('resize', onTick, passive);
  return () => {
    window.removeEventListener('scroll', onTick, passive);
    document.removeEventListener('scroll', onTick, capture);
    appRoot?.removeEventListener('scroll', onTick, passive);
    window.removeEventListener('resize', onTick, passive);
  };
}

/** Figma 416:12975 — порядок H-уровней в стопке (H1 — самый большой, H5 — самый маленький). */
const COMPETENCIES_HEADING_ORDER = [2, 4, 1, 5, 3];

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

/**
 * Прогресс скролла t∈[0,1] → активная строка + резиновая деформация:
 * оси scaleX/scaleY всегда инверсны (X↑ → Y↓ и наоборот). Чётные строки
 * растягиваются по горизонтали и зажимаются по вертикали, нечётные — наоборот.
 */
function activeLineStretchFromScroll(n, t) {
  if (n < 1) return { idx: 0, scaleX: 1, scaleY: 1 };
  const clampedT = Math.min(1, Math.max(0, t));
  if (n === 1) {
    const wave = Math.sin(Math.PI * clampedT);
    return {
      idx: 0,
      scaleX: 1 + 0.12 * wave,
      scaleY: 1 - 0.1 * wave,
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
    scaleX: stretchX ? 1 + 0.14 * wave : 1 - 0.1 * wave,
    scaleY: stretchX ? 1 - 0.1 * wave : 1 + 0.14 * wave,
  };
}

/**
 * Главная — блок компетенций: вертикальный скролл «прокручивает» активную строку;
 * для строки показываются превью проектов (см. `lineProjectSlugs` в словарях).
 */
export default function HomeCompetenciesScrub({
  lines,
  lineProjectSlugs,
  homeProjectSlugs,
  projects,
  ariaLabel,
  children,
}) {
  const { t } = useI18n();
  const runwayRef = useRef(null);
  const stickyRef = useRef(null);
  const stageRef = useRef(null);
  const rafRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [runwayMin, setRunwayMin] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  const n = lines.length;
  const slugRows =
    Array.isArray(lineProjectSlugs) && lineProjectSlugs.length === n
      ? lineProjectSlugs
      : chunkSlugsForLines(n, homeProjectSlugs);

  const resolveProject = useCallback(
    (slug) => projects.find((p) => p.slug === slug) || null,
    [projects],
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const measureRunway = useCallback(() => {
    const runway = runwayRef.current;
    const sticky = stickyRef.current;
    if (!runway || !sticky || reducedMotion || n < 1) return;
    const appRoot = document.getElementById('root');
    const vh = appRoot?.clientHeight ?? window.innerHeight ?? 800;
    const stickyH = sticky.offsetHeight;
    const perStep = Math.max(280, vh * 0.52);
    const next = Math.ceil(stickyH + n * perStep + vh * 0.12);
    setRunwayMin((prev) => (prev === next ? prev : next));
  }, [n, reducedMotion]);

  useLayoutEffect(() => {
    measureRunway();
  }, [measureRunway, lines, n]);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const runway = runwayRef.current;
    const sticky = stickyRef.current;
    if (!runway || !sticky) return undefined;
    const ro = new ResizeObserver(() => measureRunway());
    ro.observe(runway);
    ro.observe(sticky);
    return () => ro.disconnect();
  }, [measureRunway, reducedMotion]);

  const updateActiveFromScroll = useCallback(() => {
    if (reducedMotion || n < 1) return;
    const runway = runwayRef.current;
    const sticky = stickyRef.current;
    if (!runway || !sticky) return;
    const appRoot = document.getElementById('root');
    const vh = appRoot?.clientHeight ?? window.innerHeight ?? 800;
    const rect = runway.getBoundingClientRect();
    /* Pre-trigger 80px + 45vh so the scrub starts as soon as the runway enters the viewport. */
    const scrolled = -rect.top + vh * 0.45 + 80;
    /* Span = full distance the sticky stays pinned. Guarantees t reaches 1 (last line: Branding) before unstick. */
    const span = Math.max(1, runway.offsetHeight - sticky.offsetHeight);
    const t = Math.min(1, Math.max(0, scrolled / span));
    const { idx, scaleX, scaleY } = activeLineStretchFromScroll(n, t);
    setActiveIdx((prev) => (prev === idx ? prev : idx));
    const stage = stageRef.current;
    if (stage) {
      stage.style.setProperty('--comp-active-scale-x', scaleX.toFixed(4));
      stage.style.setProperty('--comp-active-scale-y', scaleY.toFixed(4));
    }
  }, [n, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const tick = () => {
      rafRef.current = null;
      updateActiveFromScroll();
    };
    const schedule = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        tick();
      });
    };
    return bindScrollResize(schedule);
  }, [updateActiveFromScroll, reducedMotion]);

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
          desc=""
          image={item.image}
          isDemo={false}
        />
      </div>
    ) : null;

  if (reducedMotion) {
    return (
      <div className="home-competencies-scrub home-competencies-scrub--reduced-motion">
        <div className="home-competencies__panel">
          <div className="home-competencies__inner home-competencies__inner--scrub-static">
            {lines.map((line, i) => (
              <div
                key={i}
                className="home-competencies-scrub__static-step"
                data-heading={COMPETENCIES_HEADING_ORDER[i] ?? 3}
              >
                <div className="home-competencies-scrub__static-stage">
                  <div className="home-competencies-scrub__static-center">
                    <p className="home-competencies__line home-competencies-scrub__line--static">{line}</p>
                  </div>
                </div>
              </div>
            ))}
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={runwayRef}
      className="home-competencies-scrub__runway"
      style={runwayMin > 0 ? { minHeight: `${runwayMin}px` } : undefined}
    >
      <div ref={stickyRef} className="home-competencies-scrub__sticky">
        <div className="home-competencies__panel">
          <div className="home-competencies__inner home-competencies__inner--scrub">
            <div className="home-competencies-scrub__stack" role="region" aria-label={ariaLabel}>
              <div ref={stageRef} className="home-competencies-scrub__stage">
                <div className="home-competencies-scrub__center">
                  <div className="home-competencies-scrub__lines">
                    {lines.map((line, i) => (
                      <div
                        key={i}
                        className={`home-competencies-scrub__line-wrap${i === activeIdx ? ' is-active' : ''}`}
                        data-heading={COMPETENCIES_HEADING_ORDER[i] ?? 3}
                        aria-current={i === activeIdx ? 'true' : undefined}
                      >
                        <p className="home-competencies__line home-competencies-scrub__line">{line}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {leftProject || rightProject ? (
                <div className="home-competencies-scrub__previews" key={activeIdx}>
                  {projectCard(leftProject)}
                  {projectCard(rightProject)}
                </div>
              ) : null}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
