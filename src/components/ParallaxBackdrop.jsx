import { useEffect, useRef } from 'react';
import { useLenisInstance } from '../context/LenisProvider.jsx';
import { bindScrollResize, getScrollY } from '../utils/scrollRoot.js';
import { rem } from '../utils/cssRem.js';

/** Декоративный параллакс фона для всех страниц (уважает prefers-reduced-motion). */
export default function ParallaxBackdrop() {
  const rootRef = useRef(null);
  const { lenis } = useLenisInstance();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    /** τ согласован с motion lerp 0.08 (~тяжёлая камера) */
    const TAU_SEC = 0.52;
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

    const applyParallaxFromY = (y) => {
      root.style.setProperty('--parallax-y1', rem(y * 0.04));
      root.style.setProperty('--parallax-y2', rem(y * 0.08));
      root.style.setProperty('--parallax-y3', rem(y * 0.12));
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
    const unbind = bindScrollResize(onScroll, { lenis });

    return () => {
      mq.removeEventListener('change', onMotionChange);
      unbind();
      if (tickRaf != null) window.cancelAnimationFrame(tickRaf);
      clearVars();
    };
  }, [lenis]);

  return (
    <div ref={rootRef} className="page-parallax" aria-hidden="true">
      <div className="page-parallax__blob page-parallax__blob--1" />
      <div className="page-parallax__blob page-parallax__blob--2" />
      <div className="page-parallax__blob page-parallax__blob--3" />
    </div>
  );
}
