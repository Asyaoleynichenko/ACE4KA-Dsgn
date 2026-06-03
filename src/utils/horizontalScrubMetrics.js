import { remPx } from './cssRem.js';
import { MOTION } from '../motion/motionSystem.js';
import { scrubExitSpanPx } from './scrubExitHandoff.js';

/** Горизонтальный ход ленты (ширина слайдов + gap − viewport). */
export function readHorizontalScrubMx(viewport, inner) {
  if (!viewport || !inner) return 0;
  const slides = inner.querySelectorAll(':scope > *');
  if (slides.length < 2) return 0;

  const gap = parseFloat(getComputedStyle(inner).columnGap || getComputedStyle(inner).gap) || 0;
  let trackW = 0;
  slides.forEach((slide) => {
    trackW += slide.getBoundingClientRect().width;
  });
  trackW += gap * (slides.length - 1);

  const viewW = viewport.clientWidth;
  const fromSlides = Math.max(0, trackW - viewW);
  if (fromSlides > 1) return fromSlides;

  const fromLayout = inner.scrollWidth - viewW;
  if (fromLayout > 1) return fromLayout;

  const slideW = slides[0].getBoundingClientRect().width;
  if (slideW <= 1) return 0;
  return Math.max(0, slideW * (slides.length - 1) + gap * (slides.length - 1));
}

/** Вертикальный шаг на один слайд ленты — от viewport, не от горизонтальных px. */
export function horizontalScrubStepPx(vh) {
  return Math.max(remPx(MOTION.horizontalStrip.stepMinPx), vh * MOTION.horizontalStrip.stepVh);
}

/** Вертикальный ход: фиксированный шаг на карточку (предсказуемый scrub, без скачков от mx). */
export function horizontalScrubScrollTravelPx(slideCount, vh) {
  const step = horizontalScrubStepPx(vh);
  if (slideCount <= 1) return Math.max(remPx(48), step * 0.35);
  return (slideCount - 1) * step;
}

/** Полный span runway: scrub + опциональный exit handoff. */
export function horizontalScrubRunwaySpanPx(slideCount, vh, { cinematic = true } = {}) {
  const scrollSpan = horizontalScrubScrollTravelPx(slideCount, vh);
  const exitSpan = cinematic ? scrubExitSpanPx(vh) : 0;
  return scrollSpan + exitSpan;
}
