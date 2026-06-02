import { gsap } from './setup.js';
import { ScrollTrigger } from './setup.js';
import { applyScrollTriggerScroller, refreshScrollTrigger } from './scrollTriggerScroller.js';
import { getScrollWrapper } from '../utils/scrollRoot.js';

let connectedLenis = null;
let tickerFn = null;
let scrollHandler = null;
let refreshRafId = null;

/**
 * Lenis (inertia) + ScrollTrigger (scrub timelines) — один RAF через GSAP ticker.
 * @see https://github.com/darkroomengineering/lenis#gsap-scrolltrigger
 */
export function connectLenisScrollTrigger(lenis) {
  if (!lenis || typeof window === 'undefined') return;

  disconnectLenisScrollTrigger();

  connectedLenis = lenis;
  applyScrollTriggerScroller(getScrollWrapper());

  scrollHandler = () => ScrollTrigger.update();
  lenis.on('scroll', scrollHandler);

  tickerFn = (time) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(tickerFn);
  gsap.ticker.lagSmoothing(0);

  refreshRafId = requestAnimationFrame(refreshScrollTrigger);
}

export function disconnectLenisScrollTrigger() {
  if (refreshRafId != null) {
    cancelAnimationFrame(refreshRafId);
    refreshRafId = null;
  }
  if (connectedLenis && scrollHandler) {
    connectedLenis.off('scroll', scrollHandler);
  }
  if (tickerFn) {
    gsap.ticker.remove(tickerFn);
    tickerFn = null;
  }
  scrollHandler = null;
  connectedLenis = null;
}

export function onScrollTriggerScrollerChange() {
  applyScrollTriggerScroller(getScrollWrapper());
  refreshScrollTrigger();
}
