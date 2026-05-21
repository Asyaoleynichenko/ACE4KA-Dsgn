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

/**
 * Sticky-сцена компетенций: pin + scrub:true, layered motion на активной строке.
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

    const vh = readViewportHeight();
    const scroller = getScrollWrapper() === window ? undefined : getScrollWrapper();
    const startOffset = Math.round(remPx(80) + vh * 0.45);

    const st = ScrollTrigger.create({
      id: 'home-competencies-scrub',
      trigger: runway,
      start: `top ${startOffset}`,
      end: () => `+=${runwayMinPx}`,
      pin: sticky,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      scroller,
      onUpdate(self) {
        onScrub?.(self.progress);
      },
    });

    requestAnimationFrame(refreshScrollTrigger);

    return () => {
      st.kill();
    };
  }, [enabled, runwayMinPx, onScrub]);
}
