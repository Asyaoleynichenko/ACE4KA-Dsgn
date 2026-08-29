/**
 * ACE4KA: scaleX как у condensed, кегль растёт, пока визуальная ширина = экран.
 */
export function fitFooterWordmark(el) {
  if (!el) return;
  const box = el.closest('.site-footer__wordmark') || el.parentElement;
  if (!box) return;

  el.style.removeProperty('--scale-x');
  el.style.removeProperty('font-size');
  el.style.setProperty('--footer-word-grow', '1');
  el.style.setProperty('--tc-scale-x', '0.48');
  el.style.setProperty('letter-spacing', '0.06em');

  const available = box.clientWidth;
  if (available < 8) return;

  const visual = el.getBoundingClientRect().width;
  const currentFont = Number.parseFloat(getComputedStyle(el).fontSize);
  if (visual < 1 || !Number.isFinite(currentFont) || currentFont < 1) return;

  const next = currentFont * (available / visual);
  if (!Number.isFinite(next) || next < 8) return;

  el.style.setProperty('--footer-word-base', `${next}px`);
  el.style.setProperty('--footer-word-grow', '1');
}
