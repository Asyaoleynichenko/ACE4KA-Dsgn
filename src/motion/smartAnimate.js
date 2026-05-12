/**
 * Единый tween (без отскока) — та же кривая, что :root --ease-smart в css/style.css.
 * Кривая в духе системного UI (iOS / современный Telegram): быстрый старт, мягкое замедление.
 */
export const SMART_EASE = [0.32, 0.72, 0, 1];

export function smartTween(durationSeconds = 0.32, extra = {}) {
  return { type: 'tween', ease: SMART_EASE, duration: durationSeconds, ...extra };
}

export function smartTweenReduced() {
  return { duration: 0 };
}
