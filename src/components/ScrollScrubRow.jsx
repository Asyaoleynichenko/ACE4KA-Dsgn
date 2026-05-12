import { Children, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * Горизонтальная полоса карточек: смещение слева направо при прокрутке страницы вниз,
 * плюс индикатор-точки (как у горизонтальной галереи кейса).
 */
export default function ScrollScrubRow({ children, variant = 'cards', ariaLabel, className = '' }) {
  /** Гипотезы — только вертикальный стек, без горизонтального скролла и без scrub по скроллу */
  const verticallyCenterSticky = variant === 'cards';
  const stickyEdgeOffset = 72;
  const trackRef = useRef(null);
  const stickyRef = useRef(null);
  const viewportRef = useRef(null);
  const innerRef = useRef(null);
  const rafRef = useRef(null);

  const count = Children.count(children);
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
    const mx = Math.max(0, inner.scrollWidth - viewport.clientWidth);
    setMaxX(mx);
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

  const updateFromScroll = useCallback(() => {
    if (reducedMotion) return;
    const track = trackRef.current;
    const inner = innerRef.current;
    const viewport = viewportRef.current;
    if (!track || !inner || !viewport) return;

    const mx = Math.max(0, inner.scrollWidth - viewport.clientWidth);
    const rect = track.getBoundingClientRect();
    const vh = window.innerHeight;
    // Прогресс через положение трека во viewport — корректно при sticky-блоке внутри
    const scrollRange = rect.height - vh;
    const denom = Math.max(1, scrollRange);
    const p = Math.min(1, Math.max(0, -rect.top / denom));
    // Smootherstep: мягче smoothstep, меньше ощущения «рваного» scrub.
    const eased = p * p * p * (p * (p * 6 - 15) + 10);
    const x = eased * mx;
    inner.style.transform = `translate3d(${-x}px,0,0)`;

    const idx =
      count <= 1 || mx <= 1 ? 0 : Math.min(count - 1, Math.round((x / mx) * (count - 1)));
    setActiveIdx(idx);
  }, [count, reducedMotion]);

  useLayoutEffect(() => {
    if (reducedMotion || !verticallyCenterSticky) return undefined;
    const sticky = stickyRef.current;
    if (!sticky) return undefined;

    const applyStickyTop = () => {
      sticky.style.top = `${stickyEdgeOffset}px`;
    };

    applyStickyTop();
    const ro = new ResizeObserver(() => applyStickyTop());
    ro.observe(sticky);
    window.addEventListener('resize', applyStickyTop);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', applyStickyTop);
      sticky.style.removeProperty('top');
    };
  }, [reducedMotion, verticallyCenterSticky, children, maxX]);

  useEffect(() => {
    if (reducedMotion) return undefined;

    const tick = () => {
      rafRef.current = null;
      updateFromScroll();
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
  }, [updateFromScroll, reducedMotion]);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const sticky = stickyRef.current;
    if (!track || reducedMotion) return undefined;

    const measure = () => {
      const vh = window.innerHeight;
      const stickyH = sticky?.offsetHeight ?? 0;
      const scrollRunway = Math.min(1600, Math.max(vh * 0.95, maxX * 0.52, 420));
      const minTrack = Math.ceil(
        Math.max(vh + scrollRunway, stickyH + scrollRunway + stickyEdgeOffset * 2),
      );
      track.style.minHeight = `${minTrack}px`;
    };

    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(track);
    if (sticky) ro.observe(sticky);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [maxX, reducedMotion, count, stickyEdgeOffset]);

  useEffect(() => {
    if (reducedMotion) return;
    updateFromScroll();
  }, [maxX, reducedMotion, updateFromScroll]);

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

  if (reducedMotion) {
    return (
      <div className={`${rootClass} scroll-scrub-row--reduced-motion`}>
        <div className="scroll-scrub-row__sticky scroll-scrub-row__sticky--reduced">
          <div
            className="scroll-scrub-row__viewport scroll-scrub-row__viewport--reduced"
            role="region"
            aria-label={ariaLabel}
          >
            <div className="scroll-scrub-row__inner">{children}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={trackRef} className={rootClass}>
      <div ref={stickyRef} className="scroll-scrub-row__sticky">
        <div
          ref={viewportRef}
          className="scroll-scrub-row__viewport"
          role="region"
          aria-label={ariaLabel}
        >
          <div ref={innerRef} className="scroll-scrub-row__inner">
            {children}
          </div>
        </div>
        {count > 1 ? (
          <div className="scroll-scrub-row__indicator" aria-hidden="true">
            {Array.from({ length: count }, (_, i) => (
              <span key={i} className={`scroll-scrub-row__dot${i === activeIdx ? ' is-active' : ''}`} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
