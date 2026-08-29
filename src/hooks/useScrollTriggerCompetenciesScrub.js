import { useLayoutEffect } from 'react';
import { ScrollTrigger } from '../gsap/setup.js';
import { refreshScrollTrigger } from '../gsap/scrollTriggerScroller.js';
import { getScrollWrapper } from '../utils/scrollRoot.js';
import { MOTION_SCRUB } from '../motion/motionSystem.js';

function unwrapPinSpacers(root) {
  if (!root) return;
  root.querySelectorAll('.pin-spacer').forEach((spacer) => {
    const parent = spacer.parentNode;
    if (!parent) return;
    while (spacer.firstChild) parent.insertBefore(spacer.firstChild, spacer);
    spacer.remove();
  });
  const parent = root.parentElement;
  if (parent?.classList.contains('pin-spacer')) {
    const grand = parent.parentNode;
    if (grand) {
      while (parent.firstChild) grand.insertBefore(parent.firstChild, parent);
      parent.remove();
    }
  }
}

/**
 * Смена строк по скроллу самой секции. Без pin и без пустого хвоста runway.
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
    const runway = runwayRef.current;
    const pinEl = stickyRef.current;
    if (!runway || !pinEl) return undefined;

    const applyTravel = () => {
      runway.style.removeProperty('--comp-scrub-travel');
    };

    if (!enabled || lineCount < 1) {
      applyTravel();
      onScrub?.(0);
      return () => applyTravel();
    }

    const scroller = getScrollWrapper() === window ? undefined : getScrollWrapper();
    applyTravel();

    ScrollTrigger.getById('home-competencies-scrub')?.kill();
    unwrapPinSpacers(runway.closest('.home-competencies') || runway);

    const st = ScrollTrigger.create({
      id: 'home-competencies-scrub',
      trigger: runway,
      start: 'top 85%',
      end: 'bottom 15%',
      pin: false,
      pinSpacing: false,
      scrub: MOTION_SCRUB,
      invalidateOnRefresh: true,
      scroller,
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

    const onResize = () => {
      applyTravel();
      refreshScrollTrigger();
    };
    window.addEventListener('resize', onResize, { passive: true });

    const rafId = requestAnimationFrame(() => {
      applyTravel();
      refreshScrollTrigger();
      sync();
    });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      runway.classList.remove('is-scrub-complete');
      applyTravel();
      st.kill();
    };
  }, [enabled, scrollTravelPx, lineCount, onScrub, runwayRef, stickyRef]);
}
