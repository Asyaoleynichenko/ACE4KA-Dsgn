import { Children, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  applyCinematicCardTransforms,
  lerpScalar,
  resetCinematicCardTransforms,
  scrollProgress01,
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

/** Вертикальный ход runway: привязан к горизонтальному ходу ленты (без лишней пустоты). */
function getRunwayScrollSpan(vh, slideCount, mx) {
  const steps = Math.max(1, slideCount - 1);
  const perStep = Math.max(vh * 0.38, mx > 1 ? mx * 0.55 : vh * 0.38);
  return Math.max(perStep * steps, remPx(72));
}

/**
 * Прогресс 0…1 и scrollSpan (runwayRectTop — верх обёртки runway, см. sticky-pin ниже).
 */
function linkedStripMetrics(runwayRectTop, mx, vh, slideCount) {
  const scrollSpan = Math.max(1, getRunwayScrollSpan(vh, slideCount, mx));
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

/** Scroll-bound progress 0…1 (runway + sticky pin). */
function linkedProgress01(runway, sticky) {
  return scrollProgress01(runway, sticky);
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
  const pinRef = useRef(null);
  const spacerRef = useRef(null);
  const trackRef = useRef(null);
  const viewportRef = useRef(null);
  const innerRef = useRef(null);
  const rafRef = useRef(null);
  const cinematicRafRef = useRef(null);
  const smoothXRef = useRef(0);
  const prevSmoothXRef = useRef(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const [maxX, setMaxX] = useState(0);
  const [scrollSpanPx, setScrollSpanPx] = useState(0);
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
      setScrollSpanPx((prev) => (prev === 0 ? prev : 0));
      return;
    }
    const scrollSpan = getRunwayScrollSpan(vh, count, mx);
    setScrollSpanPx((prev) => (prev === scrollSpan ? prev : scrollSpan));
    const spacer = spacerRef.current;
    if (spacer) spacer.style.height = rem(scrollSpan);
  }, [count]);

  const progressFromViewport = useCallback(() => {
    const runway = runwayRef.current;
    const sticky = stickyRef.current;
    const viewport = viewportRef.current;
    const inner = innerRef.current;
    if (!runway || !viewport) return 0;
    const mx = inner ? readMx(viewport, inner) : 0;
    if (sticky) return scrollProgress01(runway, sticky, spacerRef.current);
    const vh = readViewportHeight();
    return linkedStripMetrics(runway.getBoundingClientRect().top, mx, vh, count).p;
  }, [count]);

  useLayoutEffect(() => {
    if (useNativeX || (variant !== 'cards' && variant !== 'contact')) return undefined;
    measureRunwayMin();
    const id = requestAnimationFrame(measureRunwayMin);
    return () => cancelAnimationFrame(id);
  }, [children, maxX, measureRunwayMin, useNativeX, variant]);

  /** CSS sticky часто ломается на кейсах (flex/clip у предков) — дублируем pin через fixed. */
  useEffect(() => {
    if (useNativeX || (variant !== 'cards' && variant !== 'contact')) return undefined;

    const updatePin = () => {
      const runway = runwayRef.current;
      const sticky = stickyRef.current;
      const pin = pinRef.current;
      const spacer = spacerRef.current;
      if (!runway || !sticky || !pin) return;

      const stickyTop = parseFloat(getComputedStyle(sticky).top) || 0;
      const runwayRect = runway.getBoundingClientRect();
      const pinH = Math.max(1, pin.offsetHeight);
      /* Пин до тех пор, пока низ runway не дошёл до низа зоны pin (не вычитаем spacer — он уже в bottom). */
      const inPin = runwayRect.top <= stickyTop && runwayRect.bottom > stickyTop + pinH;

      if (inPin) {
        const left = runwayRect.left;
        const width = runwayRect.width;
        pin.classList.add('scroll-scrub-row__pin--fixed');
        pin.style.top = `${stickyTop}px`;
        pin.style.left = `${left}px`;
        pin.style.width = `${width}px`;
        sticky.style.minHeight = `${pinH}px`;
      } else {
        pin.classList.remove('scroll-scrub-row__pin--fixed');
        pin.style.top = '';
        pin.style.left = '';
        pin.style.width = '';
        sticky.style.minHeight = '';
      }
    };

    return bindScrollResize(updatePin);
  }, [useNativeX, variant]);

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
    const spacer = spacerRef.current;
    if (spacer) ro.observe(spacer);
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

  /** Кинематичный scrub (cards): RAF + lerp, пока runway в зоне видимости */
  useEffect(() => {
    if (!useCinematicScrub) return undefined;

    let alive = true;
    let inView = true;
    let io = null;

    const tick = () => {
      const inner = innerRef.current;
      const viewport = viewportRef.current;
      const runway = runwayRef.current;
      const sticky = stickyRef.current;
      if (!inner || !viewport) return;

      const targetP = progressFromViewport();
      const mx = readMx(viewport, inner);
      const targetX = targetP * mx;
      const prevX = smoothXRef.current;
      smoothXRef.current = lerpScalar(smoothXRef.current, targetX);
      const velocityPx = smoothXRef.current - prevX;
      const progress01 = runway ? scrollProgress01(runway, sticky, spacerRef.current) : targetP;
      const { mx: layoutMx } = applyCinematicCardTransforms(
        inner,
        viewport,
        smoothXRef.current,
        progress01,
        velocityPx,
      );
      const mxUse = layoutMx > 1 ? layoutMx : mx;
      setActiveIdx(activeIndexFromOffset(smoothXRef.current, mxUse, count));
    };

    const frame = () => {
      cinematicRafRef.current = null;
      if (!alive || !inView) return;
      tick();
      cinematicRafRef.current = requestAnimationFrame(frame);
    };

    const schedule = () => {
      if (!inView || cinematicRafRef.current != null) return;
      cinematicRafRef.current = requestAnimationFrame(frame);
    };

    const runwayEl = runwayRef.current;
    if (runwayEl && typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(
        ([entry]) => {
          inView = entry.isIntersecting;
          if (inView) schedule();
          else if (cinematicRafRef.current != null) {
            cancelAnimationFrame(cinematicRafRef.current);
            cinematicRafRef.current = null;
            tick();
          }
        },
        { root: null, rootMargin: '15% 0px 15% 0px', threshold: 0 },
      );
      io.observe(runwayEl);
    }

    const unbind = bindScrollResize(schedule);
    schedule();

    return () => {
      alive = false;
      io?.disconnect();
      unbind();
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
    const runway = runwayRef.current;
    const sticky = stickyRef.current;
    const p = runway ? scrollProgress01(runway, sticky, spacerRef.current) : progressFromViewport();
    smoothXRef.current = p * mx;
    prevSmoothXRef.current = smoothXRef.current;
    applyCinematicCardTransforms(inner, viewport, smoothXRef.current, p, 0);
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
      <div ref={runwayRef} className="scroll-scrub-row__runway">
        <div ref={stickyRef} className="scroll-scrub-row__sticky scroll-scrub-row__sticky--cards">
          <div ref={pinRef} className="scroll-scrub-row__pin">
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
                {renderIndicator(scrollToSlideLinked)}
              </div>
            </div>
          </div>
        </div>
        <div ref={spacerRef} className="scroll-scrub-row__runway-spacer" aria-hidden="true" />
      </div>
    );
  }

  return null;
}
