/** Инерция ленты: current += (target - current) * 0.08 — «тяжёлая» камера */
export const SCRUB_LERP_ALPHA = 0.08;
export const SCRUB_LERP_SNAP_PX = 0.35;

/** Слои глубины: разная скорость / parallax / scale — объекты в 3D-потоке, не синхронный сдвиг */
const CARD_LAYERS = [
  { speed: 1, parallax: 1, scale: 1, rotate: 0.85, z: 1, stagger: 0 },
  { speed: 1.12, parallax: 1.18, scale: 0.99, rotate: 1, z: 1.1, stagger: 0.05 },
  { speed: 0.88, parallax: 0.78, scale: 1.03, rotate: 0.8, z: 0.86, stagger: 0.1 },
  { speed: 1.06, parallax: 1.08, scale: 0.97, rotate: 0.95, z: 1.04, stagger: 0.16 },
  { speed: 0.92, parallax: 0.88, scale: 1.01, rotate: 0.88, z: 0.92, stagger: 0.22 },
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

/** Scroll-bound progress 0…1: вертикальный скролл = timeline scrub (span = runway-spacer). */
export function scrollProgress01(runway, sticky, spacer) {
  if (!runway) return 0;
  const pin = sticky ?? runway;
  const stickyTop = parseFloat(getComputedStyle(pin).top) || 0;
  const rect = runway.getBoundingClientRect();
  const pinH = sticky?.offsetHeight ?? pin.offsetHeight ?? 0;
  const spacerH = spacer?.offsetHeight ?? 0;
  const span = Math.max(1, spacerH || runway.offsetHeight - pinH);
  const scrolled = stickyTop - rect.top;
  return clamp01(scrolled / span);
}

/**
 * Горизонтальный track + per-card depth (parallax, scale, Z, лёгкий rotate).
 * Без тяжёлого blur/glow — глубина через transform и opacity.
 */
export function applyCinematicCardTransforms(
  inner,
  viewport,
  smoothX,
  progress01 = 0,
  velocityPx = 0,
  exitP = 0,
) {
  const slides = inner.querySelectorAll(':scope > *');
  if (!slides.length) return { mx: 0, step: 0 };

  const slideW = slides[0].getBoundingClientRect().width;
  const gap = parseFloat(getComputedStyle(inner).columnGap || getComputedStyle(inner).gap) || 0;
  const step = slideW + gap;
  const mx = Math.max(0, inner.scrollWidth - viewport.clientWidth);

  if (mx <= 1) {
    inner.style.transform = 'none';
  inner.querySelectorAll(':scope > *').forEach((slide) => {
    slide.style.transform = '';
    slide.style.opacity = '';
    slide.style.filter = '';
    slide.style.zIndex = '';
    slide.style.pointerEvents = '';
  });
    return { mx: 0, step };
  }

  const vw = viewport.clientWidth || 1;
  const holdAtEnd = exitP > 0.004;
  const xTrack = holdAtEnd ? mx : smoothX;
  const focus = xTrack + vw * 0.5;

  inner.style.transform = `translate3d(${-xTrack.toFixed(2)}px, 0, 0)`;

  slides.forEach((slide, i) => {
    const layer = cardLayer(i);
    const center = i * step + slideW * 0.5;
    const distSlides = (center - focus) / Math.max(step, 1);
    const ad = Math.abs(distSlides);

    const staggerT = clamp01((progress01 - layer.stagger) / Math.max(0.001, 1 - layer.stagger * 0.85));
    const enter = 0.88 + staggerT * 0.12;

    const exitDim = holdAtEnd && i < slides.length - 1 ? 0.72 : 1;
    const lastCardSettle = holdAtEnd && i === slides.length - 1 ? 1 - exitP * 0.06 : 1;
    /* Без scale/rotate/blur на карточках — только сдвиг ленты; текст остаётся резким */
    const inView = ad < 0.72;
    const opacity = inView ? Math.max(0.92, exitDim * (0.96 + staggerT * 0.04)) : 0;
    const scale = inView ? lastCardSettle : 1;

    slide.style.transform = inView ? `scale(${scale.toFixed(4)})` : 'none';
    slide.style.opacity = opacity.toFixed(3);
    slide.style.filter = '';
    slide.style.zIndex = String(100 + Math.round((1 - Math.min(ad, 1.4)) * 20));
    slide.style.pointerEvents = inView ? '' : 'none';
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
    slide.style.pointerEvents = '';
  });
}
