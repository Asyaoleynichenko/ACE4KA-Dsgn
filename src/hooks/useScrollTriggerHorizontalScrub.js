import { useLayoutEffect } from 'react';
import { gsap, ScrollTrigger } from '../gsap/setup.js';
import { refreshScrollTrigger } from '../gsap/scrollTriggerScroller.js';
import { getScrollWrapper } from '../utils/scrollRoot.js';
import { rem, remPx } from '../utils/cssRem.js';
import {
  applyScrubExitHandoff,
  clearScrubExitHandoff,
  resolveHandoffTarget,
  scrubExitSpanPx,
  splitScrubProgress,
} from '../utils/scrubExitHandoff.js';
import { applyCinematicCardTransforms, resetCinematicCardTransforms } from '../utils/cinematicScrub.js';

function readViewportHeight() {
  const appRoot = document.getElementById('root');
  if (appRoot?.classList.contains('snap-pages-root')) {
    return appRoot.clientHeight || window.innerHeight || 1;
  }
  return window.innerHeight || 1;
}

function readMx(viewport, inner) {
  if (!viewport || !inner) return 0;
  const fromLayout = inner.scrollWidth - viewport.clientWidth;
  if (fromLayout > 1) return fromLayout;
  const slides = inner.querySelectorAll(':scope > *');
  if (slides.length < 2) return 0;
  const slideW = slides[0].getBoundingClientRect().width;
  if (slideW <= 1) return 0;
  const gap = parseFloat(getComputedStyle(inner).columnGap || getComputedStyle(inner).gap) || 0;
  const gaps = slides.length - 1;
  return Math.max(0, slideW * gaps + gap * gaps);
}

function getRunwayScrollSpan(vh, slideCount, mx) {
  const steps = Math.max(1, slideCount - 1);
  const perStep = Math.max(vh * 0.38, mx > 1 ? mx * 0.55 : vh * 0.38);
  return Math.max(perStep * steps, remPx(72));
}

function activeIndexFromOffset(x, mx, count) {
  if (count <= 1 || mx <= 1) return 0;
  const step = mx / (count - 1);
  return Math.min(count - 1, Math.round(x / step));
}

/**
 * Горизонтальный storytelling: pin + scrub:true — camera-like scroll, museum feel.
 */
export function useScrollTriggerHorizontalScrub({
  enabled,
  triggerId,
  runwayRef,
  pinRef,
  innerRef,
  viewportRef,
  spacerRef,
  slideCount,
  cinematic = true,
  onActiveIndex,
}) {
  useLayoutEffect(() => {
    if (!enabled) return undefined;

    const runway = runwayRef.current;
    const pin = pinRef.current;
    const inner = innerRef.current;
    const viewport = viewportRef.current;
    const spacer = spacerRef.current;
    if (!runway || !pin || !inner || !viewport) return undefined;

    const vh = readViewportHeight();
    const mx = readMx(viewport, inner);
    const scrollSpan = getRunwayScrollSpan(vh, slideCount, mx);
    const exitSpan = cinematic ? scrubExitSpanPx(vh) : 0;
    const totalSpan = scrollSpan + exitSpan;

    if (spacer) spacer.style.height = rem(totalSpan);

    const handoffTarget = cinematic ? resolveHandoffTarget(runway) : null;
    if (handoffTarget) handoffTarget.classList.add('scroll-scrub-handoff-target');

    const scroller = getScrollWrapper() === window ? undefined : getScrollWrapper();

    const st = ScrollTrigger.create({
      id: triggerId,
      trigger: runway,
      start: 'top top',
      end: () => `+=${totalSpan}`,
      pin,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      scroller,
      onUpdate(self) {
        const rawP = self.progress;
        const { scrubP, exitP } = splitScrubProgress(rawP);
        const x = scrubP * mx;

        if (cinematic) {
          applyScrubExitHandoff(handoffTarget, exitP);
          applyCinematicCardTransforms(inner, viewport, x, rawP, 0, exitP);
        } else {
          gsap.set(inner, { x: -x, force3D: true });
        }

        onActiveIndex?.(activeIndexFromOffset(x, mx, slideCount));
      },
    });

    requestAnimationFrame(refreshScrollTrigger);

    return () => {
      st.kill();
      resetCinematicCardTransforms(inner);
      clearScrubExitHandoff(handoffTarget);
      if (spacer) spacer.style.height = '';
    };
  }, [enabled, triggerId, slideCount, cinematic, onActiveIndex]);
}

/** Прокрутка к progress (0…1) внутри scrub-сцены. */
export function scrollToHorizontalScrubProgress(triggerId, progress01, { lenis } = {}) {
  const st = ScrollTrigger.getById(triggerId);
  if (!st) return false;
  const y = st.start + (st.end - st.start) * Math.min(1, Math.max(0, progress01));
  if (lenis) lenis.scrollTo(y, { immediate: false });
  else {
    const wrapper = getScrollWrapper();
    if (wrapper === window) window.scrollTo(0, y);
    else wrapper.scrollTo(0, y);
  }
  return true;
}
