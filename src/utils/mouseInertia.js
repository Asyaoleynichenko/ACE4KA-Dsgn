/** Mouse float: current += (target - current) * 0.08 */
export const FLOAT_LERP_ALPHA = 0.08;
export const FLOAT_SNAP_PX = 0.08;

export function lerpFloat(current, target, alpha = FLOAT_LERP_ALPHA) {
  if (Math.abs(target - current) <= FLOAT_SNAP_PX) return target;
  return current + (target - current) * alpha;
}

const stateByEl = new WeakMap();

export function getFloatState(el) {
  if (!stateByEl.has(el)) {
    stateByEl.set(el, { cx: 0, cy: 0, tx: 0, ty: 0 });
  }
  return stateByEl.get(el);
}

export function readFloatStrength(el) {
  const raw = el?.dataset?.float;
  if (raw == null || raw === '') return 1;
  const n = parseFloat(raw);
  return Number.isFinite(n) && n > 0 ? Math.min(2.5, n) : 1;
}

export function readFloatRange(el) {
  const raw = el?.dataset?.floatRange;
  if (raw == null || raw === '') return null;
  const n = parseFloat(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function defaultFloatRange(el) {
  if (el.matches?.('.hero-title, h1, h2.projects-title-main')) return 16;
  if (el.matches?.('.hero-text, .hero-role, .preview-card__title, .preview-card__meta')) return 10;
  if (el.matches?.('.preview-image, .preview-card-block__image, .preview-card-block__image img')) return 30;
  if (el.matches?.('.preview-card-block, .hero__card .preview-card-block')) return 18;
  if (el.matches?.('.hero-vector__inner, .hero-vector__inner img')) return 22;
  if (el.matches?.('.card, .scroll-scrub-row__inner > .card')) return 20;
  if (el.matches?.('.header-item')) return 12;
  return 18;
}

function applyFloatVars(el, x, y) {
  if (Math.abs(x) < 0.04 && Math.abs(y) < 0.04) {
    el.style.removeProperty('--float-x');
    el.style.removeProperty('--float-y');
    return;
  }
  el.style.setProperty('--float-x', `${x.toFixed(2)}px`);
  el.style.setProperty('--float-y', `${y.toFixed(2)}px`);
}

/**
 * @param {{ x: number, y: number }} pointer — client coords
 * @param {HTMLElement[]} elements
 */
export function tickMouseFloat(pointer, elements) {
  const vw = window.innerWidth || 1;
  const vh = window.innerHeight || 1;
  const nx = (pointer.x / vw - 0.5) * 2;
  const ny = (pointer.y / vh - 0.5) * 2;

  for (const el of elements) {
    const s = getFloatState(el);
    const strength = readFloatStrength(el);
    const range = (readFloatRange(el) ?? defaultFloatRange(el)) * strength;

    s.tx = nx * range;
    s.ty = ny * range * 0.85;
    s.cx = lerpFloat(s.cx, s.tx);
    s.cy = lerpFloat(s.cy, s.ty);
    applyFloatVars(el, s.cx, s.cy);
  }
}

/** Плавный возврат в покой, когда курсор ушёл. */
export function decayMouseFloat(elements) {
  let anyActive = false;

  for (const el of elements) {
    const s = getFloatState(el);
    s.tx = 0;
    s.ty = 0;
    s.cx = lerpFloat(s.cx, 0);
    s.cy = lerpFloat(s.cy, 0);

    if (Math.abs(s.cx) > FLOAT_SNAP_PX || Math.abs(s.cy) > FLOAT_SNAP_PX) {
      anyActive = true;
      applyFloatVars(el, s.cx, s.cy);
    } else {
      s.cx = 0;
      s.cy = 0;
      el.style.removeProperty('--float-x');
      el.style.removeProperty('--float-y');
    }
  }

  return anyActive;
}

export function collectFloatElements(root = document) {
  return Array.from(root.querySelectorAll('[data-float]')).filter(
    (el) => el instanceof HTMLElement && !el.closest('[data-float="off"]'),
  );
}
