/**
 * Fake depth of field: центр viewport — sharp, края — subtle blur.
 * @returns {number} blur в px
 */
export function depthBlurPx(
  elementCenterX,
  viewportCenterX,
  viewportWidth,
  { maxBlur = 5.5, sharpRadius = 0.22 } = {},
) {
  const half = Math.max(1, viewportWidth / 2);
  const dist = Math.abs(elementCenterX - viewportCenterX) / half;
  const t = Math.min(1, Math.max(0, (dist - sharpRadius) / (1 - sharpRadius)));
  return t * t * maxBlur;
}

export function depthBlurFilter(blurPx) {
  if (!blurPx || blurPx < 0.08) return '';
  return `blur(${blurPx.toFixed(2)}px)`;
}
