import { Children, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * Лента карточек / контактов:
 * — обычный режим: горизонталь сдвигается **автоматически** при вертикальном скролле страницы
 *   (прогресс от положения блока во viewport, без искусственной min-height трека — нет «пустого хвоста»).
 * — prefers-reduced-motion: нативный overflow-x + свайп/полоса, точки по scrollLeft.
 *
 * variant="hypothesis" — статичный вертикальный стек.
 */
export default function ScrollScrubRow({ children, variant = 'cards', ariaLabel, className = '' }) {
  const count = Children.count(children);
  const trackRef = useRef(null);
  const viewportRef = useRef(null);
  const innerRef = useRef(null);
  const rafRef = useRef(null);
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

  /** Прогресс 0…1 по вертикали страницы: «вход» трека снизу → полный сдвиг mx. */
  const progressFromViewport = useCallback(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return 0;
    const mx = Math.max(0, innerRef.current ? innerRef.current.scrollWidth - viewport.clientWidth : 0);
    const rect = track.getBoundingClientRect();
    const vh = window.innerHeight;
    const scrollSpan = Math.min(520, Math.max(140, mx * 0.17 + vh * 0.05));
    const enter = vh * 0.88;
    const leave = enter - scrollSpan;
    const denom = Math.max(1, enter - leave);
    return Math.min(1, Math.max(0, (enter - rect.top) / denom));
  }, []);

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
      const track = trackRef.current;
      const inner = innerRef.current;
      const viewport = viewportRef.current;
      if (!track || !inner || !viewport) return;
      const mx = Math.max(0, inner.scrollWidth - viewport.clientWidth);
      if (mx <= 1) return;
      const targetP = count <= 1 ? 0 : index / (count - 1);
      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollSpan = Math.min(520, Math.max(140, mx * 0.17 + vh * 0.05));
      const enter = vh * 0.88;
      const leave = enter - scrollSpan;
      const denom = Math.max(1, enter - leave);
      const currentP = Math.min(1, Math.max(0, (enter - rect.top) / denom));
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
    );
  }

  return null;
}
