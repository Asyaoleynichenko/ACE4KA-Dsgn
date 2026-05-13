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
    if (!runway) return;
    const appRoot = document.getElementById('root');
    const vh = appRoot?.clientHeight ?? window.innerHeight ?? 800;
    const rect = runway.getBoundingClientRect();
    const scrolled = -rect.top;
    const span = Math.max(1, runway.offsetHeight - vh * 0.28);
    const t = Math.min(1, Math.max(0, scrolled / span));
    const idx = n <= 1 ? 0 : Math.min(n - 1, Math.max(0, Math.floor((n - 1) * t + 1e-6)));
    setActiveIdx((prev) => (prev === idx ? prev : idx));
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
            {lines.map((line, i) => {
              const slugs = slugRows[i] ?? [];
              const rowProjects = slugs.map(resolveProject).filter(Boolean);
              const rp0 = rowProjects[0] ?? null;
              const rp1 = rowProjects[1] ?? null;
              return (
                <div key={i} className="home-competencies-scrub__static-step">
                  <div className="home-competencies-scrub__static-stage">
                    <div className="home-competencies-scrub__static-side home-competencies-scrub__static-side--left">
                      {rp0 ? projectCard(rp0) : null}
                    </div>
                    <div className="home-competencies-scrub__static-center">
                      <p className="home-competencies__line home-competencies-scrub__line--static">{line}</p>
                    </div>
                    <div className="home-competencies-scrub__static-side home-competencies-scrub__static-side--right">
                      {rp1 ? projectCard(rp1) : null}
                    </div>
                  </div>
                </div>
              );
            })}
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
              <div className="home-competencies-scrub__stage">
                <div className="home-competencies-scrub__side home-competencies-scrub__side--left">
                  {leftProject ? projectCard(leftProject) : null}
                </div>
                <div className="home-competencies-scrub__center">
                  <div className="home-competencies-scrub__lines">
                    {lines.map((line, i) => (
                      <div
                        key={i}
                        className={`home-competencies-scrub__line-wrap${i === activeIdx ? ' is-active' : ''}`}
                        aria-current={i === activeIdx ? 'true' : undefined}
                      >
                        <p className="home-competencies__line home-competencies-scrub__line">{line}</p>
                      </div>
                    ))}
                  </div>
                  {!leftProject && !rightProject ? (
                    <p className="home-competencies-scrub__previews-empty">{t('hero.competencies.previewEmpty')}</p>
                  ) : null}
                </div>
                <div className="home-competencies-scrub__side home-competencies-scrub__side--right">
                  {rightProject ? projectCard(rightProject) : null}
                </div>
              </div>
            </div>
            {n > 1 ? (
              <div className="home-competencies-scrub__dots" aria-hidden="true">
                {lines.map((_, i) => (
                  <span key={i} className={`home-competencies-scrub__dot${i === activeIdx ? ' is-active' : ''}`} />
                ))}
              </div>
            ) : null}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
