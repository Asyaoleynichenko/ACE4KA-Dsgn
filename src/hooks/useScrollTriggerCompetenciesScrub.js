import { useLayoutEffect } from 'react';
import { ScrollTrigger } from '../gsap/setup.js';
import { refreshScrollTrigger } from '../gsap/scrollTriggerScroller.js';
import { getScrollWrapper } from '../utils/scrollRoot.js';
import { remPx } from '../utils/cssRem.js';

function readViewportHeight() {
  const appRoot = document.getElementById('root');
  if (appRoot?.classList.contains('snap-pages-root')) {
    return appRoot.clientHeight || window.innerHeight || 1;
  }
  return window.innerHeight || 1;
}

/** Верх pin = тот же offset, что в CSS у .home-competencies-scrub__sticky { top } */
function readStickyPinTop(sticky) {
  if (!sticky) return remPx(80);
  const top = parseFloat(getComputedStyle(sticky).top);
  return Number.isFinite(top) ? top : remPx(80);
}

/**
 * Сцена компетенций: scrub по runway, без GSAP pin (липкость — CSS sticky + центрирование в CSS).
 */
export function useScrollTriggerCompetenciesScrub({
  enabled,
  runwayRef,
  stickyRef,
  runwayMinPx,
  onScrub,
}) {
  useLayoutEffect(() => {
    if (!enabled || runwayMinPx <= 0) return undefined;

    const runway = runwayRef.current;
    const sticky = stickyRef.current;
    if (!runway || !sticky) return undefined;

    const scroller = getScrollWrapper() === window ? undefined : getScrollWrapper();
    const pinTop = readStickyPinTop(sticky);

    const st = ScrollTrigger.create({
      id: 'home-competencies-scrub',
      trigger: runway,
      start: () => `top top+=${Math.round(pinTop)}`,
      end: () => {
        const vh = readViewportHeight();
        const scrollSpan = Math.max(1, runway.offsetHeight - vh);
        return `+=${scrollSpan}`;
      },
      scrub: true,
      invalidateOnRefresh: true,
      scroller,
      onUpdate(self) {
        onScrub?.(self.progress);
      },
    });

    onScrub?.(st.progress);

    requestAnimationFrame(() => {
      refreshScrollTrigger();
      onScrub?.(st.progress);
    });

    return () => {
      st.kill();
    };
  }, [enabled, runwayMinPx, onScrub]);
}
