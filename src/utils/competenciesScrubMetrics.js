import { remPx } from './cssRem.js';
import { MOTION } from '../motion/motionSystem.js';

/** Вертикальный шаг на одну смену строки компетенций (без «кинотеатра» на 3+ экрана). */
export function competenciesStepPx(vh) {
  return Math.max(remPx(MOTION.competencies.stepMinPx), vh * MOTION.competencies.stepVh);
}

/** Скролл, пока sticky держит сцену: (n−1) шагов между строками. */
export function competenciesScrollTravelPx(lineCount, vh) {
  const step = competenciesStepPx(vh);
  if (lineCount <= 1) return Math.max(remPx(48), step * 0.35);
  return (lineCount - 1) * step;
}

/** min-height runway = видимая зона sticky + travel */
export function competenciesRunwayMinPx({ lineCount, vh, pinTopPx }) {
  const stickyVisible = Math.max(vh * 0.5, vh - pinTopPx);
  const travel = competenciesScrollTravelPx(lineCount, vh);
  return Math.ceil(stickyVisible + travel);
}
