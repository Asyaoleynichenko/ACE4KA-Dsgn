import { remPx } from './cssRem.js';
import { MOTION } from '../motion/motionSystem.js';

function clampPx(value, min, max) {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

/** Высота viewport для scrub — только окно, никогда scrollHeight / #root. */
export function competenciesViewportHeightPx() {
  if (typeof window === 'undefined') return 800;
  const vh = window.visualViewport?.height ?? window.innerHeight;
  return clampPx(vh, 320, 1600);
}

/** Вертикальный шаг на одну смену строки компетенций (без «кинотеатра» на 3+ экрана). */
export function competenciesStepPx(vh) {
  const safeVh = clampPx(vh, 320, 1600);
  return Math.max(remPx(MOTION.competencies.stepMinPx), safeVh * MOTION.competencies.stepVh);
}

/** Скролл, пока pin держит сцену: по одному шагу на каждую строку. */
export function competenciesScrollTravelPx(lineCount, vh) {
  const step = competenciesStepPx(vh);
  if (lineCount <= 1) return Math.max(remPx(48), step * 0.5);
  return lineCount * step;
}

/** @deprecated Pin-spacer ScrollTrigger задаёт высоту runway — ручной spacer не нужен */
export function competenciesRunwayTravelPx(lineCount, vh = competenciesViewportHeightPx()) {
  return competenciesScrollTravelPx(lineCount, vh);
}

/** @deprecated Используйте competenciesRunwayTravelPx + spacer, не min-height runway */
export function competenciesRunwayMinPx(args) {
  return competenciesRunwayTravelPx(args.lineCount, args.vh);
}
