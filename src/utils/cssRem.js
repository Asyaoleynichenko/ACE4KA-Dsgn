/** База rem для перевода px → rem (совпадает с браузерным default 16px). */
export const CSS_REM_BASE = 16;

/** Число px из макета → строка rem для inline-стилей и CSS-переменных. */
export function rem(px) {
  const n = Number(px);
  if (!Number.isFinite(n) || n === 0) return '0';
  const value = n / CSS_REM_BASE;
  const str = value.toFixed(4).replace(/\.?0+$/, '');
  return `${str}rem`;
}

function rootFontSizePx() {
  if (typeof document === 'undefined') return CSS_REM_BASE;
  const root = parseFloat(getComputedStyle(document.documentElement).fontSize);
  return Number.isFinite(root) && root > 0 ? root : CSS_REM_BASE;
}

/** px из макета → число CSS px для scroll/layout (getBoundingClientRect и т.п.). */
export function remPx(designPx) {
  return (Number(designPx) / CSS_REM_BASE) * rootFontSizePx();
}
