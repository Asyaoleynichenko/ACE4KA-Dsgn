import { remPx } from './cssRem.js';
import { MOTION } from '../motion/motionSystem.js';
import { scrubExitSpanPx } from './scrubExitHandoff.js';

/** Вертикальный шаг на один слайд ленты — от viewport, не от горизонтальных px. */
export function horizontalScrubStepPx(vh) {
  return Math.max(remPx(MOTION.horizontalStrip.stepMinPx), vh * MOTION.horizontalStrip.stepVh);
}

/** Вертикальный ход, пока лента проходит все карточки (не больше реального mx). */
export function horizontalScrubScrollTravelPx(slideCount, vh, mx = 0) {
  const step = horizontalScrubStepPx(vh);
  if (slideCount <= 1) return Math.max(remPx(48), step * 0.35);
  const fromSteps = (slideCount - 1) * step;
  if (mx > 1) return Math.min(fromSteps, mx * 0.92);
  return fromSteps;
}

/** Полный span runway: scrub + опциональный exit handoff. */
export function horizontalScrubRunwaySpanPx(slideCount, vh, { cinematic = true, mx = 0 } = {}) {
  const scrollSpan = horizontalScrubScrollTravelPx(slideCount, vh, mx);
  const exitSpan = cinematic ? scrubExitSpanPx(vh) : 0;
  return scrollSpan + exitSpan;
}
