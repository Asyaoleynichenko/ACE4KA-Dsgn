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

/** Скролл, пока sticky держит сцену: (n−1) шагов между строками. */
export function competenciesScrollTravelPx(lineCount, vh) {
  const step = competenciesStepPx(vh);
  if (lineCount <= 1) return Math.max(remPx(48), step * 0.35);
  return (lineCount - 1) * step;
}

/** Высота нижнего spacer в runway — только ход scrub между строками (без дубля 100dvh). */
export function competenciesRunwayTravelPx(lineCount, vh = competenciesViewportHeightPx()) {
  const safeVh = clampPx(vh, 320, 1600);
  const safeLines = clampPx(lineCount, 1, 12);
  const travel = competenciesScrollTravelPx(safeLines, safeVh);
  const cap = Math.ceil(safeVh * 1.35);
  return Math.min(Math.ceil(travel), cap);
}

/** @deprecated Используйте competenciesRunwayTravelPx + spacer, не min-height runway */
export function competenciesRunwayMinPx(args) {
  return competenciesRunwayTravelPx(args.lineCount, args.vh);
}
