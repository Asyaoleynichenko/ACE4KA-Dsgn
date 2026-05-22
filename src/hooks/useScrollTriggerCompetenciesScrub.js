import { useLayoutEffect } from 'react';
import { ScrollTrigger } from '../gsap/setup.js';
import { refreshScrollTrigger } from '../gsap/scrollTriggerScroller.js';
import { getScrollWrapper } from '../utils/scrollRoot.js';
import { remPx } from '../utils/cssRem.js';
import { competenciesScrollTravelPx } from '../utils/competenciesScrubMetrics.js';
import { MOTION_SCRUB } from '../motion/motionSystem.js';

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
 * Sticky-сцена компетенций: scrub по runway (без GSAP pin — липкость в CSS).
 */
export function useScrollTriggerCompetenciesScrub({
  enabled,
  runwayRef,
  stickyRef,
  runwayMinPx,
  lineCount = 1,
  onScrub,
}) {
  useLayoutEffect(() => {
    if (!enabled || runwayMinPx <= 0 || lineCount < 1) return undefined;

    const runway = runwayRef.current;
    const sticky = stickyRef.current;
    if (!runway || !sticky) return undefined;

    const scroller = getScrollWrapper() === window ? undefined : getScrollWrapper();
    const pinTop = readStickyPinTop(sticky);
    const vh = readViewportHeight();
    const scrollTravel = competenciesScrollTravelPx(lineCount, vh);

    const st = ScrollTrigger.create({
      id: 'home-competencies-scrub',
      trigger: runway,
      start: () => `top top+=${Math.round(pinTop)}`,
      end: () => `+=${Math.max(1, Math.round(scrollTravel))}`,
      scrub: MOTION_SCRUB,
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
  }, [enabled, runwayMinPx, lineCount, onScrub]);
}
