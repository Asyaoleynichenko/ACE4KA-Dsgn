import { useLayoutEffect } from 'react';
import { gsap, ScrollTrigger } from '../gsap/setup.js';
import { getScrollWrapper } from '../utils/scrollRoot.js';
import {
  applyScrubExitHandoff,
  clearScrubExitHandoff,
  resolveHandoffTarget,
  splitScrubProgress,
} from '../utils/scrubExitHandoff.js';
import { applyCinematicCardTransforms, resetCinematicCardTransforms } from '../utils/cinematicScrub.js';
import { horizontalScrubRunwaySpanPx, readHorizontalScrubMx } from '../utils/horizontalScrubMetrics.js';

function readViewportHeight() {
  const appRoot = document.getElementById('root');
  if (appRoot?.classList.contains('snap-pages-root')) {
    return appRoot.clientHeight || window.innerHeight || 1;
  }
  return window.innerHeight || 1;
}

function activeIndexFromOffset(x, mx, count) {
  if (count <= 1 || mx <= 1) return 0;
  const step = mx / (count - 1);
  return Math.min(count - 1, Math.round(x / step));
}

/** Отступ pin под шапку кейса (`--scrub-sticky-top`), если у элемента top: 0. */
function readScrubStickyTopPx(pinEl) {
  const host = pinEl?.closest('.project-case-study-mail');
  if (!host) return 0;
  const raw = getComputedStyle(host).getPropertyValue('--scrub-sticky-top').trim();
  if (!raw) return 0;
  const probe = document.createElement('div');
  probe.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;top:${raw};`;
  host.appendChild(probe);
  const px = parseFloat(getComputedStyle(probe).top);
  host.removeChild(probe);
  return Number.isFinite(px) && px > 0 ? px : 0;
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

    const handoffTarget = cinematic ? resolveHandoffTarget(runway) : null;
    if (handoffTarget) handoffTarget.classList.add('scroll-scrub-handoff-target');

    const scroller = getScrollWrapper() === window ? undefined : getScrollWrapper();

    const readPinTopPx = () => {
      const raw = parseFloat(getComputedStyle(pin).top);
      if (Number.isFinite(raw) && raw > 0) return raw;
      return readScrubStickyTopPx(pin);
    };

    let totalSpan = 0;
    // mx (горизонтальный ход) — кэш; обновляем на refresh, не на каждом кадре scrub.
    let mx = 0;
    const updateRunwaySpan = () => {
      const vh = readViewportHeight();
      mx = readHorizontalScrubMx(viewport, inner);
      totalSpan = horizontalScrubRunwaySpanPx(slideCount, vh, { cinematic });
      if (spacer) {
        spacer.style.height = '0';
        spacer.style.minHeight = '0';
      }
      return totalSpan;
    };
    updateRunwaySpan();

    let lastActiveIdx = -1;
    const applyScrubFrame = (self) => {
      const rawP = self.progress;
      const { scrubP, exitP } = splitScrubProgress(rawP);
      const x = scrubP * mx;

      if (cinematic) {
        applyScrubExitHandoff(handoffTarget, exitP);
        applyCinematicCardTransforms(inner, viewport, x, rawP, 0, exitP, mx);
      } else {
        gsap.set(inner, { x: -x, force3D: true });
      }

      const idx = activeIndexFromOffset(x, mx, slideCount);
      if (idx !== lastActiveIdx) {
        lastActiveIdx = idx;
        onActiveIndex?.(idx);
      }
    };

    const st = ScrollTrigger.create({
      id: triggerId,
      trigger: runway,
      start: () => `top top+=${Math.round(readPinTopPx())}`,
      end: () => `+=${totalSpan}`,
      pin,
      pinSpacing: true,
      scrub: true,
      fastScrollEnd: true,
      /** С Lenis anticipatePin даёт скачок при входе/выходе из pin. */
      anticipatePin: 0,
      invalidateOnRefresh: true,
      scroller,
      onRefresh: updateRunwaySpan,
      onEnter: applyScrubFrame,
      onEnterBack: applyScrubFrame,
      onUpdate: applyScrubFrame,
    });

    applyScrubFrame(st);
    const rafId = requestAnimationFrame(() => {
      updateRunwaySpan();
      st.refresh();
      applyScrubFrame(st);
    });

    return () => {
      cancelAnimationFrame(rafId);
      st.kill();
      resetCinematicCardTransforms(inner);
      clearScrubExitHandoff(handoffTarget);
      if (spacer) spacer.style.height = '';
    };
  }, [
    enabled,
    triggerId,
    slideCount,
    cinematic,
    onActiveIndex,
    runwayRef,
    pinRef,
    innerRef,
    viewportRef,
    spacerRef,
  ]);
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
