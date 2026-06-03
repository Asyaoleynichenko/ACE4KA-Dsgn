import { Children, useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { SCRUB_EXIT_PHASE_RATIO } from '../utils/scrubExitHandoff.js';
import { readHorizontalScrubMx } from '../utils/horizontalScrubMetrics.js';
import { useLenisInstance } from '../context/LenisProvider.jsx';
import { refreshScrollTrigger } from '../gsap/scrollTriggerScroller.js';
import {
  scrollToHorizontalScrubProgress,
  useScrollTriggerHorizontalScrub,
} from '../hooks/useScrollTriggerHorizontalScrub.js';

/** Горизонтальный ход ленты (ширина слайдов + gap между ними). */
function readMx(viewport, inner) {
  if (!viewport || !inner) return 0;
  const fromLayout = inner.scrollWidth - viewport.clientWidth;
  if (fromLayout > 1) return fromLayout;
  const slides = inner.querySelectorAll(':scope > *');
  if (slides.length < 2) return 0;
  const slideW = slides[0].getBoundingClientRect().width;
  if (slideW <= 1) return 0;
  const gap = parseFloat(getComputedStyle(inner).columnGap || getComputedStyle(inner).gap) || 0;
  const gaps = slides.length - 1;
  return Math.max(0, slideW * gaps + gap * gaps);
}

/**
 * Лента карточек / контактов:
 * — обычный режим: горизонталь сдвигается при вертикальном скролле; наружная **runway** + `sticky` на ленте
 *   держит блок в зоне видимости, пока не пройден весь горизонтальный ход (время на чтение).
 * — prefers-reduced-motion: нативный overflow-x + свайп/полоса, точки по scrollLeft.
 *
 * variant="hypothesis" — статичный вертикальный стек.
 */
export default function ScrollScrubRow({ children, variant = 'cards', ariaLabel, className = '' }) {
  const { lenis } = useLenisInstance();
  const scrubTriggerId = `scrub-row-${useId().replace(/:/g, '')}`;
  const count = Children.count(children);
  const runwayRef = useRef(null);
  const stickyRef = useRef(null);
  const pinRef = useRef(null);
  const spacerRef = useRef(null);
  const trackRef = useRef(null);
  const viewportRef = useRef(null);
  const innerRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [maxX, setMaxX] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  /** Native horizontal scroll — только при reduced-motion. */
  const useNativeX = reducedMotion;
  /** GSAP ScrollTrigger scrub — горизонтальная лента привязана к скроллу. */
  const useScrollLinked = !useNativeX && (variant === 'cards' || variant === 'contact');
  /** Кинематичный handoff + layered motion — лента карточек кейса. */
  const useCinematicScrub = variant === 'cards' && useScrollLinked;

  useScrollTriggerHorizontalScrub({
    enabled: useScrollLinked,
    triggerId: scrubTriggerId,
    runwayRef,
    pinRef: stickyRef,
    innerRef,
    viewportRef,
    spacerRef,
    slideCount: count,
    cinematic: useCinematicScrub,
    onActiveIndex: (idx) => setActiveIdx((prev) => (prev === idx ? prev : idx)),
  });

  const recalcMaxX = useCallback(() => {
    const inner = innerRef.current;
    const viewport = viewportRef.current;
    if (!inner || !viewport) return;
    const next = readHorizontalScrubMx(viewport, inner);
    setMaxX((prev) => (Math.abs(prev - next) < 2 ? prev : next));
  }, []);

  useLayoutEffect(() => {
    recalcMaxX();
  }, [children, recalcMaxX]);

  useEffect(() => {
    const inner = innerRef.current;
    const viewport = viewportRef.current;
    const runway = runwayRef.current;
    if (!inner || !viewport) return undefined;
    const ro = new ResizeObserver(() => recalcMaxX());
    ro.observe(inner);
    ro.observe(viewport);
    if (runway) ro.observe(runway);
    return () => ro.disconnect();
  }, [recalcMaxX]);

  /** Пересчёт ScrollTrigger после resize контента (без runway — pin-spacer меняет его высоту и даёт отскок). */
  useEffect(() => {
    if (!useScrollLinked) return undefined;
    const nodes = [innerRef.current, viewportRef.current].filter(Boolean);
    if (!nodes.length) return undefined;
    let refreshTimer = null;
    const schedule = () => {
      if (refreshTimer != null) clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => {
        refreshTimer = null;
        recalcMaxX();
        requestAnimationFrame(refreshScrollTrigger);
      }, 220);
    };
    const ro = new ResizeObserver(schedule);
    nodes.forEach((n) => ro.observe(n));
    window.addEventListener('resize', schedule);
    return () => {
      if (refreshTimer != null) clearTimeout(refreshTimer);
      ro.disconnect();
      window.removeEventListener('resize', schedule);
    };
  }, [useScrollLinked, children, recalcMaxX]);

  const syncDotsFromViewportScroll = useCallback(() => {
    const vp = viewportRef.current;
    const inner = innerRef.current;
    if (!vp || !inner || count <= 1) {
      setActiveIdx(0);
      return;
    }
    const slides = inner.querySelectorAll(':scope > *');
    if (!slides.length) {
      setActiveIdx(0);
      return;
    }
    const maxScroll = Math.max(0, vp.scrollWidth - vp.clientWidth);
    if (maxScroll <= 1) {
      setActiveIdx(0);
      return;
    }
    const t = Math.min(1, Math.max(0, vp.scrollLeft / maxScroll));
    const idx = Math.min(slides.length - 1, Math.round(t * (slides.length - 1)));
    setActiveIdx(idx);
  }, [count]);

  useLayoutEffect(() => {
    if (!useNativeX || (variant !== 'cards' && variant !== 'contact')) return undefined;
    syncDotsFromViewportScroll();
    return undefined;
  }, [children, useNativeX, variant, syncDotsFromViewportScroll]);

  useEffect(() => {
    if (!useNativeX || (variant !== 'cards' && variant !== 'contact')) return undefined;
    const vp = viewportRef.current;
    const inner = innerRef.current;
    if (!vp || !inner) return undefined;
    let raf = null;
    const schedule = () => {
      if (raf != null) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        syncDotsFromViewportScroll();
      });
    };
    schedule();
    vp.addEventListener('scroll', schedule, { passive: true });
    const ro = new ResizeObserver(() => schedule());
    ro.observe(vp);
    ro.observe(inner);
    return () => {
      if (raf != null) cancelAnimationFrame(raf);
      vp.removeEventListener('scroll', schedule);
      ro.disconnect();
    };
  }, [useNativeX, variant, syncDotsFromViewportScroll]);

  useEffect(() => {
    if (!useNativeX || (variant !== 'cards' && variant !== 'contact')) return undefined;
    const vp = viewportRef.current;
    if (!vp) return undefined;
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = vp.scrollWidth - vp.clientWidth;
      if (max <= 0) return;
      const atStart = vp.scrollLeft <= 0;
      const atEnd = vp.scrollLeft >= max - 1;
      if ((atStart && e.deltaY < 0) || (atEnd && e.deltaY > 0)) return;
      e.preventDefault();
      vp.scrollLeft += e.deltaY;
    };
    vp.addEventListener('wheel', onWheel, { passive: false });
    return () => vp.removeEventListener('wheel', onWheel);
  }, [useNativeX, variant]);

  const scrollToSlideReduced = useCallback(
    (index) => {
      const vp = viewportRef.current;
      const inner = innerRef.current;
      if (!vp || !inner) return;
      const slides = inner.querySelectorAll(':scope > *');
      const el = slides[index];
      if (!el) return;
      el.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'nearest',
        inline: 'nearest',
      });
    },
    [reducedMotion],
  );

  const scrollToSlideLinked = useCallback(
    (index) => {
      const exitStart = 1 - SCRUB_EXIT_PHASE_RATIO;
      const scrubTarget = count <= 1 ? 0 : index / (count - 1);
      const targetP = scrubTarget * exitStart;
      scrollToHorizontalScrubProgress(scrubTriggerId, targetP, { lenis });
    },
    [count, lenis, scrubTriggerId],
  );

  const rootClass = `scroll-scrub-row scroll-scrub-row__track scroll-scrub-row--${variant} ${className}`.trim();

  const renderIndicator = (onDotClick) => {
    if (count <= 1) return null;
    return (
      <div className="scroll-scrub-row__indicator" role="tablist">
        <div className="scroll-scrub-row__indicator-pill">
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-current={i === activeIdx ? 'true' : undefined}
              aria-label={`${i + 1} / ${count}`}
              className={`scroll-scrub-row__dot${i === activeIdx ? ' is-active' : ''}`}
              onClick={() => onDotClick(i)}
            />
          ))}
        </div>
      </div>
    );
  };

  if (variant === 'hypothesis') {
    return (
      <div className={`${rootClass} scroll-scrub-row--hypothesis-static`}>
        <div className="hypothesis-stack" role="region" aria-label={ariaLabel}>
          {children}
        </div>
      </div>
    );
  }

  if (variant === 'cards' || variant === 'contact') {
    if (useNativeX) {
      return (
        <div className={`${rootClass} scroll-scrub-row--native-x scroll-scrub-row--reduced-motion`.trim()}>
          <div className="scroll-scrub-row__shell">
            <div
              ref={viewportRef}
              className="scroll-scrub-row__viewport scroll-scrub-row__viewport--native-x"
              role="region"
              aria-label={ariaLabel}
            >
              <div ref={innerRef} className="scroll-scrub-row__inner">
                {children}
              </div>
            </div>
            {renderIndicator(scrollToSlideReduced)}
          </div>
        </div>
      );
    }

    return (
      <section
        ref={runwayRef}
        className="scroll-scrub-row__runway scroll-bound-track"
        data-scroll-bound="horizontal"
        aria-roledescription="scroll-driven horizontal sequence"
      >
        <div ref={stickyRef} className="scroll-scrub-row__sticky scroll-scrub-row__sticky--cards scroll-bound-track__pin">
          <div ref={pinRef} className="scroll-scrub-row__pin">
            <div
              ref={trackRef}
              className={`${rootClass} scroll-scrub-row--scroll-linked${useCinematicScrub ? ' scroll-scrub-row--cinematic' : ''}`.trim()}
            >
              <div className="scroll-scrub-row__shell scroll-bound-track__shell">
                <div
                  ref={viewportRef}
                  className="scroll-scrub-row__viewport scroll-scrub-row__viewport--linked scroll-bound-track__viewport scroll-bound-track__jail"
                  role="region"
                  aria-label={ariaLabel}
                >
                  <div ref={innerRef} className="scroll-scrub-row__inner">
                    {children}
                  </div>
                </div>
                {renderIndicator(scrollToSlideLinked)}
              </div>
            </div>
          </div>
        </div>
        <div ref={spacerRef} className="scroll-scrub-row__runway-spacer scroll-bound-track__spacer" aria-hidden="true" />
      </section>
    );
  }

  return null;
}
