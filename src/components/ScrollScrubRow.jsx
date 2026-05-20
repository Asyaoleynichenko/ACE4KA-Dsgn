import { Children, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  applyCinematicCardTransforms,
  lerpScalar,
  resetCinematicCardTransforms,
} from '../utils/cinematicScrub.js';
import { rem, remPx } from '../utils/cssRem.js';

/** Скролл страницы: window или #root (snap-pages), как ParallaxBackdrop / HomeCompetenciesScrub. */
function getScrollRoot() {
  const root = document.getElementById('root');
  if (root && root.scrollHeight > root.clientHeight + 2) return root;
  return null;
}

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

function scrollByPx(delta, behavior = 'auto') {
  const root = getScrollRoot();
  if (root) root.scrollBy({ top: delta, behavior });
  else window.scrollBy({ top: delta, behavior });
}

/** Вертикальный ход: ~0.55vh на каждый переход между карточками, не меньше фактического mx. */
function getScrollSpan(mx, vh, slideCount) {
  const steps = Math.max(1, slideCount - 1);
  const perStep = vh * 0.55;
  return Math.max(mx + 1, perStep * steps, remPx(120));
}

/**
 * Прогресс 0…1 и scrollSpan (runwayRectTop — верх обёртки runway, см. sticky-pin ниже).
 */
function linkedStripMetrics(runwayRectTop, mx, vh, slideCount) {
  const scrollSpan = Math.max(1, getScrollSpan(mx, vh, slideCount));
  const enter = vh * 0.12;
  const p = Math.min(1, Math.max(0, (enter - runwayRectTop) / scrollSpan));
  return { p, scrollSpan };
}

function activeIndexFromOffset(x, mx, count) {
  if (count <= 1 || mx <= 1) return 0;
  const step = mx / (count - 1);
  return Math.min(count - 1, Math.round(x / step));
}

function readViewportHeight() {
  const appRoot = document.getElementById('root');
  if (appRoot?.classList.contains('snap-pages-root')) return appRoot.clientHeight || window.innerHeight || 1;
  return window.innerHeight || 1;
}

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
 * Прогресс 0…1 по вертикальному скроллу, пока runway проходит через viewport.
 * Та же модель, что HomeCompetenciesScrub: scrolled / (runwayH − stickyH).
 */
