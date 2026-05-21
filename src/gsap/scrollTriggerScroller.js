import { ScrollTrigger } from './setup.js';
import { getScrollWrapper } from '../utils/scrollRoot.js';

let activeWrapper = null;

/**
 * ScrollTrigger должен читать/писать тот же scroller, что и Lenis (window или #root).
 */
export function applyScrollTriggerScroller(wrapper = getScrollWrapper()) {
  if (typeof window === 'undefined') return;

  if (activeWrapper && activeWrapper !== wrapper) {
    ScrollTrigger.scrollerProxy(activeWrapper, {});
  }

  activeWrapper = wrapper;

  if (wrapper === window) {
    ScrollTrigger.defaults({ scroller: window });
    return;
  }

  ScrollTrigger.scrollerProxy(wrapper, {
    scrollTop(value) {
      if (arguments.length) wrapper.scrollTop = value;
      return wrapper.scrollTop;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: 'transform',
  });

  ScrollTrigger.defaults({ scroller: wrapper });
}

export function refreshScrollTrigger() {
  ScrollTrigger.refresh();
}
