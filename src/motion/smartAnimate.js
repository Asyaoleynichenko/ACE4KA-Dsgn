import {
  MOTION_EASE_CSS,
  MOTION_STAGGER_BEAT,
  MOTION_DURATION_REVEAL,
} from './motionSystem.js';

/**
 * Framer Motion — та же кривая, что :root --ease-smart и GSAP camera/reveal.
 */
export const SMART_EASE = [0.32, 0.72, 0, 1];

export { MOTION_STAGGER_BEAT as SMART_STAGGER_BEAT, MOTION_DURATION_REVEAL as SMART_DURATION_REVEAL };

export function smartTween(durationSeconds = MOTION_STAGGER_BEAT * 3.5, extra = {}) {
  return { type: 'tween', ease: SMART_EASE, duration: durationSeconds, ...extra };
}

export const SMART_EASE_CSS = MOTION_EASE_CSS;

export function smartTweenReduced() {
  return { duration: 0 };
}
