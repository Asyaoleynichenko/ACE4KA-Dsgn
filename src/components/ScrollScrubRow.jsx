import { Children, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

/** Вертикальный ход страницы на полный горизонтальный сдвиг (больше — дольше читать). */
function getScrollSpan(mx, vh) {
  return Math.min(1300, Math.max(520, mx * 0.68 + vh * 0.36));
}

/** Доп. вертикальный скролл в зоне pin: горизонталь = 0 (время прочитать первую карту). */
function getReadDwellPx(vh) {
  return Math.max(220, vh * 0.32);
}

/**
 * Прогресс 0…1 и scrollSpan (runwayRectTop — верх обёртки runway, см. sticky-pin ниже).
 */
function linkedStripMetrics(runwayRectTop, mx, vh) {
  const scrollSpan = Math.max(1, getScrollSpan(mx, vh));
  /* enter + dwell: сначала лента в sticky без горизонтали, потом только сдвиг (дольше читать первую карту). */
  const enter = vh * 0.22;
  const dwellPx = getReadDwellPx(vh);
  const p = Math.min(1, Math.max(0, (enter - runwayRectTop - dwellPx) / scrollSpan));
  return { p, scrollSpan };
}

/**
 * Лента карточек / контактов:
 * — обычный режим: горизонталь сдвигается при вертикальном скролле; наружная **runway** + `sticky` на ленте
 *   держат блок в зоне видимости, пока не пройден весь горизонтальный ход (время на чтение).
 * — prefers-reduced-motion: нативный overflow-x + свайп/полоса, точки по scrollLeft.
 *
 * variant="hypothesis" — статичный вертикальный стек.
 */
export default function ScrollScrubRow({ children, variant = 'cards', ariaLabel, className = '' }) {
  const count = Children.count(children);
  const runwayRef = useRef(null);
  const trackRef = useRef(null);
  const viewportRef = useRef(null);
  const innerRef = useRef(null);
  const rafRef = useRef(null);
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

  const recalcMaxX = useCallback(() => {
    const inner = innerRef.current;
    const viewport = viewportRef.current;
    if (!inner || !viewport) return;
    setMaxX(Math.max(0, inner.scrollWidth - viewport.clientWidth));
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
    const track = trackRef.current;
    const viewport = viewportRef.current;
    const inner = innerRef.current;
    if (!runway || !track || !viewport || !inner) return;
    const vh = window.innerHeight || 1;
    const mx = Math.max(0, inner.scrollWidth - viewport.clientWidth);
    const scrollSpan = getScrollSpan(mx, vh);
    const dwellPx = getReadDwellPx(vh);
    const trackH = track.offsetHeight;
    const next = Math.ceil(trackH + dwellPx + scrollSpan + 12);
    setRunwayMin((prev) => (prev === next ? prev : next));
  }, []);

  /** Прогресс 0…1: скролл по высоте runway (sticky держит ленту в кадре на этом участке). */
  const progressFromViewport = useCallback(() => {
    const runway = runwayRef.current;
    const viewport = viewportRef.current;
    if (!runway || !viewport) return 0;
    const mx = Math.max(0, innerRef.current ? innerRef.current.scrollWidth - viewport.clientWidth : 0);
    const rect = runway.getBoundingClientRect();
    const vh = window.innerHeight;
    return linkedStripMetrics(rect.top, mx, vh).p;
  }, []);

  useLayoutEffect(() => {
    if (reducedMotion || (variant !== 'cards' && variant !== 'contact')) return undefined;
    measureRunwayMin();
    return undefined;
  }, [children, maxX, measureRunwayMin, reducedMotion, variant]);

  useEffect(() => {
    if (reducedMotion || (variant !== 'cards' && variant !== 'contact')) return undefined;
    const runway = runwayRef.current;
    const track = trackRef.current;
    const vp = viewportRef.current;
    const inner = innerRef.current;
    if (!runway || !track || !vp || !inner) return undefined;
    const ro = new ResizeObserver(() => measureRunwayMin());
    ro.observe(runway);
    ro.observe(track);
    ro.observe(vp);
    ro.observe(inner);
    const onResize = () => measureRunwayMin();
    window.addEventListener('resize', onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [measureRunwayMin, reducedMotion, variant]);

  const updateFromPageScroll = useCallback(() => {
    if (reducedMotion) return;
    const inner = innerRef.current;
    const viewport = viewportRef.current;
    if (!inner || !viewport) return;
    const mx = Math.max(0, inner.scrollWidth - viewport.clientWidth);
    const p = progressFromViewport();
    const x = p * mx;
    inner.style.transform = `translate3d(${-x}px,0,0)`;
    const idx =
      count <= 1 || mx <= 1 ? 0 : Math.min(count - 1, Math.round((x / mx) * (count - 1)));
    setActiveIdx(idx);
  }, [count, reducedMotion, progressFromViewport]);

  useEffect(() => {
    if (reducedMotion || (variant !== 'cards' && variant !== 'contact')) return undefined;

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

    tick();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [updateFromPageScroll, reducedMotion, variant]);

  useEffect(() => {
    if (reducedMotion || (variant !== 'cards' && variant !== 'contact')) return undefined;
    updateFromPageScroll();
  }, [maxX, reducedMotion, variant, updateFromPageScroll]);

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
    if (!reducedMotion || (variant !== 'cards' && variant !== 'contact')) return undefined;
    syncDotsFromViewportScroll();
    return undefined;
  }, [children, reducedMotion, variant, syncDotsFromViewportScroll]);

  useEffect(() => {
    if (!reducedMotion || (variant !== 'cards' && variant !== 'contact')) return undefined;
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
  }, [reducedMotion, variant, syncDotsFromViewportScroll]);

  useEffect(() => {
    if (!reducedMotion || (variant !== 'cards' && variant !== 'contact')) return undefined;
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
  }, [reducedMotion, variant]);

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
      const inner = innerRef.current;
      const viewport = viewportRef.current;
      if (!runway || !inner || !viewport) return;
      const mx = Math.max(0, inner.scrollWidth - viewport.clientWidth);
      if (mx <= 1) return;
      const targetP = count <= 1 ? 0 : index / (count - 1);
      const vh = window.innerHeight;
      const { p: currentP, scrollSpan } = linkedStripMetrics(runway.getBoundingClientRect().top, mx, vh);
      const delta = (targetP - currentP) * scrollSpan;
      window.scrollTo({ top: window.scrollY + delta, behavior: 'smooth' });
    },
    [count],
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
    if (reducedMotion) {
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
        style={runwayMin > 0 ? { minHeight: `${runwayMin}px` } : undefined}
      >
        <div ref={trackRef} className={`${rootClass} scroll-scrub-row--scroll-linked`.trim()}>
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
    );
  }

  return null;
}
