import { useEffect, useRef } from 'react';

/** Декоративный параллакс фона для всех страниц (уважает prefers-reduced-motion). */
export default function ParallaxBackdrop() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = null;

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

    const applyScroll = () => {
      raf = null;
      if (mq.matches) {
        clearVars();
        return;
      }
      const y = getScrollY();
      root.style.setProperty('--parallax-y1', `${y * 0.06}px`);
      root.style.setProperty('--parallax-y2', `${y * 0.12}px`);
      root.style.setProperty('--parallax-y3', `${y * 0.18}px`);
    };

    const onScroll = () => {
      if (raf == null) raf = window.requestAnimationFrame(applyScroll);
    };

    const onMotionChange = () => {
      if (mq.matches) clearVars();
      else applyScroll();
    };

    applyScroll();
    mq.addEventListener('change', onMotionChange);
    window.addEventListener('scroll', onScroll, { passive: true });
    scrollParent()?.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      mq.removeEventListener('change', onMotionChange);
      window.removeEventListener('scroll', onScroll);
      scrollParent()?.removeEventListener('scroll', onScroll);
      if (raf != null) window.cancelAnimationFrame(raf);
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
