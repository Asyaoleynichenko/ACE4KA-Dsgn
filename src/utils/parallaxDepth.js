import { depthBlurFilter, depthBlurPx } from './depthBlur.js';

/** Пресеты глубины: фон → передний план */
export const DEPTH_SPEED_PRESETS = [0.8, 1, 1.2, 1.6];

const SPEED_MIN = 0.5;
const SPEED_MAX = 2;

export function readElementSpeed(el, index = 0) {
  const raw = el?.dataset?.speed ?? el?.getAttribute?.('data-speed');
  if (raw != null && raw !== '') {
    const n = parseFloat(raw);
    if (Number.isFinite(n)) return Math.min(SPEED_MAX, Math.max(SPEED_MIN, n));
  }
  return DEPTH_SPEED_PRESETS[index % DEPTH_SPEED_PRESETS.length];
}

/**
 * Слои глубины для горизонтальной ленты (scrub): разная скорость, scale, z.
 * @returns {{ x: number, y: number, scale: number, zIndex: number }}
 */
export function depthLayerTransform({
  speed,
  slideCenterX,
  viewportCenterX,
  viewportWidth,
  progress01 = 0,
  velocityPx = 0,
}) {
  const depth = speed - 1;
  const vw = Math.max(1, viewportWidth);
  const relX = (slideCenterX - viewportCenterX) / vw;

  const x = depth * relX * vw * 0.14 + depth * velocityPx * 0.4;
  const y = depth * progress01 * -18 + depth * relX * 14;
  const scale = 1 + depth * 0.1;
  const zIndex = Math.round(12 + speed * 10);

  return { x, y, scale, zIndex };
}

/** Вертикальный parallax при скролле страницы (preview-grid и т.д.). */
export function depthVerticalTransform({ speed, elementCenterY, viewportHeight }) {
  const vh = Math.max(1, viewportHeight);
  const depth = speed - 1;
  const norm = (elementCenterY - vh * 0.5) / vh;
  const y = norm * depth * vh * 0.14;
  const scale = 1 + depth * 0.085;
  const zIndex = Math.round(8 + speed * 10);

  return { x: 0, y, scale, zIndex };
}

function formatTransform({ x, y, scale }) {
  const sx = scale.toFixed(4);
  const sy = scale.toFixed(4);
  return `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${sx}, ${sy})`;
}

function skipDepthBlur(el) {
  return Boolean(
    el.classList?.contains('preview-card') ||
      el.classList?.contains('card') ||
      el.closest?.(
        '.preview-card, .scroll-scrub-row__inner > .card, .home-competencies, .home-competencies-scrub__stage, .home-competencies-scrub__lines',
      ),
  );
}

export function applyDepthStyles(el, transform, { clear = false, blurPx = 0 } = {}) {
  if (!el) return;
  if (clear) {
    el.style.transform = '';
    el.style.zIndex = '';
    el.style.filter = '';
    el.style.removeProperty('--depth-scale');
    el.style.removeProperty('--depth-blur');
    el.classList.remove('parallax-depth--active');
    return;
  }
  el.style.transform = formatTransform(transform);
  el.style.zIndex = String(transform.zIndex);
  el.style.setProperty('--depth-scale', transform.scale.toFixed(4));
  const blur = depthBlurFilter(blurPx);
  el.style.filter = blur;
  if (blur) el.style.setProperty('--depth-blur', `${blurPx.toFixed(2)}px`);
  else el.style.removeProperty('--depth-blur');
  el.classList.add('parallax-depth--active');
}

/**
 * Горизонтальная лента: каждый слайд движется с своей «глубиной».
 */
export function applyParallaxDepthToSlides(inner, viewport, { progress01 = 0, velocityPx = 0 } = {}) {
  if (!inner || !viewport) return;

  const slides = inner.querySelectorAll(':scope > *');
  if (!slides.length) return;

  const vpRect = viewport.getBoundingClientRect();
  const vpCenterX = vpRect.left + vpRect.width / 2;

  slides.forEach((slide, index) => {
    const speed = readElementSpeed(slide, index);
    const rect = slide.getBoundingClientRect();
    const slideCenterX = rect.left + rect.width / 2;
    const t = depthLayerTransform({
      speed,
      slideCenterX,
      viewportCenterX: vpCenterX,
      viewportWidth: vpRect.width,
      progress01,
      velocityPx,
    });
    const blurPx = skipDepthBlur(slide)
      ? 0
      : depthBlurPx(slideCenterX, vpCenterX, vpRect.width, {
          maxBlur: 4 + (speed - 1) * 3,
        });
    applyDepthStyles(slide, t, { blurPx });
  });
}

export function resetParallaxDepthIn(container) {
  if (!container) return;
  container.querySelectorAll(':scope > *, [data-speed].parallax-depth--active').forEach((el) => {
    applyDepthStyles(el, null, { clear: true });
  });
}

/** Все [data-speed] вне горизонтальных scrub-лент. */
export function applyVerticalParallaxDepth(root = document) {
  if (typeof window === 'undefined') return;

  const vh = window.innerHeight;
  const nodes = root.querySelectorAll('[data-speed]');

  nodes.forEach((el, index) => {
    if (
      el.closest(
        '.scroll-scrub-row__inner, .preview-grid, .project-grid, .home-competencies-scrub, .home-competencies-scrub__lines, .home-competencies-scrub__center',
      )
    ) {
      return;
    }

    const rect = el.getBoundingClientRect();
    if (rect.bottom < -vh * 0.2 || rect.top > vh * 1.2) {
      applyDepthStyles(el, null, { clear: true });
      return;
    }

    const speed = readElementSpeed(el, index);
    const centerY = rect.top + rect.height / 2;
    const centerX = rect.left + rect.width / 2;
    const t = depthVerticalTransform({ speed, elementCenterY: centerY, viewportHeight: vh });
    const blurPx = skipDepthBlur(el)
      ? 0
      : depthBlurPx(centerX, window.innerWidth / 2, window.innerWidth, {
          maxBlur: 2.2 + (speed - 1) * 1.5,
          sharpRadius: 0.28,
        });
    applyDepthStyles(el, t, { blurPx });
  });
}
