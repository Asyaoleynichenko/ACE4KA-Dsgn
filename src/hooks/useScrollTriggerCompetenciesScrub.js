import { useLayoutEffect } from 'react';
import { ScrollTrigger } from '../gsap/setup.js';
import { refreshScrollTrigger } from '../gsap/scrollTriggerScroller.js';
import { getScrollWrapper } from '../utils/scrollRoot.js';
import { remPx } from '../utils/cssRem.js';
import {
  competenciesScrollTravelPx,
  competenciesViewportHeightPx,
} from '../utils/competenciesScrubMetrics.js';
import { MOTION_SCRUB } from '../motion/motionSystem.js';

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
  scrollTravelPx,
  lineCount = 1,
  onScrub,
}) {
  useLayoutEffect(() => {
    if (!enabled || lineCount < 1) return undefined;

    const runway = runwayRef.current;
    const sticky = stickyRef.current;
    if (!runway || !sticky) return undefined;

    const scroller = getScrollWrapper() === window ? undefined : getScrollWrapper();
    const pinTop = readStickyPinTop(sticky);
    const vh = competenciesViewportHeightPx();
    const travel = Math.max(
      1,
      Math.round(
        scrollTravelPx > 0
          ? scrollTravelPx
          : competenciesScrollTravelPx(lineCount, vh),
      ),
    );

    const st = ScrollTrigger.create({
      id: 'home-competencies-scrub',
      trigger: runway,
      start: () => `top top+=${Math.round(pinTop)}`,
      end: () => `+=${travel}`,
      scrub: MOTION_SCRUB,
      invalidateOnRefresh: true,
      scroller,
      onUpdate(self) {
        onScrub?.(self.progress);
      },
    });

    const sync = () => onScrub?.(st.progress);
    sync();

    requestAnimationFrame(() => {
      refreshScrollTrigger();
      sync();
    });

    return () => {
      st.kill();
    };
  }, [enabled, scrollTravelPx, lineCount, onScrub]);
}