function linkedProgress01(runway, sticky) {
  if (!runway) return 0;
  const vh = readViewportHeight();
  const rect = runway.getBoundingClientRect();
  const scrolled = -rect.top + vh * 0.45 + remPx(80);
  const pinH = sticky?.offsetHeight ?? 0;
  const span = Math.max(1, runway.offsetHeight - pinH);
  return Math.min(1, Math.max(0, scrolled / span));
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
  const count = Children.count(children);
  const runwayRef = useRef(null);
  const stickyRef = useRef(null);
  const trackRef = useRef(null);
  const viewportRef = useRef(null);
  const innerRef = useRef(null);
  const rafRef = useRef(null);
  const cinematicRafRef = useRef(null);
  const smoothXRef = useRef(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const [maxX, setMaxX] = useState(0);
  const [runwayMin, setRunwayMin] = useState(0);
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

  /** Native horizontal scroll включается только при reduced-motion; в остальных случаях — scroll-linked auto-scrub. */
  const useNativeX = reducedMotion;
  /** Кинематичный scrub с lerp + parallax — только лента карточек кейса. */
  const useCinematicScrub = variant === 'cards' && !useNativeX;

  const recalcMaxX = useCallback(() => {
    const inner = innerRef.current;
    const viewport = viewportRef.current;
    if (!inner || !viewport) return;
    setMaxX(readMx(viewport, inner));
  }, []);

  useLayoutEffect(() => {
    recalcMaxX();
  }, [children, recalcMaxX]);

  useEffect(() => {
    const inner = innerRef.current;
    const viewport = viewportRef.current;
    if (!inner || !viewport) return undefined;
    const ro = new ResizeObserver(() => recalcMaxX());
    ro.observe(inner);
    ro.observe(viewport);
    return () => ro.disconnect();
  }, [recalcMaxX]);

  const measureRunwayMin = useCallback(() => {
    const runway = runwayRef.current;
    const sticky = stickyRef.current;
    const track = trackRef.current;
    const viewport = viewportRef.current;
    const inner = innerRef.current;
    if (!runway || !track || !viewport || !inner) return;
    const vh = readViewportHeight();
    const mx = readMx(viewport, inner);
    if (mx <= 1) {
      setRunwayMin((prev) => (prev === 0 ? prev : 0));
      return;
    }
    const scrollSpan = getScrollSpan(mx, vh, count);
    const pinH = sticky?.offsetHeight ?? track.offsetHeight;
    const next = Math.ceil(pinH + scrollSpan + remPx(16));
    setRunwayMin((prev) => (prev === next ? prev : next));
  }, [count]);

  const progressFromViewport = useCallback(() => {
    const runway = runwayRef.current;
    const sticky = stickyRef.current;
    const viewport = viewportRef.current;
    const inner = innerRef.current;
    if (!runway || !viewport) return 0;
    const mx = inner ? readMx(viewport, inner) : 0;
    if (sticky) return linkedProgress01(runway, sticky);
    const vh = readViewportHeight();
    return linkedStripMetrics(runway.getBoundingClientRect().top, mx, vh, count).p;
  }, [count]);

  useLayoutEffect(() => {
    if (useNativeX || (variant !== 'cards' && variant !== 'contact')) return undefined;
    measureRunwayMin();
    const id = requestAnimationFrame(measureRunwayMin);
    return () => cancelAnimationFrame(id);
  }, [children, maxX, measureRunwayMin, useNativeX, variant]);

  useEffect(() => {
    if (useNativeX || (variant !== 'cards' && variant !== 'contact')) return undefined;
    const runway = runwayRef.current;
    const sticky = stickyRef.current;
    const track = trackRef.current;
    const vp = viewportRef.current;
    const inner = innerRef.current;
    if (!runway || !track || !vp || !inner) return undefined;
    const ro = new ResizeObserver(() => measureRunwayMin());
    ro.observe(runway);
    if (sticky) ro.observe(sticky);
    ro.observe(track);
    ro.observe(vp);
    ro.observe(inner);
    const onResize = () => measureRunwayMin();
    window.addEventListener('resize', onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [measureRunwayMin, useNativeX, variant]);

  const updateFromPageScroll = useCallback(() => {
    if (useNativeX || useCinematicScrub) return;
    const inner = innerRef.current;
    const viewport = viewportRef.current;
    if (!inner || !viewport) return;
    const mx = readMx(viewport, inner);
    const p = progressFromViewport();
    const x = p * mx;
    inner.style.transform = mx > 1 ? `translate3d(${-x}px,0,0)` : 'none';
    setActiveIdx(activeIndexFromOffset(x, mx, count));
  }, [count, useCinematicScrub, useNativeX, progressFromViewport]);

  /** Линейный scrub (contact): обновление по scroll + resize. */
  useEffect(() => {
    if (useNativeX || useCinematicScrub || (variant !== 'cards' && variant !== 'contact')) return undefined;

    const tick = () => {
      rafRef.current = null;
      updateFromPageScroll();
    };
    const onScrollOrResize = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        tick();
      });
    };

    return bindScrollResize(onScrollOrResize);
  }, [updateFromPageScroll, useCinematicScrub, useNativeX, variant]);

  useEffect(() => {
    if (useNativeX || useCinematicScrub || (variant !== 'cards' && variant !== 'contact')) return undefined;
    updateFromPageScroll();
  }, [maxX, useCinematicScrub, useNativeX, variant, updateFromPageScroll]);

  /** Кинематичный scrub (cards): непрерывный RAF + lerp к целевой позиции от вертикального скролла. */
  useEffect(() => {
    if (!useCinematicScrub) return undefined;

    let alive = true;

    const frame = () => {
      if (!alive) return;
      const inner = innerRef.current;
      const viewport = viewportRef.current;
      if (inner && viewport) {
        const targetP = progressFromViewport();
        const mx = readMx(viewport, inner);
        const targetX = targetP * mx;
        smoothXRef.current = lerpScalar(smoothXRef.current, targetX);
        const { mx: layoutMx } = applyCinematicCardTransforms(inner, viewport, smoothXRef.current);
        const mxUse = layoutMx > 1 ? layoutMx : mx;
        setActiveIdx(activeIndexFromOffset(smoothXRef.current, mxUse, count));
      }
      cinematicRafRef.current = requestAnimationFrame(frame);
    };

    cinematicRafRef.current = requestAnimationFrame(frame);

    return () => {
      alive = false;
      if (cinematicRafRef.current != null) cancelAnimationFrame(cinematicRafRef.current);
      resetCinematicCardTransforms(innerRef.current);
    };
  }, [count, progressFromViewport, useCinematicScrub]);

  useLayoutEffect(() => {
    if (!useCinematicScrub) return undefined;
    const inner = innerRef.current;
    const viewport = viewportRef.current;
    if (!inner || !viewport) return undefined;
    const mx = readMx(viewport, inner);
    smoothXRef.current = progressFromViewport() * mx;
    applyCinematicCardTransforms(inner, viewport, smoothXRef.current);
    return undefined;
  }, [children, maxX, progressFromViewport, useCinematicScrub]);

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
      const runway = runwayRef.current;
      const sticky = stickyRef.current;
      const inner = innerRef.current;
      const viewport = viewportRef.current;
      if (!runway || !inner || !viewport) return;
      const mx = readMx(viewport, inner);
      if (mx <= 1) return;
      const targetP = count <= 1 ? 0 : index / (count - 1);
      const currentP = progressFromViewport();
      const vh = readViewportHeight();
      const scrollSpan = sticky
        ? Math.max(1, runway.offsetHeight - sticky.offsetHeight)
        : linkedStripMetrics(runway.getBoundingClientRect().top, mx, vh, count).scrollSpan;
      const delta = (targetP - currentP) * scrollSpan;
      scrollByPx(delta, 'smooth');
    },
    [count, progressFromViewport],
  );

  const rootClass = `scroll-scrub-row scroll-scrub-row__track scroll-scrub-row--${variant} ${className}`.trim();

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
            {count > 1 ? (
              <div className="scroll-scrub-row__indicator">
                {Array.from({ length: count }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-current={i === activeIdx ? 'true' : undefined}
                    aria-label={`${i + 1} / ${count}`}
                    className={`scroll-scrub-row__dot${i === activeIdx ? ' is-active' : ''}`}
                    onClick={() => scrollToSlideReduced(i)}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      );
    }

    return (
      <div
        ref={runwayRef}
        className="scroll-scrub-row__runway"
        style={runwayMin > 0 ? { minHeight: rem(runwayMin) } : undefined}
      >
        <div ref={stickyRef} className="scroll-scrub-row__sticky scroll-scrub-row__sticky--cards">
          <div
            ref={trackRef}
            className={`${rootClass} scroll-scrub-row--scroll-linked${useCinematicScrub ? ' scroll-scrub-row--cinematic' : ''}`.trim()}
          >
            <div className="scroll-scrub-row__shell">
            <div
              ref={viewportRef}
              className="scroll-scrub-row__viewport scroll-scrub-row__viewport--linked"
              role="region"
              aria-label={ariaLabel}
            >
              <div ref={innerRef} className="scroll-scrub-row__inner">
                {children}
              </div>
            </div>
            {count > 1 ? (
              <div className="scroll-scrub-row__indicator">
                {Array.from({ length: count }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-current={i === activeIdx ? 'true' : undefined}
                    aria-label={`${i + 1} / ${count}`}
                    className={`scroll-scrub-row__dot${i === activeIdx ? ' is-active' : ''}`}
                    onClick={() => scrollToSlideLinked(i)}
                  />
                ))}
              </div>
            ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
