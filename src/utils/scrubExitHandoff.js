import { remPx } from './cssRem.js';

/** Доля вертикального хода runway, отведённая под «наезд» следующего блока (горизонт = 1). */
export const SCRUB_EXIT_PHASE_RATIO = 0.22;

export function scrubExitSpanPx(vh) {
  return Math.max(remPx(220), vh * 0.42);
}

export function splitScrubProgress(rawP) {
  const exitStart = 1 - SCRUB_EXIT_PHASE_RATIO;
  if (rawP <= exitStart) {
    return { scrubP: exitStart > 0 ? rawP / exitStart : 0, exitP: 0 };
  }
  return { scrubP: 1, exitP: Math.min(1, (rawP - exitStart) / SCRUB_EXIT_PHASE_RATIO) };
}

export function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

/** Секция сразу после ленты карточек (narrative / body / images). */
export function resolveHandoffTarget(runway) {
  const host = runway.closest('section');
  if (!host) return null;
  let el = host.nextElementSibling;
  while (el) {
    if (el.matches?.('section.case-study-narrative, section.section, section.images')) return el;
    el = el.nextElementSibling;
  }
  return null;
}

export function applyScrubExitHandoff(target, exitP) {
  if (!target) return;
  const eased = easeOutCubic(exitP);
  target.style.setProperty('--scrub-exit', eased.toFixed(4));
  target.classList.toggle('is-scrub-exit-active', exitP > 0.14);
  target.classList.toggle('is-scrub-exit-done', exitP >= 0.995);
}

export function clearScrubExitHandoff(target) {
  if (!target) return;
  target.style.removeProperty('--scrub-exit');
  target.classList.remove('is-scrub-exit-active', 'is-scrub-exit-done', 'scroll-scrub-handoff-target');
}
