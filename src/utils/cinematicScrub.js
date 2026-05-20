/** Инерция ленты: current += (target - current) * α */
export const SCRUB_LERP_ALPHA = 0.08;
export const SCRUB_LERP_SNAP_PX = 0.35;

/** Параметры «глубины» по индексу карточки — разная скорость / масштаб / parallax. */
const CARD_LAYERS = [
  { speed: 1, parallax: 1, scale: 1, rotate: 1, z: 1, stagger: 0 },
  { speed: 1.14, parallax: 1.22, scale: 0.98, rotate: 1.08, z: 1.12, stagger: 0.06 },
  { speed: 0.9, parallax: 0.82, scale: 1.04, rotate: 0.92, z: 0.88, stagger: 0.12 },
  { speed: 1.08, parallax: 1.1, scale: 0.96, rotate: 1.05, z: 1.06, stagger: 0.18 },
  { speed: 0.94, parallax: 0.9, scale: 1.02, rotate: 0.96, z: 0.94, stagger: 0.24 },
];

export function lerpScalar(current, target, alpha = SCRUB_LERP_ALPHA) {
  if (Math.abs(target - current) <= SCRUB_LERP_SNAP_PX) return target;
  return current + (target - current) * alpha;
}

export function cardLayer(index) {
  return CARD_LAYERS[index % CARD_LAYERS.length];
}

function clamp01(v) {
  return Math.min(1, Math.max(0, v));
}

/**
 * Scroll progress 0…1 по runway + sticky (scroll-bound, не trigger).
 */
export function scrollProgress01(runway, sticky) {
  if (!runway) return 0;
  const pin = sticky ?? runway;
  const stickyTop = parseFloat(getComputedStyle(pin).top) || 0;
  const rect = runway.getBoundingClientRect();
  const pinH = sticky?.offsetHeight ?? pin.offsetHeight ?? 0;
  const span = Math.max(1, runway.offsetHeight - pinH);
  const scrolled = stickyTop - rect.top;
  return clamp01(scrolled / span);
}

/**
 * Базовый сдвиг ленты + per-card parallax / scale / opacity / rotateY / blur.
 * smoothX — сглаженная позиция (lerp), progress01 — сырой scrub от скролла.
 */
export function applyCinematicCardTransforms(inner, viewport, smoothX, progress01 = 0, velocityPx = 0) {
  const slides = inner.querySelectorAll(':scope > *');
  if (!slides.length) return { mx: 0, step: 0 };

  const slideW = slides[0].getBoundingClientRect().width;
  const gap = parseFloat(getComputedStyle(inner).columnGap || getComputedStyle(inner).gap) || 0;
  const step = slideW + gap;
  const mx = Math.max(0, inner.scrollWidth - viewport.clientWidth);

  if (mx <= 1) {
    inner.style.transform = 'none';
    slides.forEach((slide) => {
      slide.style.transform = '';
      slide.style.opacity = '';
      slide.style.filter = '';
      slide.style.zIndex = '';
    });
    return { mx: 0, step };
  }

  const vw = viewport.clientWidth || 1;
  const focus = smoothX + vw * 0.5;
  const motionBlur = Math.min(5, Math.abs(velocityPx) * 0.12);

  inner.style.transform = `translate3d(${-smoothX.toFixed(2)}px, 0, 0)`;

  slides.forEach((slide, i) => {
    const layer = cardLayer(i);
    const center = i * step + slideW * 0.5;
    const distSlides = (center - focus) / Math.max(step, 1);
    const ad = Math.abs(distSlides);

    const staggerT = clamp01((progress01 - layer.stagger) / Math.max(0.001, 1 - layer.stagger * 0.85));
    const enter = 0.82 + staggerT * 0.18;

    const parallaxX = distSlides * step * 0.2 * layer.parallax;
    const speedOffset = (progress01 - 0.5) * step * 0.06 * (layer.speed - 1);
    const scale = Math.max(0.82, (1 - ad * 0.075) * layer.scale * enter);
    const opacity = Math.max(0.38, (1 - ad * 0.34) * (0.55 + staggerT * 0.45));
    const tz = (1 - Math.min(ad, 1.35)) * 88 * layer.z - ad * 18;
    const ty = ad * 18 + (1 - staggerT) * 8;
    const ry = distSlides * -4.8 * layer.rotate;
    const rx = distSlides * 0.35 * layer.rotate;
    const blur = (ad > 0.42 ? Math.min(4.5, (ad - 0.42) * 5.5) : 0) + motionBlur * (0.35 + ad * 0.25);

    slide.style.transform = [
      `translate3d(${(parallaxX + speedOffset).toFixed(2)}px, ${ty.toFixed(2)}px, ${tz.toFixed(2)}px)`,
      `scale(${scale.toFixed(4)})`,
      `rotateY(${ry.toFixed(3)}deg)`,
      `rotateX(${rx.toFixed(3)}deg)`,
    ].join(' ');
    slide.style.opacity = opacity.toFixed(3);
    slide.style.filter = blur > 0.08 ? `blur(${blur.toFixed(2)}px)` : '';
    slide.style.zIndex = String(100 + Math.round((1 - Math.min(ad, 1.6)) * 32 * layer.z));
  });

  return { mx, step };
}

export function resetCinematicCardTransforms(inner) {
  if (!inner) return;
  inner.style.transform = '';
  inner.querySelectorAll(':scope > *').forEach((slide) => {
    slide.style.transform = '';
    slide.style.opacity = '';
    slide.style.filter = '';
    slide.style.zIndex = '';
  });
}
