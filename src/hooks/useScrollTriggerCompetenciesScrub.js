import { useLayoutEffect } from 'react';
import { ScrollTrigger } from '../gsap/setup.js';
import { refreshScrollTrigger } from '../gsap/scrollTriggerScroller.js';
import { getScrollWrapper } from '../utils/scrollRoot.js';
import {
  competenciesScrollTravelPx,
  competenciesViewportHeightPx,
} from '../utils/competenciesScrubMetrics.js';
import { MOTION_SCRUB } from '../motion/motionSystem.js';

/**
 * Блок компетенций: GSAP pin + scrub — сцена по центру экрана, уход только после всех строк.
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
    const pinEl = stickyRef.current;
    if (!runway || !pinEl) return undefined;

    const scroller = getScrollWrapper() === window ? undefined : getScrollWrapper();
    const getTravel = () =>
      Math.max(
        1,
        Math.round(
          scrollTravelPx > 0
            ? scrollTravelPx
            : competenciesScrollTravelPx(lineCount, competenciesViewportHeightPx()),
        ),
      );

    const stepSnap = lineCount > 0 ? 1 / lineCount : 1;

    const st = ScrollTrigger.create({
      id: 'home-competencies-scrub',
      trigger: runway,
      start: 'center center',
      end: () => `+=${getTravel()}`,
      pin: pinEl,
      pinSpacing: true,
      scrub: MOTION_SCRUB,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      scroller,
      snap: {
        snapTo: (value) => Math.min(1, Math.round(value / stepSnap) * stepSnap),
        duration: { min: 0.12, max: 0.32 },
        delay: 0,
        ease: 'power1.inOut',
      },
      onUpdate(self) {
        onScrub?.(self.progress);
      },
      onLeave: () => {
        runway.classList.add('is-scrub-complete');
      },
      onEnterBack: () => {
        runway.classList.remove('is-scrub-complete');
      },
    });

    const sync = () => onScrub?.(st.progress);
    sync();

    const rafId = requestAnimationFrame(() => {
      refreshScrollTrigger();
      sync();
    });

    return () => {
      cancelAnimationFrame(rafId);
      runway.classList.remove('is-scrub-complete');
      st.kill();
    };
  }, [enabled, scrollTravelPx, lineCount, onScrub, runwayRef, stickyRef]);
}
