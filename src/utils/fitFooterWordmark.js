const FILL_SCALE = 0.65;

/**
 * Подгоняет кегль ACE4KA так, чтобы при scaleX(0.65) слово занимало ширину контейнера.
 * Высота = font-size, ширина = scaleX — кегль не заменяет сжатие.
 */
export function fitFooterWordmark(el) {
  if (!el) return;
  const box = el.closest('.site-footer__wordmark') || el.parentElement;
  if (!box) return;

  const available = box.clientWidth;
  if (available < 8) return;

  const cs = getComputedStyle(el);
  const scaleRaw = cs.getPropertyValue('--scale-x').trim() || cs.getPropertyValue('--tc-scale-x').trim();
  const currentScale = Number.parseFloat(scaleRaw);
  const scale = Number.isFinite(currentScale) && currentScale > 0 ? currentScale : FILL_SCALE;

  const visual = el.getBoundingClientRect().width;
  if (visual < 1) return;

  const natural = visual / scale;
  const currentFont = Number.parseFloat(cs.fontSize);
  if (!Number.isFinite(currentFont) || currentFont < 1) return;

  const next = currentFont * (available / (natural * FILL_SCALE));
  if (!Number.isFinite(next) || next < 8) return;

  el.style.fontSize = `${next}px`;
}
