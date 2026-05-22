import {
  MOTION_EASE_CSS,
  MOTION_STAGGER_BEAT,
  MOTION_DURATION_REVEAL,
  MOTION_DURATION_MICRO,
  MOTION_DURATION_MICRO_FAST,
} from './motionSystem.js';

/**
 * Framer Motion — та же кривая, что :root --ease-smart и GSAP camera/reveal.
 */
export const SMART_EASE = [0.32, 0.72, 0, 1];

export {
  MOTION_STAGGER_BEAT as SMART_STAGGER_BEAT,
  MOTION_DURATION_REVEAL as SMART_DURATION_REVEAL,
  MOTION_DURATION_MICRO as SMART_DURATION_MICRO,
  MOTION_DURATION_MICRO_FAST as SMART_DURATION_MICRO_FAST,
};

/** Framer — раскрытия / панели / stagger (как hyp-list, spy-nav). */
export function smartTween(durationSeconds = MOTION_DURATION_MICRO, extra = {}) {
  return { type: 'tween', ease: SMART_EASE, duration: durationSeconds, ...extra };
}

/** Framer — компактные входы (точки, строки). */
export function smartTweenFast(durationSeconds = MOTION_DURATION_MICRO_FAST, extra = {}) {
  return { type: 'tween', ease: SMART_EASE, duration: durationSeconds, ...extra };
}

export const SMART_EASE_CSS = MOTION_EASE_CSS;

export function smartTweenReduced() {
  return { duration: 0 };
}
