import { useEffect, useRef } from 'react';

/** Декоративный параллакс фона для всех страниц (уважает prefers-reduced-motion). */
export default function ParallaxBackdrop() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    /** Плавное следование за скроллом: τ секунд — чем больше, тем мягче движение слоёв */
    const TAU_SEC = 0.32;
    const EPS_PX = 0.2;

    let tickRaf = null;
    let lastTs = 0;
    let targetY = 0;
    let smoothY = 0;

    const clearVars = () => {
      root.style.removeProperty('--parallax-y1');
      root.style.removeProperty('--parallax-y2');
      root.style.removeProperty('--parallax-y3');
    };

    const scrollParent = () => document.getElementById('root');

    const getScrollY = () => {
      const appRoot = scrollParent();
      if (appRoot?.classList.contains('snap-pages-root')) return appRoot.scrollTop;
      return window.scrollY || document.documentElement.scrollTop || 0;
    };

    const applyParallaxFromY = (y) => {
      root.style.setProperty('--parallax-y1', `${y * 0.06}px`);
      root.style.setProperty('--parallax-y2', `${y * 0.12}px`);
      root.style.setProperty('--parallax-y3', `${y * 0.18}px`);
    };

    const tick = (now) => {
      tickRaf = null;
      if (mq.matches) {
        clearVars();
        lastTs = 0;
        return;
      }
      if (!lastTs) lastTs = now;
      const dt = Math.min((now - lastTs) / 1000, 0.05);
      lastTs = now;
      const alpha = dt > 0 ? 1 - Math.exp(-dt / TAU_SEC) : 1;
      smoothY += (targetY - smoothY) * alpha;
      applyParallaxFromY(smoothY);

      if (Math.abs(targetY - smoothY) > EPS_PX) {
        tickRaf = window.requestAnimationFrame(tick);
      } else {
        smoothY = targetY;
        applyParallaxFromY(smoothY);
        lastTs = 0;
      }
    };

    const onScroll = () => {
      targetY = getScrollY();
      if (tickRaf == null) tickRaf = window.requestAnimationFrame(tick);
    };

    const onMotionChange = () => {
      if (mq.matches) {
        if (tickRaf != null) window.cancelAnimationFrame(tickRaf);
        tickRaf = null;
        lastTs = 0;
        clearVars();
      } else {
        targetY = smoothY = getScrollY();
        applyParallaxFromY(smoothY);
        lastTs = 0;
      }
    };

    targetY = smoothY = getScrollY();
    if (!mq.matches) applyParallaxFromY(smoothY);
    mq.addEventListener('change', onMotionChange);
    window.addEventListener('scroll', onScroll, { passive: true });
    scrollParent()?.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      mq.removeEventListener('change', onMotionChange);
      window.removeEventListener('scroll', onScroll);
      scrollParent()?.removeEventListener('scroll', onScroll);
      if (tickRaf != null) window.cancelAnimationFrame(tickRaf);
      clearVars();
    };
  }, []);

  return (
    <div ref={rootRef} className="page-parallax" aria-hidden="true">
      <div className="page-parallax__blob page-parallax__blob--1" />
      <div className="page-parallax__blob page-parallax__blob--2" />
      <div className="page-parallax__blob page-parallax__blob--3" />
    </div>
  );
}
