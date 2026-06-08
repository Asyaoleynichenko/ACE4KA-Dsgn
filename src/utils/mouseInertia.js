import { MOTION_LERP } from '../motion/motionSystem.js';

/** Mouse float — та же физика, что Lenis и scrub */
export const FLOAT_LERP_ALPHA = MOTION_LERP;
export const FLOAT_SNAP_PX = MOTION_LERP;

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
  if (el.matches?.('.hero-text, .hero-role')) return 10;
  if (el.matches?.('.preview-card-block, .hero__card .preview-card-block')) return 24;
  if (el.matches?.('.hero-vector__inner, .hero-vector__inner img')) return 22;
  if (el.matches?.('.card, .scroll-scrub-row__inner > .card')) return 20;
  if (el.matches?.('.header-item, .header-item__float')) return 12;
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
    const mode = el.dataset.floatMode;

    if (mode === 'local') {
      /* Локальный режим: папка реагирует на собственное расстояние до курсора. Чем ближе курсор — тем сильнее притяжение, далеко — почти не двигается. */
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2 - s.cx;
      const cy = rect.top + rect.height / 2 - s.cy;
      const dx = pointer.x - cx;
      const dy = pointer.y - cy;
      const dist = Math.hypot(dx, dy);
      const reach = 380;
      const falloff = Math.max(0, 1 - dist / reach);
      const pull = 0.18 * strength;
      let tx = dx * pull * falloff;
      let ty = dy * pull * falloff;
      if (Math.abs(tx) > range) tx = Math.sign(tx) * range;
      if (Math.abs(ty) > range) ty = Math.sign(ty) * range;
      s.tx = tx;
      s.ty = ty;
    } else {
      s.tx = nx * range;
      s.ty = ny * range * 0.85;
    }

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
    (el) =>
      el instanceof HTMLElement &&
      !el.closest('[data-float="off"]') &&
      !el.closest('.preview-card') &&
      !el.closest('.scroll-scrub-row'),
  );
}
